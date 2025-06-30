<script setup lang="ts">
import { useSingleContact } from '@/composables/singleContact'
import { onBeforeMount, watch } from 'vue'
import { useNotification } from '@/stores/notification'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import SingleContact from '@/components/ContactsComponents/SingleContact.vue'

const notificationStore = useNotification()

const route = useRoute()
const router = useRouter()

const { error, contact, fetchContactData } = useSingleContact()

onBeforeMount(() => {
  fetchContactData(
    `collections/employees/records/${route.params.id}?expand=office_id,division_id,department_id,company_id,group_id`,
  )
})

function goBack(): void {
  router.back()
}

watch(error, () => {
  notificationStore.addNotification({ type: 'fail', message: error.value })
})
</script>

<template>
  <div
    v-if="error == 'Kontaktas neegzistuoja'"
    class="flex justify-center items-center w-[100%] h-[100%]"
  >
    <p class="text-[40px]">
      Klaida 404, kontaktas su id <span class="bold">{{ route.params.id }}</span> neegzistuoja
    </p>
  </div>
  <div v-else-if="error != ''" class="flex justify-center items-center w-[100%] h-[100%]">
    <p class="text-[40px]">Klaida su serveriu serveriu</p>
  </div>
  <div v-else-if="contact">
    <p class="text-[50px] font-['Roboto'] pb-[0px]">Detalesnė kontakto informacija:</p>
    <div class="flex flex-row-reverse">
      <button class="circle bg-white" @click="goBack">
        <img class="w-[24px] h-[24px]" src="@/assets/images/goBackIcon.png" />
      </button>
    </div>
    <SingleContact :contact="contact" />
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>
