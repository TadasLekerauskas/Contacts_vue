<script setup lang="ts">
import type { department } from '@/interfaces/department'
import { deleteItem } from '@/services/services'
import { useUser } from '@/stores/user'
import { useNotification } from '@/stores/notification'

const props = defineProps<{
  item: department
}>()

const emits = defineEmits<{
  (e: 'update'): void
  (e: 'close'): void
}>()

const userStore = useUser()

const notificationStore = useNotification()

async function deleteDepartment(): Promise<void> {
  try {
    //@ts-ignore
    await deleteItem(`collections/departments/records/${props.item.id}`, userStore.userData?.token)
    notificationStore.addNotification({
      type: 'success',
      message: `Skyrius ${props.item.name} sėkmingai ištrintas`,
    })
    emits('update')
  } catch (error) {
    notificationStore.addNotification({
      type: 'fail',
      message: `Skyriaus ${props.item.name} ištrinti nepavyko`,
    })
    emits('close')
  }
}
</script>

<template>
  <div class="w-full text-gray-500 pl-[25px]">
    <p>Skyriaus pavadinimas: {{ props.item.name }}</p>
  </div>
  <div class="flex flex-row-reverse w-full">
    <button @click="deleteDepartment" class="yes">Taip</button>
    <button @click="emits('close')" class="no">Ne</button>
  </div>
</template>
