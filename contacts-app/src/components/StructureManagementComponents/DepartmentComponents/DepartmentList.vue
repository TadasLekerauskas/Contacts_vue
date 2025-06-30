<script setup lang="ts">
import type { department } from '@/interfaces/department'
import DepartmentItem from './DepartmentItem.vue'

const props = defineProps<{
  departmentArray: department[] | null
}>()

const emits = defineEmits<{
  (e: 'edit', department: department): void
  (e: 'delete', department: department): void
}>()
</script>

<template>
  <div>
    <table class="dataTable">
      <thead>
        <tr>
          <th class="w-[70%]">Pavadinimas</th>
          <th class="text-center">Veiksmas</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="department in props.departmentArray">
          <DepartmentItem
            :department="department"
            @edit="emits('edit', department)"
            @delete="emits('delete', department)"
          />
        </tr>
        <tr v-if="!props.departmentArray || props.departmentArray.length == 0">
          <td :colspan="2" class="bold text-center">Rezultatų nėra!</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
