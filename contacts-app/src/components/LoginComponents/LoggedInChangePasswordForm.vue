<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup'
import { useForm } from 'vee-validate'
import { object, string } from 'yup'
import { computed, ref, shallowReadonly } from 'vue'
import { patchEdit } from '@/services/services'
import { useRouter } from 'vue-router'
import { useNotification } from '@/stores/notification'
import { useUser } from '@/stores/user'
const router = useRouter()

const notificationStore = useNotification()

const userStore = useUser()

const { errors, defineField } = useForm({
  validationSchema: toTypedSchema(
    object({
      oldPassword: string().trim().min(8).max(72).required(),
      password: string().trim().min(8).max(72).required(),
    }),
  ),
})

const [oldPassword] = defineField('oldPassword')
const [password] = defineField('password')
const confirmPassword = ref('')

const showOldPassword = ref(false)
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

const oldPasswordType = computed(() => {
  if (showOldPassword.value) {
    return 'text'
  }
  return 'password'
})

async function changePassword(): Promise<void> {
  if (
    password.value &&
    errors.value.password == undefined &&
    !confirmError.value &&
    oldPassword.value
  ) {
    try {
      const form = new FormData()
      form.append('oldPassword', oldPassword.value)
      form.append('password', password.value)
      form.append('passwordConfirm', confirmPassword.value)
      await patchEdit(
        `collections/users/records/${userStore.userData?.record.id}`,
        form, //@ts-ignore
        userStore.userData?.token,
      )
      notificationStore.addNotification({
        type: 'success',
        message: 'Slaptažodis pakeistas sėkmingai',
      })
      userStore.logout()
      router.push('/')
    } catch (error) {
      console.error(error)
      //@ts-ignore
      const errorCode = error.code
      if (errorCode == 'ERR_NETWORK') {
        notificationStore.addNotification({
          type: 'fail',
          message: 'Klaida susisiekiant su serveriu',
        })
      } else if (errorCode == 'ECONNABORTED') {
        notificationStore.addNotification({
          type: 'fail',
          message: 'Operacija nutraukta',
        })
      } else {
        notificationStore.addNotification({
          type: 'fail',
          message: 'Klaida, netinkamas senas slaptažodis',
        })
      }
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
  <div class="bigBox">
    <p class="text-[50px] font-[Roboto]">Slaptažodžio pakeitimas:</p>
    <div class="block">
      <div class="relative w-full h-[120px]">
        <p class="pl-[15px]">Senas slaptažodis:</p>
        <input
          class="password"
          :type="oldPasswordType"
          v-model="oldPassword"
          placeholder="Įveskite seną slaptažodį..."
          @keypress="onEnter"
        />
        <p class="text-red-500">{{ errors.oldPassword }}</p>
        <img
          class="showIcon right-[10px] top-4/12"
          src="@/assets/images/showPasswordIcon.png"
          @click="showOldPassword = !showOldPassword"
        />
      </div>
      <div class="relative w-full h-[120px]">
        <p class="pl-[15px]">Naujas slaptažodis:</p>
        <input
          class="password"
          :type="passwordType"
          v-model="password"
          placeholder="Įveskite naują slaptažodį..."
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
          placeholder="Pakartokite naują slaptažodį..."
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
</template>
