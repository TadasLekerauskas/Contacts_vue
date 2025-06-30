<script setup lang="ts">
import type { company } from '@/interfaces/company'
import { useUser } from '@/stores/user'

const props = defineProps<{
  company: company
}>()

const emits = defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
}>()

const userStore = useUser()
</script>

<template>
  <td>{{ props.company.name }}</td>
  <td>
    <button
      class="blueTableButton"
      v-if="userStore.userData?.record.expand?.permissions_id.edit_companies"
      @click="emits('edit')"
    >
      Redaguoti
    </button>
    <button
      class="deleteTableButton"
      v-if="userStore.userData?.record.expand?.permissions_id.delete_companies"
      @click="emits('delete')"
    >
      Ištrinti
    </button>
  </td>
</template>
