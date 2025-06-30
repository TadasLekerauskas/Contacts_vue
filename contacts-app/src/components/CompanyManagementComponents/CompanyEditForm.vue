<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { object, string } from 'yup'
import { patchEdit } from '@/services/services'
import { useNotification } from '@/stores/notification'
import { useUser } from '@/stores/user'
import { computed, onBeforeMount } from 'vue'
import type { company } from '@/interfaces/company'
const props = defineProps<{
  company: company
}>()

const emits = defineEmits<{
  (e: 'update'): void
}>()

const notificationStore = useNotification()

const userStore = useUser()

const isModified = computed(() => {
  if (companyName.value == props.company.name) {
    return false
  }
  return true
})

const { errors, defineField } = useForm({
  validationSchema: toTypedSchema(
    object({
      companyName: string().trim().required(),
    }),
  ),
})

function onEnter(event: KeyboardEvent): void {
  if (event.key == 'Enter') {
    editContact()
  }
}

const [companyName] = defineField('companyName')

onBeforeMount(() => {
  companyName.value = props.company.name
})

async function editContact(): Promise<void> {
  if (companyName.value && isModified) {
    try {
      const form = new FormData()
      form.append('name', companyName.value)

      await patchEdit(
        `collections/companies/records/${props.company.id}`,
        form, //@ts-ignore
        userStore.userData.token,
      )
      notificationStore.addNotification({ type: 'success', message: 'Įmonė sėkmingai redaguota' })
      emits('update')
    } catch (error) {
      notificationStore.addNotification({ type: 'fail', message: 'Įmonės redaguoti nepavyko' })
    }
  }
}
</script>

<template>
  <div class="pl-[50px] pb-[50px] w-[800px]">
    <p class="text-[30px] pb-[30px]">Redaguoti įmonę:</p>
    <div class="block pb-[10px]">
      <p>Įmonės pavadinimas:</p>
      <input
        class="contactInput"
        type="text"
        placeholder="Įveskite pavardę..."
        v-model="companyName"
        @keypress="onEnter"
      />
      <p class="text-red-500">{{ errors.companyName }}</p>
      <p class="text-red-500" v-if="!isModified">Įmonės vardas nepakeistas</p>
    </div>
    <div>
      <button class="addButton" @click="editContact">REDAGUOTI</button>
    </div>
  </div>
</template>
