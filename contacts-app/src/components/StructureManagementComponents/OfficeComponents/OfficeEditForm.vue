<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { object, string } from 'yup'
import { deleteItem, patchEdit, postCreate } from '@/services/services'
import { useNotification } from '@/stores/notification'
import { useUser } from '@/stores/user'
import { useCompany } from '@/composables/company'
import { computed, onBeforeMount, ref } from 'vue'
import type { office } from '@/interfaces/office'
import { useCompaniesOffices } from '@/composables/companies_offices'
import MultipleSelect from '@/components/MultipleSelectComponents/MultipleSelect.vue'

const props = defineProps<{
  item: office
}>()

const emits = defineEmits<{
  (e: 'update'): void
}>()

const notificationStore = useNotification()

const userStore = useUser()

const companyComposable = useCompany()

const companiesOfficesComposable = useCompaniesOffices()

const { errors, defineField } = useForm({
  validationSchema: toTypedSchema(
    object({
      officeName: string().trim(),
      street: string().trim().required(),
      streetNum: string().trim().required(),
      city: string().trim().required(),
      country: string().trim().required(),
    }),
  ),
})

const [officeName] = defineField('officeName')
const [street] = defineField('street')
const [streetNum] = defineField('streetNum')
const [city] = defineField('city')
const [country] = defineField('country')

const companies = ref([] as string[])

const isOfficeModified = computed(() => {
  if (
    props.item.city != city.value ||
    props.item.country != country.value ||
    props.item.name != officeName.value ||
    props.item.street != street.value ||
    props.item.street_number != streetNum.value
  ) {
    return true
  }
  return false
})

const isOfficeCompanyModified = computed(() => {
  if (companies.value.toString() != makeCompaniesArray().toString()) {
    return true
  }
  return false
})

onBeforeMount(() => {
  initializeData()
})

async function initializeData(): Promise<void> {
  companyComposable.fetchCompaniesData('collections/companies/records')
  officeName.value = props.item.name
  street.value = props.item.street
  streetNum.value = props.item.street_number
  city.value = props.item.city
  country.value = props.item.country
  await companiesOfficesComposable.fetchCompaniesOfficesData(
    `collections/companies_offices/records?filter=(office_id='${props.item.id}')`,
  )
  companies.value = makeCompaniesArray()
}

function makeCompaniesArray(): string[] {
  let array: string[] = new Array()
  if (companiesOfficesComposable.companies_offices_Array.value) {
    for (let i = 0; i < companiesOfficesComposable.companies_offices_Array.value.length; i++) {
      array[i] = companiesOfficesComposable.companies_offices_Array.value[i].company_id
    }
  }
  return array
}

const noErrors = computed(() => {
  if (
    errors.value.city ||
    errors.value.country ||
    errors.value.officeName ||
    errors.value.street ||
    errors.value.streetNum
  ) {
    return false
  }
  return true
})

async function editOffice(): Promise<void> {
  if (noErrors.value && (isOfficeCompanyModified.value || isOfficeCompanyModified.value)) {
    const form = new FormData()
    form.append('name', officeName.value as string)
    form.append('street', street.value as string)
    form.append('street_number', streetNum.value as string)
    form.append('city', city.value as string)
    form.append('country', country.value as string)
    try {
      await patchEdit(
        `collections/offices/records/${props.item.id}`,
        form, //@ts-ignore
        userStore.userData?.token,
      )
      notificationStore.addNotification({
        type: 'success',
        message: `Ofisas ${officeName.value} sėkmingai atnaujintas`,
      })
      await editOfficeCompanyRelations(props.item)
      emits('update')
    } catch (error) {
      notificationStore.addNotification({
        type: 'fail',
        message: `Ofiso ${officeName.value} atnaujinti nepavyko`,
      })
    }
  }
}

async function editOfficeCompanyRelations(office: office): Promise<void> {
  try {
    let defaultArray = makeCompaniesArray()
    for (let i = 0; i < companies.value.length; i++) {
      if (
        !defaultArray.find((item) => {
          return item == companies.value[i]
        })
      ) {
        const form2 = new FormData()
        form2.append('office_id', office.id)
        form2.append('company_id', companies.value[i])
        //@ts-ignore
        await postCreate('collections/companies_offices/records', form2, userStore.userData?.token)
      }
    }
    for (let i = 0; i < defaultArray.length; i++) {
      if (
        !companies.value.find((item) => {
          return item == defaultArray[i]
        })
      ) {
        deleteItem(
          `collections/companies_offices/records/${getRelationId(defaultArray[i])}`, //@ts-ignore
          userStore.userData?.token,
        )
      }
    }
    if (companies.value.length > 0) {
      notificationStore.addNotification({
        type: 'success',
        message: 'Sėkmingai atnaujinti ofisų ir kompanijų santykiai',
      })
    }
  } catch (error) {
    console.error(error)
    notificationStore.addNotification({
      type: 'fail',
      message: 'Klaida atnaujinant santykius tarp ofiso ir kompanijų',
    })
    emits('update')
  }
}

function getRelationId(companyId: string): string {
  if (companiesOfficesComposable.companies_offices_Array.value)
    for (let i = 0; i < companiesOfficesComposable.companies_offices_Array.value.length; i++) {
      if (companiesOfficesComposable.companies_offices_Array.value[i].company_id == companyId) {
        return companiesOfficesComposable.companies_offices_Array.value[i].id
      }
    }
  return ''
}
</script>

<template>
  <div class="pl-[50px] pr-[50px]">
    <p class="text-[30px] pb-[30px] pl-[50px]">Redaguoti ofisą:</p>
    <div class="formRow">
      <div class="formColumn">
        <div class="block pb-[10px]">
          <p>Pavadinimas:</p>
          <input
            class="contactInput"
            type="text"
            placeholder="Įveskite ofiso pavadinimą..."
            v-model="officeName"
          />
          <p class="text-red-500">{{ errors.officeName }}</p>
        </div>
        <div class="block pb-[10px]">
          <p>Gatvė:</p>
          <input
            class="contactInput"
            type="text"
            placeholder="Įveskite gatvės pavadinimą..."
            v-model="street"
          />
          <p class="text-red-500">{{ errors.street }}</p>
        </div>
        <div class="block pb-[10px]">
          <p>Pastato numeris:</p>
          <input
            class="contactInput"
            type="number"
            placeholder="Įveskite pastato numerį..."
            v-model="streetNum"
          />
          <p class="text-red-500">{{ errors.streetNum }}</p>
        </div>
        <div class="block pb-[10px]">
          <p>Miestas:</p>
          <input class="contactInput" type="text" placeholder="Įveskite miestą..." v-model="city" />
          <p class="text-red-500">{{ errors.city }}</p>
        </div>
        <div class="block pb-[10px]">
          <p>Šalis:</p>
          <input
            class="contactInput"
            type="text"
            placeholder="Įveskite šalį..."
            v-model="country"
          />
          <p class="text-red-500">{{ errors.country }}</p>
        </div>
      </div>
      <div class="formColumn">
        <p>Įmonės:</p>
        <MultipleSelect
          :options="companyComposable.companyArray.value"
          :selected="companies"
          @change="(options: string[]) => (companies = options)"
        />
      </div>
    </div>
    <div class="pl-[50px] pb-[15px]">
      <button
        class="addButton"
        :class="{ active: !isOfficeModified && !isOfficeCompanyModified }"
        @click="editOffice"
      >
        ATNAUJINTI
      </button>
    </div>
  </div>
</template>
