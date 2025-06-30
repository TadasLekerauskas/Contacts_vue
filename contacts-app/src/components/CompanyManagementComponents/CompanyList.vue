<script setup lang="ts">
import type { company } from '@/interfaces/company'
import CompanyItem from './CompanyItem.vue'
const props = defineProps<{
  companyArray: company[] | null
}>()

const emits = defineEmits<{
  (e: 'edit', company: company): void
  (e: 'delete', company: company): void
}>()
</script>

<template>
  <div>
    <table class="dataTable">
      <thead>
        <tr>
          <th class="w-[70%]">Įmonės pavadinimas</th>
          <th class="text-center">Veiksmas</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="company in props.companyArray">
          <CompanyItem
            :company="company"
            @edit="emits('edit', company)"
            @delete="emits('delete', company)"
          />
        </tr>
        <tr v-if="!props.companyArray || props.companyArray.length == 0">
          <td :colspan="2" class="bold text-center">Rezultatų nėra!</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
