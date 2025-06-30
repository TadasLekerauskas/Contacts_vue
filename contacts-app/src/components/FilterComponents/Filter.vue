<script setup lang="ts">
import type { company } from '@/interfaces/company'
import type { department } from '@/interfaces/department'
import type { division } from '@/interfaces/division'
import type { group } from '@/interfaces/group'
import type { office } from '@/interfaces/office'
import { ref } from 'vue'

const props = defineProps<{
  companyArray: company[] | null
  officeArray: office[] | null
  divisionArray: division[] | null
  departmentArray: department[] | null
  groupArray: group[] | null
}>()

const emits = defineEmits<{
  (e: 'choose-company', company: string): void
  (e: 'choose-office', offce: string): void
  (e: 'choose-division', division: string): void
  (e: 'choose-department', department: string): void
  (e: 'choose-group', group: string): void
}>()

const company = ref('')
const office = ref('')
const division = ref('')
const department = ref('')
const group = ref('')

function handleCompany(): void {
  office.value = ''
  division.value = ''
  department.value = ''
  group.value = ''
  emits('choose-company', company.value)
}
function handleOffice(): void {
  division.value = ''
  department.value = ''
  group.value = ''
  emits('choose-office', office.value)
}
function handleDivision(): void {
  department.value = ''
  group.value = ''
  emits('choose-division', division.value)
}
function handleDepartment(): void {
  group.value = ''
  emits('choose-department', department.value)
}
function handleGroup(): void {
  emits('choose-group', group.value)
}
</script>

<template>
  <div class="filter">
    <div class="singleFilter">
      <p>Įmonė:</p>
      <select v-model="company" @change="handleCompany">
        <option value="" selected>Filtruoti įmones...</option>
        <option v-for="company in props.companyArray" :value="company.id">
          {{ company.name }}
        </option>
      </select>
    </div>
    <div class="singleFilter">
      <p>Ofisas:</p>
      <select v-model="office" @change="handleOffice">
        <option value="" selected>Filtruoti ofisus...</option>
        <option v-for="office in props.officeArray" :value="office.id">{{ office.name }}</option>
      </select>
    </div>
    <div class="singleFilter">
      <p>Padalinys:</p>
      <select v-model="division" @change="handleDivision">
        <option value="" selected>Filtruoti padalinius...</option>
        <option v-for="division in props.divisionArray" :value="division.id">
          {{ division.name }}
        </option>
      </select>
    </div>
    <div class="singleFilter">
      <p>Skyrius:</p>
      <select v-model="department" @change="handleDepartment">
        <option value="" selected>Filtruoti skyrius...</option>
        <option v-for="department in props.departmentArray" :value="department.id">
          {{ department.name }}
        </option>
      </select>
    </div>
    <div class="singleFilter">
      <p>Grupė:</p>
      <select v-model="group" @change="handleGroup">
        <option value="" selected>Filtruoti grupes...</option>
        <option v-for="group in props.groupArray" :value="group.id">{{ group.name }}</option>
      </select>
    </div>
  </div>
</template>
