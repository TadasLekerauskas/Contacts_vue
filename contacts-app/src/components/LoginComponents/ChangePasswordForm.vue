<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup'
import { useForm } from 'vee-validate'
import { object, string } from 'yup'
import { computed, ref } from 'vue'
import { postData } from '@/services/services'
import { useRouter } from 'vue-router'
import { useNotification } from '@/stores/notification'
const props = defineProps<{
  token: string
}>()

const router = useRouter()

const notificationStore = useNotification()

const { errors, defineField } = useForm({
  validationSchema: toTypedSchema(
    object({
      password: string().trim().min(8).max(72).required(),
    }),
  ),
})

const [password] = defineField('password')
const confirmPassword = ref('')

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const confirmError = computed(() => {
  if (password.value == confirmPassword.value && password.value != '') {
    return false
  } else if (confirmPassword.value == '') {
    return false
  }
  return true
})

const passwordType = computed(() => {
  if (showPassword.value) {
    return 'text'
  }
  return 'password'
})

const passwordConfirmType = computed(() => {
  if (showConfirmPassword.value) {
    return 'text'
  }
  return 'password'
})

async function changePassword(): Promise<void> {
  if (password.value && errors.value.password == undefined && !confirmError.value) {
    try {
      const form = new FormData()
      form.append('token', props.token)
      form.append('password', password.value)
      form.append('passwordConfirm', confirmPassword.value)
      await postData('collections/users/confirm-password-reset', form)
      notificationStore.addNotification({
        type: 'success',
        message: 'Slaptažodis pakeistas sėkmingai',
      })
      router.push('/login')
    } catch (error) {
      console.error(error)
      notificationStore.addNotification({ type: 'fail', message: 'Klaida keičiant slaptažodį' })
    }
  }
}

function onEnter(event: KeyboardEvent): void {
  if (event.key == 'Enter') {
    changePassword()
  }
}
</script>

<template>
  <div class="blueBackground">
    <div class="bigBox">
      <p class="text-[50px] font-[Roboto]">Slaptažodžio pakeitimas:</p>
      <div class="block">
        <div class="relative w-full h-[120px]">
          <p class="pl-[15px]">Naujas slaptažodis:</p>
          <input
            class="password"
            :type="passwordType"
            v-model="password"
            placeholder="Įveskite naują slaptažodį"
            @keypress="onEnter"
          />
          <p class="text-red-500">{{ errors.password }}</p>
          <img
            class="showIcon right-[10px] top-4/12"
            src="@/assets/images/showPasswordIcon.png"
            @click="showPassword = !showPassword"
          />
        </div>
        <div class="relative w-full h-[120px]">
          <p class="pl-[15px]">Pakartoti naują slaptažodį:</p>
          <input
            class="password"
            v-model="confirmPassword"
            :type="passwordConfirmType"
            placeholder="Pakartokite naują slaptažodį"
            @keypress="onEnter"
          />
          <p class="text-red-500" v-if="confirmError">Passwords do not match</p>
          <img
            class="showIcon right-[10px] top-4/12"
            src="@/assets/images/showPasswordIcon.png"
            @click="showConfirmPassword = !showConfirmPassword"
          />
        </div>
      </div>
      <div>
        <button class="loginButton" @click="changePassword">KEISTI SLAPTAŽODĮ</button>
      </div>
    </div>
  </div>
</template>
