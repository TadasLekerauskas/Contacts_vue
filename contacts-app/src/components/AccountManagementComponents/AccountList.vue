<script setup lang="ts">
import type { account } from '@/interfaces/account'
import AccountItem from './AccountItem.vue'

const props = defineProps<{
  accountArray: account[] | null
}>()

const emits = defineEmits<{
  (e: 'edit', account: account): void
  (e: 'delete', account: account): void
  (e: 'edit-permissions', account: account): void
}>()
</script>

<template>
  <div>
    <table class="dataTable">
      <thead>
        <tr>
          <th class="w-[20%]">Vardas</th>
          <th class="w-[30%]">El. paštas</th>
          <th class="text-center">Veiksmas</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="account in props.accountArray">
          <AccountItem
            :account="account"
            @edit="emits('edit', account)"
            @delete="emits('delete', account)"
            @edit-permissions="emits('edit-permissions', account)"
          />
        </tr>
        <tr v-if="!props.accountArray || props.accountArray.length == 0">
          <td :colspan="3" class="bold text-center">Rezultatų nėra!</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
