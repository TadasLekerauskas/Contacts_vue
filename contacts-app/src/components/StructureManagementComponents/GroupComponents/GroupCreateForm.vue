<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { object, string } from 'yup'
import { postCreate } from '@/services/services'
import { useNotification } from '@/stores/notification'
import { useUser } from '@/stores/user'
import { useDepartment } from '@/composables/department'
import { onBeforeMount, ref } from 'vue'
import type { group } from '@/interfaces/group'
import MultipleSelect from '@/components/MultipleSelectComponents/MultipleSelect.vue'
const emits = defineEmits<{
  (e: 'update'): void
}>()

const notificationStore = useNotification()

const userStore = useUser()

const departmentComposable = useDepartment()

const { errors, defineField } = useForm({
  validationSchema: toTypedSchema(
    object({
      groupName: string().trim().required(),
    }),
  ),
})

const [groupName] = defineField('groupName')

const departments = ref([] as string[])

onBeforeMount(() => {
  departmentComposable.fetchDepartmentsData('collections/departments/records')
})

function onEnter(event: KeyboardEvent): void {
  if (event.key == 'Enter') {
    createGroup()
  }
}

async function createGroup(): Promise<void> {
  if (groupName.value) {
    try {
      const form = new FormData()
      form.append('name', groupName.value)
      const group: group = await postCreate(
        `collections/groups/records`,
        form, //@ts-ignore
        userStore.userData.token,
      )
      await createGroupDepartmentRelations(group)
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

async function createGroupDepartmentRelations(group: group): Promise<void> {
  try {
    for (let i = 0; i < departments.value.length; i++) {
      const form2 = new FormData()
      form2.append('department_id', departments.value[i])
      form2.append('group_id', group.id)
      await postCreate(
        'collections/departments_groups/records',
        form2, //@ts-ignore
        userStore.userData?.token,
      )
    }
    if (departments.value.length > 0) {
      notificationStore.addNotification({
        type: 'success',
        message: 'Sėkmingai sukurti ryšiai tarp grupės ir skyrių',
      })
    }
  } catch (error) {
    console.error(error)
    notificationStore.addNotification({
      type: 'fail',
      message: 'Klaida kuriant grupės ir skyrių ryšius',
    })
  }
}
</script>

<template>
  <div class="pl-[50px] pb-[50px] w-[800px]">
    <p class="text-[30px] pb-[30px]">Pridėkite naują grupę:</p>
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
      <p>Padaliniai:</p>
      <MultipleSelect
        :options="departmentComposable.departmentArray.value"
        :selected="null"
        @change="(options: string[]) => (departments = options)"
      />
    </div>
    <div>
      <button class="addButton" @click="createGroup">PRIDĖTI</button>
    </div>
  </div>
</template>
