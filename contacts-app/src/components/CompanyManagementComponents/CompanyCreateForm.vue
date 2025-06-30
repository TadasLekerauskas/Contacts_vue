<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { object, string } from 'yup'
import { postCreate } from '@/services/services'
import { useNotification } from '@/stores/notification'
import { useUser } from '@/stores/user'
const emits = defineEmits<{
  (e: 'update'): void
}>()

const notificationStore = useNotification()

const userStore = useUser()

const { errors, defineField } = useForm({
  validationSchema: toTypedSchema(
    object({
      companyName: string().trim().required(),
    }),
  ),
})

function onEnter(event: KeyboardEvent): void {
  if (event.key == 'Enter') {
    createContact()
  }
}

const [companyName] = defineField('companyName')

async function createContact(): Promise<void> {
  if (companyName.value) {
    try {
      const form = new FormData()
      form.append('name', companyName.value)
      //@ts-ignore
      await postCreate(`collections/companies/records`, form, userStore.userData.token)
      notificationStore.addNotification({ type: 'success', message: 'Įmonė sėkmingai sukurta' })
      emits('update')
    } catch (error) {
      notificationStore.addNotification({ type: 'fail', message: 'Įmonės sukurti nepavyko' })
    }
  }
}
</script>

<template>
  <div class="pl-[50px] pb-[50px] w-[800px]">
    <p class="text-[30px] pb-[30px]">Pridėkite naują įmonę:</p>
    <div class="block pb-[10px]">
      <p>Įmonės pavadinimas:</p>
      <input
        class="contactInput"
        type="text"
        placeholder="Įveskite įmonės pavadinimą..."
        v-model="companyName"
        @keypress="onEnter"
      />
      <p class="text-red-500">{{ errors.companyName }}</p>
    </div>
    <div>
      <button class="addButton" @click="createContact">PRIDĖTI</button>
    </div>
  </div>
</template>
