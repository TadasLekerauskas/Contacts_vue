<script setup lang="ts">
import { useNotification } from '@/stores/notification'
import type { notification } from '@/interfaces/notification'
import Notification from './Notification.vue'

const notificationStore = useNotification()

async function closeAfterTime(notification: notification): Promise<void> {
  setTimeout(() => {
    notificationStore.removeNotification(notification)
  }, 3000)
}
</script>

<template>
  <div class="notificationContainer">
    <div v-for="notification in notificationStore.notificationsArray">
      <Notification :notification="notification" @vue:mounted="closeAfterTime(notification)" />
    </div>
  </div>
</template>
