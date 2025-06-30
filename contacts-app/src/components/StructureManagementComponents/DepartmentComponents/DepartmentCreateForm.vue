<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { object, string } from 'yup'
import { postCreate } from '@/services/services'
import { useNotification } from '@/stores/notification'
import { useUser } from '@/stores/user'
import { useDivision } from '@/composables/division'
import { onBeforeMount, ref } from 'vue'
import type { department } from '@/interfaces/department'
import MultipleSelect from '@/components/MultipleSelectComponents/MultipleSelect.vue'
const emits = defineEmits<{
  (e: 'update'): void
}>()

const notificationStore = useNotification()

const userStore = useUser()

const divisionComposable = useDivision()

const { errors, defineField } = useForm({
  validationSchema: toTypedSchema(
    object({
      departmentName: string().trim().required(),
    }),
  ),
})

const [departmentName] = defineField('departmentName')

const divisions = ref([] as string[])

onBeforeMount(() => {
  divisionComposable.fetchDivisionsData('collections/divisions/records')
})

function onEnter(event: KeyboardEvent): void {
  if (event.key == 'Enter') {
    createDivision()
  }
}

async function createDivision(): Promise<void> {
  if (departmentName.value) {
    try {
      const form = new FormData()
      form.append('name', departmentName.value)
      const department: department = await postCreate(
        `collections/departments/records`,
        form, //@ts-ignore
        userStore.userData.token,
      )
      await createDepartmentDivisionRelations(department)
      notificationStore.addNotification({
        type: 'success',
        message: `Skyrius ${departmentName.value} sėkmingai sukurtas`,
      })
      emits('update')
    } catch (error) {
      notificationStore.addNotification({
        type: 'fail',
        message: `Skyriaus ${departmentName.value} sukurti nepavyko`,
      })
    }
  }
}

async function createDepartmentDivisionRelations(department: department): Promise<void> {
  try {
    for (let i = 0; i < divisions.value.length; i++) {
      const form2 = new FormData()
      form2.append('division_id', divisions.value[i])
      form2.append('department_id', department.id)
      await postCreate(
        'collections/divisions_departments/records',
        form2, //@ts-ignore
        userStore.userData?.token,
      )
    }
    if (divisions.value.length > 0) {
      notificationStore.addNotification({
        type: 'success',
        message: 'Sėkmingai sukurti ryšiai tarp padalinių ir skyriaus',
      })
    }
  } catch (error) {
    console.error(error)
    notificationStore.addNotification({
      type: 'fail',
      message: 'Klaida kuriant skyriaus ir padalinių ryšius',
    })
  }
}
</script>

<template>
  <div class="pl-[50px] pb-[50px] w-[800px]">
    <p class="text-[30px] pb-[30px]">Pridėkite naują skyrių:</p>
    <div class="block pb-[10px]">
      <p>Skyriaus pavadinimas:</p>
      <input
        class="contactInput"
        type="text"
        placeholder="Įveskite skyriaus pavadinimą..."
        v-model="departmentName"
        @keypress="onEnter"
      />
      <p class="text-red-500">{{ errors.departmentName }}</p>
    </div>
    <div class="block pb-[10px]">
      <p>Padaliniai:</p>
      <MultipleSelect
        :options="divisionComposable.divisionArray.value"
        :selected="null"
        @change="(options: string[]) => (divisions = options)"
      />
    </div>
    <div>
      <button class="addButton" @click="createDivision">PRIDĖTI</button>
    </div>
  </div>
</template>
