<script setup lang="ts">
import { computed, ref } from 'vue'
import type { loginData } from '@/interfaces/loginData'
import { useUser } from '@/stores/user'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { object, string } from 'yup'
import { useNotification } from '@/stores/notification'
import { useRouter } from 'vue-router'

const router = useRouter()

const userStore = useUser()

const notificationStore = useNotification()

const showPassword = ref(false)
const type = computed(() => {
  if (showPassword.value) {
    return 'text'
  }
  return 'password'
})

async function handleLogin(): Promise<void> {
  if (email.value && password.value) {
    const loginData: loginData = { identity: email.value, password: password.value }
    await userStore.login('collections/users/auth-with-password?expand=permissions_id', loginData)
    if (userStore.error != '') {
      notificationStore.addNotification({ type: 'fail', message: userStore.error })
    } else {
      notificationStore.addNotification({
        type: 'success',
        message: 'Naudotojas sėkmingai prisijungė',
      })
      router.push('/')
    }
  }
}

const { errors, defineField } = useForm({
  validationSchema: toTypedSchema(
    object({
      email: string().email().trim().required(),
      password: string().trim().required(),
    }),
  ),
})

const [email] = defineField('email')
const [password] = defineField('password')

function onEnter(event: KeyboardEvent) {
  if (event.key == 'Enter') {
    handleLogin()
  }
}

function goToPage(): void {
  router.push('login/forgotPassword')
}
</script>
<template>
  <div class="bigBox">
    <p class="text-[50px] font-[Roboto]">Admin prisijungimas:</p>
    <div class="block">
      <p class="pl-[15px]">Eleketroninis paštas:</p>
      <input
        class="email"
        type="text"
        placeholder="Įveskite el. pašto adresą..."
        v-model="email"
        @keypress="onEnter"
      />
      <p class="text-red-500">{{ errors.email }}</p>
    </div>
    <div class="relative">
      <p class="pl-[15px]">Slaptažodis:</p>
      <input
        class="password"
        :type="type"
        placeholder="Įveskite slaptažodį..."
        v-model="password"
        @keypress="onEnter"
      />
      <p class="text-red-500">{{ errors.password }}</p>
      <img
        class="showIcon right-[10px] top-1/2"
        src="@/assets/images/showPasswordIcon.png"
        @click="showPassword = !showPassword"
      />
    </div>
    <div class="w-[450px]">
      <button class="text-blue-500" @click="goToPage">Slaptažodžio atkūrimas</button>
    </div>
    <button class="loginButton" @click="handleLogin">PRISIJUNGTI</button>
  </div>
</template>
