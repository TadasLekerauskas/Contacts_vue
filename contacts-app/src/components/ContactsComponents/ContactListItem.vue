<script setup lang="ts">
import type { contact } from '@/interfaces/contact'
import { computed } from 'vue'
const props = defineProps<{
  contact: contact
}>()

const address = computed(() => {
  if (props.contact.expand && props.contact.expand.office_id)
    return (
      props.contact.expand.office_id.street +
      ' ' +
      props.contact.expand.office_id.street_number +
      ', ' +
      props.contact.expand.office_id.city
    )
  else return 'Nėra adreso'
})
</script>

<template>
  <td>{{ props.contact.name + ' ' + props.contact.surname }}</td>
  <td>{{ props.contact.position }}</td>
  <td>{{ props.contact.phone_number }}</td>
  <td>{{ props.contact.email }}</td>
  <td>{{ address }}</td>
</template>
