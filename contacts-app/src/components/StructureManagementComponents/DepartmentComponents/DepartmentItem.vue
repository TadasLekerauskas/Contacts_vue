<script setup lang="ts">
import type { department } from '@/interfaces/department'
import { useUser } from '@/stores/user'

const props = defineProps<{
  department: department
}>()

const emits = defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
}>()

const userStore = useUser()
</script>

<template>
  <td>{{ props.department.name }}</td>
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
