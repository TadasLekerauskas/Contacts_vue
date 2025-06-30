<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { object, string } from 'yup'
import { deleteItem, patchEdit, postCreate } from '@/services/services'
import { useNotification } from '@/stores/notification'
import { useUser } from '@/stores/user'
import { useDivision } from '@/composables/division'
import { computed, onBeforeMount, ref } from 'vue'
import type { department } from '@/interfaces/department'
import { useDivisionsDepartments } from '@/composables/divisions_departments'
import MultipleSelect from '@/components/MultipleSelectComponents/MultipleSelect.vue'
const props = defineProps<{
  item: department
}>()

const emits = defineEmits<{
  (e: 'update'): void
}>()

const notificationStore = useNotification()

const userStore = useUser()

const divisionComposable = useDivision()

const divisionDepartmentComposable = useDivisionsDepartments()

const { errors, defineField } = useForm({
  validationSchema: toTypedSchema(
    object({
      departmentName: string().trim().required(),
    }),
  ),
})

const [departmentName] = defineField('departmentName')

const divisions = ref([] as string[])

const isDepartmentModified = computed(() => {
  if (departmentName.value != props.item.name) {
    return true
  }
  return false
})

const areDivisionsModified = computed(() => {
  const defaultArray = makeDivisionsArray()
  if (divisions.value.toString() != defaultArray.toString()) {
    return true
  }
  return false
})

onBeforeMount(() => {
  initializeData()
})

async function initializeData(): Promise<void> {
  await divisionComposable.fetchDivisionsData('collections/divisions/records')
  departmentName.value = props.item.name
  await divisionDepartmentComposable.fetchDivisionsDepartmentsData(
    `collections/divisions_departments/records?filter=(department_id='${props.item.id}')`,
  )
  divisions.value = makeDivisionsArray()
}

function makeDivisionsArray(): string[] {
  let array: string[] = new Array()
  if (divisionDepartmentComposable.divisions_departments_array.value) {
    for (
      let i = 0;
      i < divisionDepartmentComposable.divisions_departments_array.value.length;
      i++
    ) {
      array[i] = divisionDepartmentComposable.divisions_departments_array.value[i].division_id
    }
  }
  return array
}

function onEnter(event: KeyboardEvent): void {
  if (event.key == 'Enter') {
    editDepartment()
  }
}

async function editDepartment(): Promise<void> {
  if (departmentName.value && (isDepartmentModified.value || areDivisionsModified.value)) {
    try {
      const form = new FormData()
      form.append('name', departmentName.value)
      await patchEdit(
        `collections/departments/records/${props.item.id}`,
        form, //@ts-ignore
        userStore.userData.token,
      )
      await createDivisionsDepartmentsRelations(props.item)
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

async function createDivisionsDepartmentsRelations(department: department): Promise<void> {
  try {
    const defaultArray = makeDivisionsArray()
    for (let i = 0; i < divisions.value.length; i++) {
      if (
        !defaultArray.find((item) => {
          return item == divisions.value[i]
        })
      ) {
        const form2 = new FormData()
        form2.append('division_id', divisions.value[i])
        form2.append('department_id', department.id)
        await postCreate(
          'collections/divisions_departments/records',
          form2, //@ts-ignore
          userStore.userData?.token,
        )
      }
    }
    for (let i = 0; i < defaultArray.length; i++) {
      if (
        !divisions.value.find((item) => {
          return item == defaultArray[i]
        })
      ) {
        deleteItem(
          `collections/divisions_departments/records/${getRelationId(defaultArray[i])}`, //@ts-ignore
          userStore.userData?.token,
        )
      }
    }
    if (defaultArray.length > 0) {
      notificationStore.addNotification({
        type: 'success',
        message: 'Sėkmingai atnaujinti skyriaus ir padalinių ryšiai',
      })
    }
  } catch (error) {
    console.error(error)
    notificationStore.addNotification({
      type: 'fail',
      message: 'Klaida atnaujinant ryšius tarp skyriaus ir padalinių',
    })
  }
}

function getRelationId(divisionId: string): string {
  if (divisionDepartmentComposable.divisions_departments_array.value)
    for (
      let i = 0;
      i < divisionDepartmentComposable.divisions_departments_array.value.length;
      i++
    ) {
      if (
        divisionDepartmentComposable.divisions_departments_array.value[i].division_id == divisionId
      ) {
        return divisionDepartmentComposable.divisions_departments_array.value[i].id
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
        v-model="departmentName"
        @keypress="onEnter"
      />
      <p class="text-red-500">{{ errors.departmentName }}</p>
    </div>
    <div class="block pb-[10px]">
      <p>Ofsai:</p>
      <MultipleSelect
        :options="divisionComposable.divisionArray.value"
        :selected="divisions"
        @change="(options: string[]) => (divisions = options)"
      />
    </div>
    <div>
      <button
        class="addButton"
        :class="{ active: !isDepartmentModified && !areDivisionsModified }"
        @click="editDepartment"
      >
        ATNAUJINTI
      </button>
    </div>
  </div>
</template>
