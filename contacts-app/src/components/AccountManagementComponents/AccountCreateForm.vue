<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { object, string } from 'yup'
import type { permissions } from '@/interfaces/permissions'
import { postCreate } from '@/services/services'
import { useNotification } from '@/stores/notification'
import { useUser } from '@/stores/user'
import { ref } from 'vue'
const emits = defineEmits<{
  (e: 'create', password: string): void
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

const edit_contacts = ref(false)
const delete_contacts = ref(false)
const edit_companies = ref(false)
const delete_companies = ref(false)
const edit_offices = ref(false)
const delete_offices = ref(false)
const edit_structure = ref(false)
const delete_structure = ref(false)

function handleFileChange(event: Event): void {
  //@ts-ignore
  photo.value = event.target.files[0]
}

async function handleCreate(): Promise<void> {
  if (email.value != undefined) {
    try {
      const formPerm = new FormData()
      formPerm.append('edit_employees', edit_contacts.value ? 'true' : 'false')
      formPerm.append('delete_employees', delete_contacts.value ? 'true' : 'false')
      formPerm.append('edit_companies', edit_companies.value ? 'true' : 'false')
      formPerm.append('delete_companies', delete_companies.value ? 'true' : 'false')
      formPerm.append('edit_offices', edit_offices.value ? 'true' : 'false')
      formPerm.append('delete_offices', delete_offices.value ? 'true' : 'false')
      formPerm.append('edit_structure', edit_structure.value ? 'true' : 'false')
      formPerm.append('delete_structure', delete_structure.value ? 'true' : 'false')
      formPerm.append('read_permissions', 'true')
      const response: permissions = await postCreate(
        'collections/user_permissions/records',
        formPerm, //@ts-ignore
        userStore.userData?.token,
      )
      notificationStore.addNotification({ type: 'success', message: 'Sukurti paskyros leidimai' })
      createUser(response)
    } catch (error) {
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
          message: `Naujos paskyros leidimų sukurti nepavyko`,
        })
      }
    }
  }
}
async function createUser(permissions: permissions): Promise<void> {
  try {
    const formUser = new FormData()
    const password = generatePassword()
    formUser.append('name', name.value)
    formUser.append('email', email.value as string)
    formUser.append('permissions_id', permissions.id)
    formUser.append('password', password)
    formUser.append('passwordConfirm', password)
    formUser.append('emailVisibility', 'true')
    formUser.append('verified', 'true')
    if (photo.value) formUser.append('avatar', photo.value as Blob)
    //@ts-ignore
    await postCreate('collections/users/records', formUser, userStore.userData?.token)
    notificationStore.addNotification({
      type: 'success',
      message: `Paskyra sėkmingai sukurta`,
    })
    emits('create', password)
  } catch (error) {
    console.error(error)
    //@ts-ignore
    const errorCode = error.code
    if (errorCode == 'ERR_NETWORK') {
      notificationStore.addNotification({ type: 'fail', message: 'Klaida jungiantis su serveriu' })
    } else if (errorCode == 'ECONNABORTED') {
      notificationStore.addNotification({ type: 'fail', message: 'Klaida, nutraukta operacija' })
    } else {
      notificationStore.addNotification({
        type: 'fail',
        message: `Naujos paskyros sukurti nepavyko`,
      })
    }
  }
}

function generatePassword(): string {
  const characters = 'aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789!?*'
  let password = ''
  for (let i = 0; i < 8; i++) {
    const randIdx = Math.floor(Math.random() * characters.length)
    password += characters[randIdx]
  }
  return password
}
</script>

<template>
  <div>
    <p class="text-[30px] pb-[30px] pl-[50px]">Pridėkite naują admin paskyrą:</p>
    <div class="formRow">
      <div class="formColumn">
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
          />
          <p class="text-red-500">{{ errors.email }}</p>
        </div>
        <div class="flex flex-col items-center justify-center">
          <label for="addPhoto" class="addPhotoButton">ĮKELTI NUOTRAUKĄ</label>
          <input
            type="file"
            id="addPhoto"
            class="hidden"
            @change="handleFileChange"
            accept="image/png, image/jpeg"
          />
          <p class="text-[18px]">
            {{ photo == null ? 'No photo uploaded' : photo?.name }}
          </p>
        </div>
      </div>
      <div class="formColumn">
        <div class="flex flex-col w-[700px] h-[650px]">
          <p class="text-[25px] pl-[20px] pb-[10px]">Administracinės teisės:</p>
          <div class="oneCheckbox">
            <input type="checkbox" id="edit_contacts" v-model="edit_contacts" class="checkbox" />
            <label for="edit_contacts" class="checkboxLabel"> Redaguoti ir kurti kontaktus</label
            ><br />
          </div>
          <div class="oneCheckbox">
            <input
              type="checkbox"
              id="delete_contacts"
              v-model="delete_contacts"
              class="checkbox"
            />
            <label for="delete_contacts" class="checkboxLabel"> Trinti kontaktus</label><br />
          </div>
          <div class="oneCheckbox">
            <input type="checkbox" id="edit_companies" v-model="edit_companies" class="checkbox" />
            <label for="edit_companies" class="checkboxLabel"> Redaguoti ir kurti įmones</label
            ><br />
          </div>
          <div class="oneCheckbox">
            <input
              type="checkbox"
              id="delete_companies"
              v-model="delete_companies"
              class="checkbox"
            />
            <label for="delete_companies" class="checkboxLabel"> Trinti įmones</label><br />
          </div>
          <div class="oneCheckbox">
            <input type="checkbox" id="edit_offices" v-model="edit_offices" class="checkbox" />
            <label for="edit_offices" class="checkboxLabel"> Redaguoti ir kurti ofisus </label
            ><br />
          </div>
          <div class="oneCheckbox">
            <input type="checkbox" id="delete_offices" v-model="delete_offices" class="checkbox" />
            <label for="delete_offices" class="checkboxLabel"> Trinti ofisus</label><br />
          </div>
          <div class="oneCheckbox">
            <input type="checkbox" id="edit_structure" v-model="edit_structure" class="checkbox" />
            <label for="edit_structure" class="checkboxLabel"> Redaguoti ir kurti struktūras</label
            ><br />
          </div>
          <div class="oneCheckbox">
            <input
              type="checkbox"
              id="delete_structure"
              v-model="delete_structure"
              class="checkbox"
            />
            <label for="delete_structure" class="checkboxLabel"> Trinti struktūras</label><br />
          </div>
          <div class="flex w-full h-full items-end justify-end pr-[100px] pb-[50px]">
            <button class="loginButton" @click="handleCreate">PRIDĖTI</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
