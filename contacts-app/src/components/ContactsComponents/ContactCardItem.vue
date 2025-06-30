<script setup lang="ts">
import type { contact } from '@/interfaces/contact'
import { computed, ref, watch } from 'vue'
import { useUser } from '@/stores/user'
const props = defineProps<{
  contact: contact
}>()

const emits = defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
}>()

const userStore = useUser()

//@ts-ignore
const photoURL = ref(BASE_URL + 'files/employees/' + props.contact.id + '/' + props.contact.photo)

const address = computed(() => {
  if (props.contact.expand && props.contact.expand.office_id)
    return (
      props.contact.expand.office_id.street +
      ' ' +
      props.contact.expand.office_id.street_number +
      ', ' +
      props.contact.expand.office_id.city
    )
  else return 'Nėra adreso'
})

function handleEdit(event: Event): void {
  event.stopPropagation()
  emits('edit')
}

function handleDelete(event: Event): void {
  event.stopPropagation()
  emits('delete')
}
watch(
  () => props.contact.photo,
  () => {
    if (props.contact.photo) {
      //@ts-ignore
      photoURL.value = BASE_URL + 'files/employees/' + props.contact.id + '/' + props.contact.photo
    }
  },
)
</script>

<template>
  <div class="contactItemCard">
    <div class="contactCardTitle">
      <img
        v-if="props.contact.photo == ''"
        src="@/assets/images/defaultAvatar.png"
        class="w-[50px] h-[50px]"
      />
      <img v-else :src="photoURL" class="w-[50px] h-[50px]" />
      <p class="pl-[30px] w-full h-auto">
        <span class="bold text-[30px]">
          {{ props.contact.name + ' ' + props.contact.surname }}
        </span>
        <br />
        Pozicija: {{ props.contact.position }}
      </p>
    </div>
    <div class="contactCardBody">
      <p>Telefono nr: {{ props.contact.phone_number }}</p>
      <p>El. paštas: {{ props.contact.email }}</p>
      <p>Adresas: {{ address }}</p>
      <div class="flex">
        <button
          class="circle edit"
          v-if="userStore.userData?.record.expand?.permissions_id?.edit_employees"
          @click="handleEdit"
        >
          <img src="@/assets/images/editIcon.png" class="w-[28px] h-[28px]" />
        </button>
        <button
          class="circle delete"
          v-if="userStore.userData?.record.expand?.permissions_id?.delete_employees"
          @click="handleDelete"
        >
          <img src="@/assets/images/deleteIcon.png" class="w-[28px] h-[28px]" />
        </button>
      </div>
    </div>
  </div>
</template>
