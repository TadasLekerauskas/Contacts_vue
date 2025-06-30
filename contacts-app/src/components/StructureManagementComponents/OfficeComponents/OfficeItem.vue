<script setup lang="ts">
import type { office } from '@/interfaces/office'
import { computed } from 'vue'
import { useUser } from '@/stores/user'

const props = defineProps<{
  office: office
}>()

const emits = defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
}>()

const userStore = useUser()

const adress = computed(() => {
  return (
    props.office.street +
    ' ' +
    props.office.street_number +
    ', ' +
    props.office.city +
    ', ' +
    props.office.country
  )
})
</script>

<template>
  <td>{{ props.office.name }}</td>
  <td>{{ adress }}</td>
  <td>
    <button
      class="blueTableButton"
      v-if="userStore.userData?.record.expand?.permissions_id.edit_offices"
      @click="emits('edit')"
    >
      Redaguoti
    </button>
    <button
      class="deleteTableButton"
      v-if="userStore.userData?.record.expand?.permissions_id.delete_offices"
      @click="emits('delete')"
    >
      Ištrinti
    </button>
  </td>
</template>
