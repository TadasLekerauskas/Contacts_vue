<script setup lang="ts">
import type { office } from '@/interfaces/office'
import OfficeItem from './OfficeItem.vue'

const props = defineProps<{
  officeArray: office[] | null
}>()

const emits = defineEmits<{
  (e: 'edit', office: office): void
  (e: 'delete', office: office): void
}>()
</script>

<template>
  <div>
    <table class="dataTable">
      <thead>
        <tr>
          <th class="w-[35%]">Pavadinimas</th>
          <th class="w-[35%]">Adresas</th>
          <th class="text-center">Veiksmas</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="office in props.officeArray">
          <OfficeItem
            :office="office"
            @edit="emits('edit', office)"
            @delete="emits('delete', office)"
          />
        </tr>
        <tr v-if="!props.officeArray || props.officeArray.length == 0">
          <td :colspan="3" class="bold text-center">Rezultatų nėra!</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
