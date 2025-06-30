<script setup lang="ts">
import type { division } from '@/interfaces/division'
import { deleteItem } from '@/services/services'
import { useUser } from '@/stores/user'
import { useNotification } from '@/stores/notification'

const props = defineProps<{
  item: division
}>()

const emits = defineEmits<{
  (e: 'update'): void
  (e: 'close'): void
}>()

const userStore = useUser()

const notificationStore = useNotification()

async function deleteDivision(): Promise<void> {
  try {
    //@ts-ignore
    await deleteItem(`collections/divisions/records/${props.item.id}`, userStore.userData?.token)
    notificationStore.addNotification({
      type: 'success',
      message: `Padalinys ${props.item.name} sėkmingai ištrintas`,
    })
    emits('update')
  } catch (error) {
    notificationStore.addNotification({
      type: 'fail',
      message: `Padalinio ${props.item.name} ištrinti nepavyko`,
    })
    emits('close')
  }
}
</script>

<template>
  <div class="w-full text-gray-500 pl-[25px]">
    <p>Padalinio pavadinimas: {{ props.item.name }}</p>
  </div>
  <div class="flex flex-row-reverse w-full">
    <button @click="deleteDivision" class="yes">Taip</button>
    <button @click="emits('close')" class="no">Ne</button>
  </div>
</template>
