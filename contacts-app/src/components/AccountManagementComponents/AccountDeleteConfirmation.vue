<script setup lang="ts">
import { deleteItem } from '@/services/services'
import { useUser } from '@/stores/user'
import { useNotification } from '@/stores/notification'
import type { account } from '@/interfaces/account'

const props = defineProps<{
  account: account
}>()

const emits = defineEmits<{
  (e: 'update'): void
  (e: 'close'): void
}>()

const userStore = useUser()

const notificationStore = useNotification()

async function deleteContact(): Promise<void> {
  try {
    await deleteItem(
      `collections/user_permissions/records/${props.account.permissions_id}`, //@ts-ignore
      userStore.userData?.token,
    )
    notificationStore.addNotification({
      type: 'success',
      message: `Paskyra sėkmingai ištrinta`,
    })
    emits('update')
  } catch (error) {
    //@ts-ignore
    const errorCode = error.code
    if (errorCode == 'ERR_NETWORK') {
      notificationStore.addNotification({ type: 'fail', message: 'Klaida jungiantis su serveriu' })
    } else if (errorCode == 'ECONNABORTED') {
      notificationStore.addNotification({ type: 'fail', message: 'Klaida, nutraukta operacija' })
    } else {
      notificationStore.addNotification({
        type: 'fail',
        message: `Paskyros ištrinti nepavyko`,
      })
    }
    emits('close')
  }
}
</script>

<template>
  <div class="w-full text-gray-500 pl-[25px]">
    <p>El.paštas: {{ props.account.email }}</p>
  </div>
  <div class="flex flex-row-reverse w-full">
    <button @click="deleteContact" class="yes">Taip</button>
    <button @click="emits('close')" class="no">Ne</button>
  </div>
</template>
