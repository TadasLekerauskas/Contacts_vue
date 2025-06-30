<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { object, string } from 'yup'
import { postCreate } from '@/services/services'
import { useNotification } from '@/stores/notification'
import { useUser } from '@/stores/user'
import { useOffice } from '@/composables/office'
import { onBeforeMount, ref } from 'vue'
import type { division } from '@/interfaces/division'
import MultipleSelect from '@/components/MultipleSelectComponents/MultipleSelect.vue'
const emits = defineEmits<{
  (e: 'update'): void
}>()

const notificationStore = useNotification()

const userStore = useUser()

const officeComposable = useOffice()

const { errors, defineField } = useForm({
  validationSchema: toTypedSchema(
    object({
      divisionName: string().trim().required(),
    }),
  ),
})

const [divisionName] = defineField('divisionName')

const offices = ref([] as string[])

onBeforeMount(() => {
  officeComposable.fetchOfficesData('collections/offices/records')
})

function onEnter(event: KeyboardEvent): void {
  if (event.key == 'Enter') {
    createDivision()
  }
}

async function createDivision(): Promise<void> {
  if (divisionName.value) {
    try {
      const form = new FormData()
      form.append('name', divisionName.value)
      const division: division = await postCreate(
        `collections/divisions/records`,
        form, //@ts-ignore
        userStore.userData.token,
      )
      await createDivisionOfficeRelations(division)
      notificationStore.addNotification({
        type: 'success',
        message: `Padalinys ${divisionName.value} sėkmingai sukurtas`,
      })
      emits('update')
    } catch (error) {
      notificationStore.addNotification({
        type: 'fail',
        message: `Padalinio ${divisionName.value} sukurti nepavyko`,
      })
    }
  }
}

async function createDivisionOfficeRelations(division: division): Promise<void> {
  try {
    for (let i = 0; i < offices.value.length; i++) {
      const form2 = new FormData()
      form2.append('office_id', offices.value[i])
      form2.append('division_id', division.id)
      //@ts-ignore
      await postCreate('collections/offices_divisions/records', form2, userStore.userData?.token)
    }
    if (offices.value.length > 0) {
      notificationStore.addNotification({
        type: 'success',
        message: 'Sėkmingai sukurti ryšiai tarp ofisų ir padalinio',
      })
    }
  } catch (error) {
    console.error(error)
    notificationStore.addNotification({
      type: 'fail',
      message: 'Klaida kuriant padalinio ir ofisų ryšius',
    })
  }
}
</script>

<template>
  <div class="pl-[50px] pb-[50px] w-[800px]">
    <p class="text-[30px] pb-[30px]">Pridėkite naują padalinį:</p>
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
        :selected="null"
        @change="(options: string[]) => (offices = options)"
      />
    </div>
    <div>
      <button class="addButton" @click="createDivision">PRIDĖTI</button>
    </div>
  </div>
</template>
