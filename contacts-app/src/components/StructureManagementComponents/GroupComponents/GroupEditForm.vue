<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { object, string } from 'yup'
import { deleteItem, patchEdit, postCreate } from '@/services/services'
import { useNotification } from '@/stores/notification'
import { useUser } from '@/stores/user'
import { useDepartment } from '@/composables/department'
import { computed, onBeforeMount, ref } from 'vue'
import type { group } from '@/interfaces/group'
import { useDepartmentsGroups } from '@/composables/departments_groups'
import MultipleSelect from '@/components/MultipleSelectComponents/MultipleSelect.vue'
const props = defineProps<{
  item: group
}>()

const emits = defineEmits<{
  (e: 'update'): void
}>()

const notificationStore = useNotification()

const userStore = useUser()

const departmentsComposable = useDepartment()

const departmentGroupComposable = useDepartmentsGroups()

const { errors, defineField } = useForm({
  validationSchema: toTypedSchema(
    object({
      groupName: string().trim().required(),
    }),
  ),
})

const [groupName] = defineField('groupName')

const departments = ref([] as string[])

const isGroupModified = computed(() => {
  if (groupName.value != props.item.name) {
    return true
  }
  return false
})

const areDepartmentsModified = computed(() => {
  const defaultArray = makeDepartmentsArray()
  if (departments.value.toString() != defaultArray.toString()) {
    return true
  }
  return false
})

onBeforeMount(() => {
  initializeData()
})

async function initializeData(): Promise<void> {
  await departmentsComposable.fetchDepartmentsData('collections/departments/records')
  groupName.value = props.item.name
  await departmentGroupComposable.fetchDepartmentsGroupsData(
    `collections/departments_groups/records?filter=(group_id='${props.item.id}')`,
  )
  departments.value = makeDepartmentsArray()
}

function makeDepartmentsArray(): string[] {
  let array: string[] = new Array()
  if (departmentGroupComposable.departments_groups_array.value) {
    for (let i = 0; i < departmentGroupComposable.departments_groups_array.value.length; i++) {
      array[i] = departmentGroupComposable.departments_groups_array.value[i].department_id
    }
  }
  return array
}

function onEnter(event: KeyboardEvent): void {
  if (event.key == 'Enter') {
    editGroup()
  }
}

async function editGroup(): Promise<void> {
  if (groupName.value && (isGroupModified.value || areDepartmentsModified.value)) {
    try {
      const form = new FormData()
      form.append('name', groupName.value)
      await patchEdit(
        `collections/groups/records/${props.item.id}`,
        form, //@ts-ignore
        userStore.userData.token,
      )
      await createDepartmentsGroupsRelations(props.item)
      notificationStore.addNotification({
        type: 'success',
        message: `Grupė ${groupName.value} sėkmingai sukurta`,
      })
      emits('update')
    } catch (error) {
      notificationStore.addNotification({
        type: 'fail',
        message: `Grupės ${groupName.value} sukurti nepavyko`,
      })
    }
  }
}

async function createDepartmentsGroupsRelations(group: group): Promise<void> {
  try {
    const defaultArray = makeDepartmentsArray()
    for (let i = 0; i < departments.value.length; i++) {
      if (
        !defaultArray.find((item) => {
          return item == departments.value[i]
        })
      ) {
        const form2 = new FormData()
        form2.append('department_id', departments.value[i])
        form2.append('group_id', group.id)
        await postCreate(
          'collections/departments_groups/records',
          form2, //@ts-ignore
          userStore.userData?.token,
        )
      }
    }
    for (let i = 0; i < defaultArray.length; i++) {
      if (
        !departments.value.find((item) => {
          return item == defaultArray[i]
        })
      ) {
        deleteItem(
          `collections/departments_groups/records/${getRelationId(defaultArray[i])}`, //@ts-ignore
          userStore.userData?.token,
        )
      }
    }
    if (defaultArray.length > 0) {
      notificationStore.addNotification({
        type: 'success',
        message: 'Sėkmingai atnaujinti grupės ir skyrių ryšiai',
      })
    }
  } catch (error) {
    console.error(error)
    notificationStore.addNotification({
      type: 'fail',
      message: 'Klaida atnaujinant ryšius tarp grupės ir skyrių',
    })
  }
}

function getRelationId(departmentId: string): string {
  if (departmentGroupComposable.departments_groups_array.value)
    for (let i = 0; i < departmentGroupComposable.departments_groups_array.value.length; i++) {
      if (
        departmentGroupComposable.departments_groups_array.value[i].department_id == departmentId
      ) {
        return departmentGroupComposable.departments_groups_array.value[i].id
      }
    }
  return ''
}
</script>

<template>
  <div class="pl-[50px] pb-[50px] w-[800px]">
    <p class="text-[30px] pb-[30px]">Redaguoti grupę:</p>
    <div class="block pb-[10px]">
      <p>Grupės pavadinimas:</p>
      <input
        class="contactInput"
        type="text"
        placeholder="Įveskite grupės pavadinimą..."
        v-model="groupName"
        @keypress="onEnter"
      />
      <p class="text-red-500">{{ errors.groupName }}</p>
    </div>
    <div class="block pb-[10px]">
      <p>Skyriai:</p>
      <MultipleSelect
        :options="departmentsComposable.departmentArray.value"
        :selected="departments"
        @change="(options: string[]) => (departments = options)"
      />
    </div>
    <div>
      <button
        class="addButton"
        :class="{ active: !isGroupModified && !areDepartmentsModified }"
        @click="editGroup"
      >
        ATNAUJINTI
      </button>
    </div>
  </div>
</template>
