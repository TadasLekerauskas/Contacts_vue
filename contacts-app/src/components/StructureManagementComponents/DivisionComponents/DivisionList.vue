<script setup lang="ts">
import type { division } from '@/interfaces/division'
import DivisionItem from './DivisionItem.vue'

const props = defineProps<{
  divisionArray: division[] | null
}>()

const emits = defineEmits<{
  (e: 'edit', division: division): void
  (e: 'delete', division: division): void
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
        <tr v-for="division in props.divisionArray">
          <DivisionItem
            :division="division"
            @edit="emits('edit', division)"
            @delete="emits('delete', division)"
          />
        </tr>
        <tr v-if="!props.divisionArray || props.divisionArray.length == 0">
          <td :colspan="2" class="bold text-center">Rezultatų nėra!</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
