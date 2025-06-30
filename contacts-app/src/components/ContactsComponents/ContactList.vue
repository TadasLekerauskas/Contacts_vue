<script setup lang="ts">
import ContactCardItem from './ContactCardItem.vue'
import ContactListItem from './ContactListItem.vue'
import type { contact } from '@/interfaces/contact'
import { useRouter } from 'vue-router'
const props = defineProps<{
  constactArray: contact[] | null
  isCard: boolean
}>()

const emits = defineEmits<{
  (e: 'edit', contact: contact): void
  (e: 'delete', contact: contact): void
}>()

const router = useRouter()

function goSinglePage(id: string | undefined): void {
  router.push(`/contact/${id}`)
}
</script>

<template>
  <div class="flex flex-wrap justify-center" v-if="props.isCard">
    <div v-for="contact in props.constactArray" @click="goSinglePage(contact.id)">
      <ContactCardItem
        :contact="contact"
        @edit="emits('edit', contact)"
        @delete="emits('delete', contact)"
      />
    </div>
    <div v-if="!props.constactArray || props.constactArray.length == 0">
      <p class="bold text-[25px]">Rezultatų nėra!</p>
    </div>
  </div>
  <div v-else>
    <table class="contactsTable">
      <thead>
        <tr>
          <th>Vardas ir Pavardė</th>
          <th>Pozicija</th>
          <th>Telefono numeris</th>
          <th>Elektroninis paštas</th>
          <th>Adresas</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="contactTableItem"
          v-for="contact in props.constactArray"
          @click="goSinglePage(contact.id)"
        >
          <ContactListItem :contact="contact" />
        </tr>
        <tr v-if="!props.constactArray || props.constactArray.length == 0">
          <td :colspan="5" class="bold">Rezultatų nėra!</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
