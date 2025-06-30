<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { object, string } from 'yup'
import { postCreate } from '@/services/services'
import { useNotification } from '@/stores/notification'
import { useUser } from '@/stores/user'
import { useCompany } from '@/composables/company'
import { computed, onBeforeMount, ref } from 'vue'
import type { office } from '@/interfaces/office'
import MultipleSelect from '@/components/MultipleSelectComponents/MultipleSelect.vue'

const emits = defineEmits<{
  (e: 'update'): void
}>()

const notificationStore = useNotification()

const userStore = useUser()

const companyComposable = useCompany()

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

onBeforeMount(() => {
  companyComposable.fetchCompaniesData('collections/companies/records')
})

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

const isEmpty = computed(() => {
  if (city.value && country.value && officeName.value && street.value && streetNum.value) {
    return false
  }
  return true
})

async function createOffice(): Promise<void> {
  if (noErrors.value && !isEmpty.value) {
    const form = new FormData()
    form.append('name', officeName.value as string)
    form.append('street', street.value as string)
    form.append('street_number', streetNum.value as string)
    form.append('city', city.value as string)
    form.append('country', country.value as string)
    try {
      const office: office = await postCreate(
        'collections/offices/records',
        form, //@ts-ignore
        userStore.userData?.token,
      )
      notificationStore.addNotification({
        type: 'success',
        message: `Ofisas ${officeName.value} sėkmingai sukurtas`,
      })
      await createOfficeCompanyRelations(office)
      emits('update')
    } catch (error) {
      console.error(error)
      notificationStore.addNotification({
        type: 'fail',
        message: `Ofiso ${officeName.value} sukurti nepavyko`,
      })
    }
  }
}

async function createOfficeCompanyRelations(office: office): Promise<void> {
  try {
    for (let i = 0; i < companies.value.length; i++) {
      const form2 = new FormData()
      form2.append('office_id', office.id)
      form2.append('company_id', companies.value[i])
      //@ts-ignore
      await postCreate('collections/companies_offices/records', form2, userStore.userData?.token)
    }
    if (companies.value.length > 0) {
      notificationStore.addNotification({
        type: 'success',
        message: 'Sėkmingai sukurti ofiso ir kompanijų ryšiai',
      })
    }
  } catch (error) {
    notificationStore.addNotification({
      type: 'fail',
      message: 'Klaida sukuriant ryšius tarp ofiso ir kompanijų',
    })
    emits('update')
  }
}
</script>

<template>
  <div class="pl-[50px] pr-[50px]">
    <p class="text-[30px] pb-[30px] pl-[50px]">Pridėkite naują ofisą:</p>
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
          :selected="null"
          @change="(options: string[]) => (companies = options)"
        />
      </div>
    </div>
    <div class="pl-[50px] pb-[15px]">
      <button class="addButton" @click="createOffice">PRIDĖTI</button>
    </div>
  </div>
</template>
