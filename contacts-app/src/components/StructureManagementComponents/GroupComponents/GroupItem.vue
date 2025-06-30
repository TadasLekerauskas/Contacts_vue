<script setup lang="ts">
import type { group } from '@/interfaces/group'
import { useUser } from '@/stores/user'

const userStore = useUser()

const props = defineProps<{
  group: group
}>()

const emits = defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
}>()
</script>

<template>
  <td>{{ props.group.name }}</td>
  <td>
    <button
      class="blueTableButton"
      v-if="userStore.userData?.record.expand?.permissions_id.edit_structure"
      @click="emits('edit')"
    >
      Redaguoti
    </button>
    <button
      class="deleteTableButton"
      v-if="userStore.userData?.record.expand?.permissions_id.delete_structure"
      @click="emits('delete')"
    >
      Ištrinti
    </button>
  </td>
</template>
