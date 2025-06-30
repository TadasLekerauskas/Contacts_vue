<script setup lang="ts">
import type { notification } from '@/interfaces/notification'
const props = defineProps<{
  notification: notification
}>()
</script>

<template>
  <div :class="'notification ' + props.notification.type">
    <p>{{ props.notification.message }}</p>
  </div>
</template>
