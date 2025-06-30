<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { object, string } from 'yup'
import { deleteItem, patchEdit, postCreate } from '@/services/services'
import { useNotification } from '@/stores/notification'
import { useUser } from '@/stores/user'
import { useOffice } from '@/composables/office'
import { computed, onBeforeMount, ref } from 'vue'
import type { division } from '@/interfaces/division'
import { useOfficesDivisions } from '@/composables/offices_divisions'
import MultipleSelect from '@/components/MultipleSelectComponents/MultipleSelect.vue'
const props = defineProps<{
  item: division
}>()

const emits = defineEmits<{
  (e: 'update'): void
}>()

const notificationStore = useNotification()

const userStore = useUser()

const officeComposable = useOffice()

const officeDivisionComposable = useOfficesDivisions()

const { errors, defineField } = useForm({
  validationSchema: toTypedSchema(
    object({
      divisionName: string().trim().required(),
    }),
  ),
})

const [divisionName] = defineField('divisionName')

const offices = ref([] as string[])

const isDivisionModified = computed(() => {
  if (divisionName.value != props.item.name) {
    return true
  }
  return false
})

const areOfficesModified = computed(() => {
  const defaultArray = makeOfficesArray()
  if (offices.value.toString() != defaultArray.toString()) {
    return true
  }
  return false
})

onBeforeMount(() => {
  initializeData()
})

async function initializeData(): Promise<void> {
  await officeComposable.fetchOfficesData('collections/offices/records')
  divisionName.value = props.item.name
  await officeDivisionComposable.fetchOfficesDivisionsData(
    `collections/offices_divisions/records?filter=(division_id='${props.item.id}')`,
  )
  offices.value = makeOfficesArray()
}

function makeOfficesArray(): string[] {
  let array: string[] = new Array()
  if (officeDivisionComposable.offices_divisions_array.value) {
    for (let i = 0; i < officeDivisionComposable.offices_divisions_array.value.length; i++) {
      array[i] = officeDivisionComposable.offices_divisions_array.value[i].office_id
    }
  }
  return array
}

function onEnter(event: KeyboardEvent): void {
  if (event.key == 'Enter') {
    editDivision()
  }
}

async function editDivision(): Promise<void> {
  if (divisionName.value && (isDivisionModified.value || areOfficesModified.value)) {
    try {
      const form = new FormData()
      form.append('name', divisionName.value)
      await patchEdit(
        `collections/divisions/records/${props.item.id}`,
        form, //@ts-ignore
        userStore.userData.token,
      )
      await createOfficeCompanyRelations(props.item)
      notificationStore.addNotification({
        type: 'success',
        message: `Padalinys ${divisionName.value} sėkmingai sukurtas`,
      })
      emits('update')
    } catch (error) {
      notificationStore.addNotification({
        type: 'fail',
        message: `Pdalinio ${divisionName.value} sukurti nepavyko`,
      })
    }
  }
}

async function createOfficeCompanyRelations(division: division): Promise<void> {
  try {
    const defaultArray = makeOfficesArray()
    for (let i = 0; i < offices.value.length; i++) {
      if (
        !defaultArray.find((item) => {
          return item == offices.value[i]
        })
      ) {
        const form2 = new FormData()
        form2.append('office_id', offices.value[i])
        form2.append('division_id', division.id)
        //@ts-ignore
        await postCreate('collections/offices_divisions/records', form2, userStore.userData?.token)
      }
    }
    for (let i = 0; i < defaultArray.length; i++) {
      if (
        !offices.value.find((item) => {
          return item == defaultArray[i]
        })
      ) {
        deleteItem(
          `collections/offices_divisions/records/${getRelationId(defaultArray[i])}`, //@ts-ignore
          userStore.userData?.token,
        )
      }
    }
    if (defaultArray.length > 0) {
      notificationStore.addNotification({
        type: 'success',
        message: 'Sėkmingai atnaujinti padalinio ir ofisų ryšiai',
      })
    }
  } catch (error) {
    console.error(error)
    notificationStore.addNotification({
      type: 'fail',
      message: 'Klaida atnaujinant ryšius tarp padalinio ir ofisų',
    })
  }
}

function getRelationId(officeId: string): string {
  if (officeDivisionComposable.offices_divisions_array.value)
    for (let i = 0; i < officeDivisionComposable.offices_divisions_array.value.length; i++) {
      if (officeDivisionComposable.offices_divisions_array.value[i].office_id == officeId) {
        return officeDivisionComposable.offices_divisions_array.value[i].id
      }
    }
  return ''
}
</script>

<template>
  <div class="pl-[50px] pb-[50px] w-[800px]">
    <p class="text-[30px] pb-[30px]">Redaguoti padalinį:</p>
    <div class="block pb-[10px]">
      <p>Padalinio pavadinimas:</p>
      <input
        class="contactInput"
        type="text"
        placeholder="Įveskite padalinio pavadinimą..."
        v-model="divisionName"
        @keypress="onEnter"
      />
      <p class="text-red-500">{{ errors.divisionName }}</p>
    </div>
    <div class="block pb-[10px]">
      <p>Ofsai:</p>
      <MultipleSelect
        :options="officeComposable.officeArray.value"
        :selected="offices"
        @change="(options: string[]) => (offices = options)"
      />
    </div>
    <div>
      <button
        class="addButton"
        :class="{ active: !isDivisionModified && !areOfficesModified }"
        @click="editDivision"
      >
        ATNAUJINTI
      </button>
    </div>
  </div>
</template>
