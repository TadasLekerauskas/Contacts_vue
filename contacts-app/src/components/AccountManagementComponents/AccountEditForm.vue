<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { object, string } from 'yup'
import { patchEdit } from '@/services/services'
import { useNotification } from '@/stores/notification'
import { useUser } from '@/stores/user'
import { computed, onBeforeMount, ref } from 'vue'
import type { account } from '@/interfaces/account'
const emits = defineEmits<{
  (e: 'update'): void
}>()

const props = defineProps<{
  account: account
}>()

const notificationStore = useNotification()

const userStore = useUser()

const { errors, defineField } = useForm({
  validationSchema: toTypedSchema(
    object({
      email: string().trim().email().required(),
    }),
  ),
})

const name = ref('')
const [email] = defineField('email')
const photo = ref<File | null>(null)
const photoName = ref('')

const isModified = computed(() => {
  if (
    name.value != props.account.name ||
    (props.account.emailVisibility && email.value != props.account.email) ||
    photoName.value != props.account.avatar
  ) {
    return true
  }
  return false
})

onBeforeMount(() => {
  initializeData()
})

async function initializeData(): Promise<void> {
  name.value = props.account.name
  if (props.account.emailVisibility) email.value = props.account.email
  //@ts-ignore
  photoName.value = props.account.avatar.replaceAll('_', ' ')
}

function handleFileChange(event: Event): void {
  //@ts-ignore
  photo.value = event.target.files[0]
  if (photo.value) photoName.value = photo.value.name as string
  else photoName.value = ''
}
async function handleEdit(): Promise<void> {
  if (
    ((props.account.emailVisibility && email.value != undefined) ||
      !props.account.emailVisibility) &&
    isModified.value
  ) {
    try {
      const formUser = new FormData()
      formUser.append('name', name.value)
      formUser.append('permissions_id', props.account.permissions_id)
      if (props.account.emailVisibility) formUser.append('email', email.value as string)
      if (photo.value) formUser.append('avatar', photo.value as Blob)
      await patchEdit(
        `collections/users/records/${props.account.id}`,
        formUser, //@ts-ignore
        userStore.userData?.token,
      )
      notificationStore.addNotification({
        type: 'success',
        message: `Paskyra sėkmingai atnaujinta`,
      })
      emits('update')
    } catch (error) {
      console.error(error)
      //@ts-ignore
      const errorCode = error.code
      if (errorCode == 'ERR_NETWORK') {
        notificationStore.addNotification({
          type: 'fail',
          message: 'Klaida jungiantis su serveriu',
        })
      } else if (errorCode == 'ECONNABORTED') {
        notificationStore.addNotification({ type: 'fail', message: 'Klaida, nutraukta operacija' })
      } else {
        notificationStore.addNotification({
          type: 'fail',
          message: `Paskyros duomenų atnaujinti nepavyko`,
        })
      }
    }
  }
}
</script>

<template>
  <div class="pl-[50px]">
    <p class="text-[30px] pb-[30px] pl-[50px]">Redaguoti paskyrą:</p>
    <div class="block pb-[10px] pt-[30px]">
      <p>Vardas:</p>
      <input class="contactInput" type="text" placeholder="Įveskite vardą..." v-model="name" />
    </div>
    <div class="block">
      <p>Eleketroninis paštas:</p>
      <input
        class="contactInput email iconPadding"
        type="text"
        placeholder="Įveskite el. pašto adresą..."
        v-model="email"
        v-if="props.account.emailVisibility"
      />
      <input
        class="contactInput email iconPadding"
        type="text"
        readonly
        value="**Nerodomas**"
        v-else
      />
      <p class="text-red-500">{{ errors.email }}</p>
    </div>
    <div class="block">
      <label for="addPhoto" class="addPhotoButton fit">Įkeltikte nuotrauką</label>
      <input
        type="file"
        id="addPhoto"
        class="hidden"
        @change="handleFileChange"
        accept="image/png, image/jpeg"
      />
      <p class="text-[18px]">
        {{ photoName == '' ? 'No photo uploaded' : photoName }}
      </p>
    </div>
    <div class="flex flex-col items-end justify-end pt-[50px] pb-[25px] pr-[25px]">
      <button class="loginButton fit" :class="{ active: !isModified }" @click="handleEdit">
        ATNAUJINTI
      </button>
    </div>
  </div>
</template>
