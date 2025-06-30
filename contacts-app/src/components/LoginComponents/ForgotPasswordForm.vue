<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup'
import { useForm } from 'vee-validate'
import { object, string } from 'yup'
import { postData } from '@/services/services'
import { ref } from 'vue'

const showError = ref(false)
const showSucess = ref(false)

const { errors, defineField } = useForm({
  validationSchema: toTypedSchema(
    object({
      email: string().email().trim().required(),
    }),
  ),
})

const [email] = defineField('email')

async function sendPassword(): Promise<void> {
  if (email.value && errors.value.email == undefined) {
    try {
      const form = new FormData()
      form.append('email', email.value)
      await postData(`collections/users/request-password-reset`, form)
      showSucess.value = true
      showError.value = false
    } catch (error) {
      showError.value = true
      showSucess.value = false
      console.error(error)
    }
  }
}

function handleEnter(event: KeyboardEvent): void {
  if (event.key == 'Enter') {
    sendPassword()
  }
}
</script>

<template>
  <div class="bigBox">
    <p class="text-[50px] font-[Roboto]">Slaptažodžio atkūrimas:</p>
    <div class="block">
      <p class="pl-[15px]">Eleketroninis paštas:</p>
      <input
        class="email"
        type="text"
        placeholder="Įveskite el. pašto adresą..."
        v-model="email"
        @keypress="handleEnter"
      />
      <p class="text-red-500">{{ errors.email }}</p>
    </div>
    <div>
      <button class="loginButton" @click="sendPassword">SIŲSTI SLAPTAŽODĮ</button>
      <p class="text-green-700 pt-[10px] pl-[20px]" v-if="showSucess">
        Nuoroda sėkmingai išsiūsta į paštą
      </p>
      <p class="text-red-500 pt-[10px] pl-[20px]" v-if="showError">
        Išsiųsti nepavyko, bandykite dar kartą
      </p>
    </div>
  </div>
</template>
