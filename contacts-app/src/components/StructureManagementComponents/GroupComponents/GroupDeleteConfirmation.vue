<script setup lang="ts">
import type { group } from '@/interfaces/group'
import { deleteItem } from '@/services/services'
import { useUser } from '@/stores/user'
import { useNotification } from '@/stores/notification'

const props = defineProps<{
  item: group
}>()

const emits = defineEmits<{
  (e: 'update'): void
  (e: 'close'): void
}>()

const userStore = useUser()

const notificationStore = useNotification()

async function deleteGroup(): Promise<void> {
  try {
    //@ts-ignore
    await deleteItem(`collections/groups/records/${props.item.id}`, userStore.userData?.token)
    notificationStore.addNotification({
      type: 'success',
      message: `Grupė ${props.item.name} sėkmingai ištrinta`,
    })
    emits('update')
  } catch (error) {
    notificationStore.addNotification({
      type: 'fail',
      message: `Grupės ${props.item.name} ištrinti nepavyko`,
    })
    emits('close')
  }
}
</script>

<template>
  <div class="w-full text-gray-500 pl-[25px]">
    <p>Grupės pavadinimas: {{ props.item.name }}</p>
  </div>
  <div class="flex flex-row-reverse w-full">
    <button @click="deleteGroup" class="yes">Taip</button>
    <button @click="emits('close')" class="no">Ne</button>
  </div>
</template>
