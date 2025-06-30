<script setup lang="ts">
import type { division } from '@/interfaces/division'
import { useUser } from '@/stores/user'

const props = defineProps<{
  division: division
}>()

const emits = defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
}>()

const userStore = useUser()
</script>

<template>
  <td>{{ props.division.name }}</td>
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
