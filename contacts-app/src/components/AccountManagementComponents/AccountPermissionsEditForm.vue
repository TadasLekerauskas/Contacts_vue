<script setup lang="ts">
import type { account } from '@/interfaces/account'
import { patchEdit } from '@/services/services'
import { computed, onBeforeMount, ref } from 'vue'
import { useUser } from '@/stores/user'
import { useNotification } from '@/stores/notification'

const props = defineProps<{
  account: account
}>()

const emits = defineEmits<{
  (e: 'update'): void
}>()

const userStore = useUser()

const notificationStore = useNotification()

const edit_contacts = ref(false)
const delete_contacts = ref(false)
const edit_companies = ref(false)
const delete_companies = ref(false)
const edit_offices = ref(false)
const delete_offices = ref(false)
const edit_structure = ref(false)
const delete_structure = ref(false)

onBeforeMount(() => {
  edit_contacts.value = props.account.expand.permissions_id.edit_employees
  delete_contacts.value = props.account.expand.permissions_id.delete_employees
  edit_companies.value = props.account.expand.permissions_id.edit_companies
  delete_companies.value = props.account.expand.permissions_id.delete_companies
  edit_offices.value = props.account.expand.permissions_id.edit_offices
  delete_offices.value = props.account.expand.permissions_id.delete_offices
  edit_structure.value = props.account.expand.permissions_id.edit_structure
  delete_structure.value = props.account.expand.permissions_id.delete_structure
})

const isModified = computed(() => {
  if (
    edit_contacts.value != props.account.expand.permissions_id.edit_employees ||
    delete_contacts.value != props.account.expand.permissions_id.delete_employees ||
    edit_companies.value != props.account.expand.permissions_id.edit_companies ||
    delete_companies.value != props.account.expand.permissions_id.delete_companies ||
    edit_offices.value != props.account.expand.permissions_id.edit_offices ||
    delete_offices.value != props.account.expand.permissions_id.delete_offices ||
    edit_structure.value != props.account.expand.permissions_id.edit_structure ||
    delete_structure.value != props.account.expand.permissions_id.delete_structure
  ) {
    return true
  }
  return false
})

async function handleEdit(): Promise<void> {
  if (isModified.value) {
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
      await patchEdit(
        `collections/user_permissions/records/${props.account.permissions_id}`,
        formPerm, //@ts-ignore
        userStore.userData?.token,
      )
      notificationStore.addNotification({
        type: 'success',
        message: 'Paskyros leidimai atnaujinti sėkmingai',
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
          message: `Klaida atnaujinant paskyros leidimus`,
        })
      }
    }
  }
}
</script>

<template>
  <div>
    <p class="text-[30px] pb-[30px] pl-[50px]">Pridėkite naują admin paskyrą:</p>
    <div class="pl-[100px]">
      <p class="text-[25px] pl-[20px] pb-[10px]">Administracinės teisės:</p>
      <div class="oneCheckbox">
        <input type="checkbox" id="edit_contacts" v-model="edit_contacts" class="checkbox" />
        <label for="edit_contacts" class="checkboxLabel"> Redaguoti ir kurti kontaktus</label><br />
      </div>
      <div class="oneCheckbox">
        <input type="checkbox" id="delete_contacts" v-model="delete_contacts" class="checkbox" />
        <label for="delete_contacts" class="checkboxLabel"> Trinti kontaktus</label><br />
      </div>
      <div class="oneCheckbox">
        <input type="checkbox" id="edit_companies" v-model="edit_companies" class="checkbox" />
        <label for="edit_companies" class="checkboxLabel"> Redaguoti ir kurti įmones</label><br />
      </div>
      <div class="oneCheckbox">
        <input type="checkbox" id="delete_companies" v-model="delete_companies" class="checkbox" />
        <label for="delete_companies" class="checkboxLabel"> Trinti įmones</label><br />
      </div>
      <div class="oneCheckbox">
        <input type="checkbox" id="edit_offices" v-model="edit_offices" class="checkbox" />
        <label for="edit_offices" class="checkboxLabel"> Redaguoti ir kurti ofisus </label><br />
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
        <input type="checkbox" id="delete_structure" v-model="delete_structure" class="checkbox" />
        <label for="delete_structure" class="checkboxLabel"> Trinti struktūras</label><br />
      </div>
      <div class="flex flex-col w-full h-full items-end justify-end pr-[25px] pb-[25px]">
        <button class="loginButton fit" :class="{ active: !isModified }" @click="handleEdit">
          ATNAUJINTI
        </button>
      </div>
    </div>
  </div>
</template>
