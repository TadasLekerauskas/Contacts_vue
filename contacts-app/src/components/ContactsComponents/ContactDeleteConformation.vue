<script setup lang="ts">
import type { contact } from '@/interfaces/contact'
import { deleteItem } from '@/services/services'
import { useUser } from '@/stores/user'
import { useNotification } from '@/stores/notification'

const props = defineProps<{
  contact: contact
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
    await deleteItem(`collections/employees/records/${props.contact.id}`, userStore.userData?.token)
    notificationStore.addNotification({
      type: 'success',
      message: `Kontaktas ${props.contact.name + ' ' + props.contact.surname} sėkmingai ištrintas`,
    })
    emits('update')
  } catch (error) {
    //@ts-ignore
    const errorCode = error.code
    //@ts-ignore
    const status = error.status
    if (errorCode == 'ERR_NETWORK') {
      notificationStore.addNotification({
        type: 'fail',
        message: `Neprisijungta prie serverio`,
      })
    } else if (errorCode == 'ECONNABORTED') {
      notificationStore.addNotification({
        type: 'fail',
        message: `Nutraukta operacija`,
      })
    } else if (status == 404) {
      notificationStore.addNotification({
        type: 'fail',
        message: `Nerastas kontaktas ${props.contact.name + ' ' + props.contact.surname}`,
      })
      emits('update')
    } else {
      notificationStore.addNotification({
        type: 'fail',
        message: `Kontakto ${props.contact.name + ' ' + props.contact.surname} ištrinti nepavyko`,
      })
    }
    emits('close')
  }
}
</script>

<template>
  <div class="w-full text-gray-500 pl-[15px]">
    <p>Vardas ir pavardė: {{ contact.name + ' ' + contact.surname }}</p>
    <p>Pozicija: {{ contact.position }}</p>
  </div>
  <div class="flex flex-row-reverse w-full">
    <button @click="deleteContact" class="yes">Taip</button>
    <button @click="emits('close')" class="no">Ne</button>
  </div>
</template>
