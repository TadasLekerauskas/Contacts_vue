<script setup lang="ts">
import type { group } from '@/interfaces/group'
import GroupItem from './GroupItem.vue'

const props = defineProps<{
  groupArray: group[] | null
}>()

const emits = defineEmits<{
  (e: 'edit', group: group): void
  (e: 'delete', group: group): void
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
        <tr v-for="group in props.groupArray">
          <GroupItem :group="group" @edit="emits('edit', group)" @delete="emits('delete', group)" />
        </tr>
        <tr v-if="!props.groupArray || props.groupArray.length == 0">
          <td :colspan="2" class="bold text-center">Rezultatų nėra!</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
