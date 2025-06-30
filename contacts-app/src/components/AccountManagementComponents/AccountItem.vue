<script setup lang="ts">
import type { account } from '@/interfaces/account'
import { useUser } from '@/stores/user'
import { computed } from 'vue'

const props = defineProps<{
  account: account
}>()

const emits = defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
  (e: 'edit-permissions'): void
}>()

console.log(props.account)

const userStore = useUser()

const email = computed(() => {
  if (props.account.email == userStore.userData?.record.email) {
    return props.account.email
  } else if (props.account.email != '') {
    return props.account.email
  }
  return ''
})

const name = computed(() => {
  if (props.account.name == '') {
    return props.account.username
  } else {
    return props.account.name
  }
})
</script>

<template>
  <td>{{ name }}</td>
  <td>{{ email }}</td>
  <td>
    <button
      class="blueTableButton"
      v-if="userStore.userData?.record.expand?.permissions_id.edit_permissions"
      @click="emits('edit-permissions')"
    >
      Keisti leidimus
    </button>
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
