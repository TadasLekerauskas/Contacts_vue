<script setup lang="ts">
import type { contact } from '@/interfaces/contact'
import { computed } from 'vue'

const props = defineProps<{
  contact: contact
}>()

//@ts-ignore
const photoURL = BASE_URL + 'files/employees/' + props.contact.id + '/' + props.contact.photo

const companyName = computed(() => {
  if (props.contact.expand && props.contact.expand.company_id) {
    return props.contact.expand.company_id.name
  }
  return 'Nenurodyta'
})
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
const divisionName = computed(() => {
  if (props.contact.expand && props.contact.expand.division_id) {
    return props.contact.expand.division_id.name
  }
  return 'Nenurodyta'
})
const departmentName = computed(() => {
  if (props.contact.expand && props.contact.expand.department_id) {
    return props.contact.expand.department_id.name
  }
  return 'Nenurodyta'
})
const groupName = computed(() => {
  if (props.contact.expand && props.contact.expand.group_id) {
    return props.contact.expand.group_id.name
  }
  return 'Nenurodyta'
})
</script>

<template>
  <div class="flex items-center pb-[30px]">
    <img
      v-if="props.contact.photo == ''"
      src="@/assets/images/defaultAvatar.png"
      class="w-[90px] h-[90px]"
    />
    <img v-else :src="photoURL" class="w-[90px] h-[90px]" />
    <p class="pl-[30px] w-full h-auto">
      <span class="text-[35px] bold font-['Roboto']">
        {{ props.contact.name + ' ' + props.contact.surname }}
      </span>
      <br />
      <span class="text-[28px] font-['Roboto']">Pozicija: {{ props.contact.position }}</span>
    </p>
  </div>
  <div class="contactDetails font-[Roboto]">
    <div class="contactDetailsColumn">
      <p class="bold text-[25px]">Kontaktinės detalės:</p>
      <hr class="border-black/10" />
      <p class="py-[20px] text-[17px]">
        Elektroninis paštas: <span class="text-blue-700">{{ props.contact.email }}</span>
      </p>
      <p class="pb-[20px] text-[17px]">
        Telefono numeris: <span class="text-blue-700">{{ props.contact.phone_number }}</span>
      </p>
    </div>
    <div class="contactDetailsColumn">
      <p class="bold text-[25px]">Kompanijos detalės:</p>
      <hr class="border-black/10" />
      <p class="py-[20px] text-[17px]">Kompanija: {{ companyName }}</p>
      <p class="pb-[20px] text-[17px]">Būstinė: {{ address }}</p>
      <p class="pb-[20px] text-[17px]">Padalinys: {{ divisionName }}</p>
      <p class="pb-[20px] text-[17px]">Skyrius: {{ departmentName }}</p>
      <p class="pb-[20px] text-[17px]">Grupė: {{ groupName }}</p>
    </div>
  </div>
</template>
