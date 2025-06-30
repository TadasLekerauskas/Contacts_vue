<script setup lang="ts">
import { deleteItem } from '@/services/services'
import { useUser } from '@/stores/user'
import { useNotification } from '@/stores/notification'
import type { company } from '@/interfaces/company'

const props = defineProps<{
  company: company
}>()

const emits = defineEmits<{
  (e: 'update'): void
  (e: 'close'): void
}>()

const userStore = useUser()

const notificationStore = useNotification()

async function deleteContact(): Promise<void> {
  try {
    //@ts-ignore
    await deleteItem(`collections/companies/records/${props.company.id}`, userStore.userData?.token)
    notificationStore.addNotification({
      type: 'success',
      message: `Įmonė ${props.company.name} sėkmingai ištrinta`,
    })
    emits('update')
  } catch (error) {
    notificationStore.addNotification({
      type: 'fail',
      message: `Įmonės ${props.company.name} ištrinti nepavyko`,
    })
    emits('close')
  }
}
</script>

<template>
  <div class="w-full text-gray-500 pl-[25px]">
    <p>Įmonės pavadinimas: {{ props.company.name }}</p>
  </div>
  <div class="flex flex-row-reverse w-full">
    <button @click="deleteContact" class="yes">Taip</button>
    <button @click="emits('close')" class="no">Ne</button>
  </div>
</template>
