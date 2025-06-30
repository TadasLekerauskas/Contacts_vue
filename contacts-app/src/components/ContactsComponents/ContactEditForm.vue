<script setup lang="ts">
import { computed, onBeforeMount, onUpdated, ref } from 'vue'
import { useCompany } from '@/composables/company'
import { useOffice } from '@/composables/office'
import { useDivision } from '@/composables/division'
import { useDepartment } from '@/composables/department'
import { useGroup } from '@/composables/group'
import { useCompaniesOffices } from '@/composables/companies_offices'
import { useOfficesDivisions } from '@/composables/offices_divisions'
import { useDivisionsDepartments } from '@/composables/divisions_departments'
import { useDepartmentsGroups } from '@/composables/departments_groups'
import type { companies_offices } from '@/interfaces/companies_offices'
import type { offices_divisions } from '@/interfaces/offices_divisions'
import type { divisions_departments } from '@/interfaces/divisions_departments'
import type { departments_groups } from '@/interfaces/departments_groups'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { object, string } from 'yup'
import type { contact } from '@/interfaces/contact'
import { patchEdit } from '@/services/services'
import { useUser } from '@/stores/user'
import { useNotification } from '@/stores/notification'
import { getData } from '@/services/services'

const props = defineProps<{
  contact: contact
}>()

const emits = defineEmits<{
  (e: 'update'): void
}>()

const notificationStore = useNotification()

const userSore = useUser()

const companyComposable = useCompany()
const officeComposable = useOffice()
const divisionComposable = useDivision()
const departmentComposable = useDepartment()
const groupComposable = useGroup()

const companiesOfficesComposable = useCompaniesOffices()
const officesDivisionsComposable = useOfficesDivisions()
const divisionsDepartmentsComposable = useDivisionsDepartments()
const departmentsGroupsComposable = useDepartmentsGroups()

const { errors, defineField } = useForm({
  validationSchema: toTypedSchema(
    object({
      name: string().trim().max(10).required(),
      lastName: string().trim().max(10).required(),
      email: string().email().trim().required(),
      position: string().trim().max(20).required(),
      company: string().required(),
      office: string().required(),
      division: string().required(),
    }),
  ),
})

const [email] = defineField('email')
const [name] = defineField('name')
const [lastName] = defineField('lastName')
const [position] = defineField('position')
const [company] = defineField('company')
const [office] = defineField('office')
const [division] = defineField('division')

const phone = ref<string | undefined>(undefined)

const department = ref<string | undefined>(undefined)
const group = ref<string | undefined>(undefined)

const photo = ref<File>()

const areErrors = computed(() => {
  if (errors.value.company != undefined) {
    return true
  }
  if (errors.value.division != undefined) {
    return true
  }
  if (errors.value.email != undefined) {
    return true
  }
  if (errors.value.lastName != undefined) {
    return true
  }
  if (errors.value.name != undefined) {
    return true
  }
  if (errors.value.office != undefined) {
    return true
  }
  if (errors.value.position != undefined) {
    return true
  }
  return false
})

const isModified = computed(() => {
  if (
    props.contact.name != name.value ||
    props.contact.surname != lastName.value ||
    props.contact.position != position.value ||
    props.contact.email != email.value ||
    props.contact.phone_number != phone.value ||
    props.contact.company_id != company.value ||
    props.contact.office_id != office.value ||
    props.contact.division_id != division.value ||
    props.contact.department_id != department.value ||
    props.contact.group_id != group.value ||
    (photo.value && props.contact.photo != photo.value.name)
  ) {
    return true
  }
  return false
})

const isNameEmpty = computed(() => {
  if (name.value == undefined || name.value == '') {
    return true
  }
  return false
})

const isSuranameEmpty = computed(() => {
  if (lastName.value == undefined || lastName.value == '') {
    return true
  }
  return false
})

const isEmailEmpty = computed(() => {
  if (email.value == undefined || email.value == '') {
    return true
  }
  return false
})

const isPositionEmpty = computed(() => {
  if (position.value == undefined || position.value == '') {
    return true
  }
  return false
})

const isCompanyEmpty = computed(() => {
  if (company.value == undefined || company.value == '') {
    return true
  }
  return false
})

const isOfficeEmpty = computed(() => {
  if (office.value == undefined || office.value == '') {
    return true
  }
  return false
})

const isDivisionEmpty = computed(() => {
  if (division.value == undefined || division.value == '') {
    return true
  }
  return false
})

const nameErrors = computed(() => {
  if (errors.value.name || isNameEmpty.value) {
    return isNameEmpty.value
      ? 'Vardas yra privalomas laukas'
      : 'Maksimalus vardo simbolių skaičius yra 10'
  }
  return undefined
})

const surnameErrors = computed(() => {
  if (errors.value.lastName || isSuranameEmpty.value) {
    return isSuranameEmpty.value
      ? 'Pavardė yra privalomas laukas'
      : 'Maksimalus pavardės simbolių skaičius yra 10'
  }
  return undefined
})

const positionErrors = computed(() => {
  if (errors.value.position || isPositionEmpty.value) {
    return isPositionEmpty.value
      ? 'Pozicija yra privalomas laukas'
      : 'Maksimalus pozicijos simbolių skaičius yra 20'
  }
  return undefined
})

const emailError = computed(() => {
  if (errors.value.email || isEmailEmpty.value) {
    return isEmailEmpty.value
      ? 'Elektroninis paštas yra privalomas laukas'
      : 'Elektroninis paštas yra netinkamoje formoje'
  }
  return undefined
})

onBeforeMount(() => {
  initilizeEditForm()
})

async function initilizeEditForm(): Promise<void> {
  await companyComposable.fetchCompaniesData(`collections/companies/records`)
  company.value = props.contact.company_id
  await handleOffice()
  office.value = props.contact.office_id
  await handleDivision()
  division.value = props.contact.division_id
  await handleDepartment()
  department.value = props.contact.department_id
  await handleGroup()
  group.value = props.contact.group_id

  email.value = props.contact.email
  name.value = props.contact.name
  lastName.value = props.contact.surname
  position.value = props.contact.position
  phone.value = props.contact.phone_number
  if (props.contact.photo && props.contact.photo != '') {
    photo.value = new File(
      await getData(`files/employees/${props.contact.id}/${props.contact.photo}`),
      props.contact.photo as string,
    )
  }
}

function buildOfficeQuery(baseURL: string, array: companies_offices[]): string {
  let url = baseURL + '?filter=('
  let filterNeeded = false
  for (let i = 0; i < array.length; i++) {
    url += addOrFilterOption(`id='${array[i].office_id}'`, filterNeeded)
    filterNeeded = true
  }
  url += ')'
  return url
}

function buildDivisionQuery(baseURL: string, array: offices_divisions[]): string {
  let url = baseURL + '?filter=('
  let filterNeeded = false
  for (let i = 0; i < array.length; i++) {
    url += addOrFilterOption(`id='${array[i].division_id}'`, filterNeeded)
    filterNeeded = true
  }
  url += ')'
  return url
}

function buildDepartmentQuery(baseURL: string, array: divisions_departments[]): string {
  let url = baseURL + '?filter=('
  let filterNeeded = false
  for (let i = 0; i < array.length; i++) {
    url += addOrFilterOption(`id='${array[i].department_id}'`, filterNeeded)
    filterNeeded = true
  }
  url += ')'
  return url
}

function buildGroupQuery(baseURL: string, array: departments_groups[]): string {
  let url = baseURL + '?filter=('
  let filterNeeded = false
  for (let i = 0; i < array.length; i++) {
    url += addOrFilterOption(`id='${array[i].group_id}'`, filterNeeded)
    filterNeeded = true
  }
  url += ')'
  return url
}

function addOrFilterOption(filterOption: string, filterNeeded: boolean): string {
  if (!filterNeeded) {
    return filterOption
  } else {
    return '||' + filterOption
  }
}

async function handleOffice(): Promise<void> {
  office.value = undefined
  division.value = undefined
  department.value = ''
  group.value = ''

  officeComposable.deleteItems()
  divisionComposable.deleteItems()
  departmentComposable.deleteItems()
  groupComposable.deleteItems()

  await companiesOfficesComposable.fetchCompaniesOfficesData(
    `collections/companies_offices/records?filter=(company_id='${company.value}')`,
  )
  if (
    companiesOfficesComposable.companies_offices_Array.value &&
    companiesOfficesComposable.companies_offices_Array.value.length != 0
  ) {
    await officeComposable.fetchOfficesData(
      buildOfficeQuery(
        'collections/offices/records',
        companiesOfficesComposable.companies_offices_Array.value,
      ),
    )
    if (officeComposable.error.value != '') {
      notificationStore.addNotification({
        type: 'fail',
        message: 'Ofiso filtras: ' + officeComposable.error.value,
      })
    }
  } else if (companiesOfficesComposable.error.value != '') {
    notificationStore.addNotification({
      type: 'fail',
      message: 'Ofiso filtras: ' + companiesOfficesComposable.error.value,
    })
  }
}

async function handleDivision(): Promise<void> {
  division.value = undefined
  department.value = ''
  group.value = ''

  divisionComposable.deleteItems()
  departmentComposable.deleteItems()
  groupComposable.deleteItems()

  await officesDivisionsComposable.fetchOfficesDivisionsData(
    `collections/offices_divisions/records?filter=(office_id='${office.value}')`,
  )
  if (
    officesDivisionsComposable.offices_divisions_array.value &&
    officesDivisionsComposable.offices_divisions_array.value.length != 0
  ) {
    await divisionComposable.fetchDivisionsData(
      buildDivisionQuery(
        'collections/divisions/records',
        officesDivisionsComposable.offices_divisions_array.value,
      ),
    )
    if (divisionComposable.error.value != '') {
      notificationStore.addNotification({
        type: 'fail',
        message: 'Padalinio filtras: ' + divisionComposable.error.value,
      })
    }
  } else if (officesDivisionsComposable.error.value != '') {
    notificationStore.addNotification({
      type: 'fail',
      message: 'Padalinio filtras: ' + officesDivisionsComposable.error.value,
    })
  }
}

async function handleDepartment(): Promise<void> {
  department.value = ''
  group.value = ''

  departmentComposable.deleteItems()
  groupComposable.deleteItems()

  await divisionsDepartmentsComposable.fetchDivisionsDepartmentsData(
    `collections/divisions_departments/records?filter=(division_id='${division.value}')`,
  )
  if (
    divisionsDepartmentsComposable.divisions_departments_array.value &&
    divisionsDepartmentsComposable.divisions_departments_array.value.length != 0
  ) {
    await departmentComposable.fetchDepartmentsData(
      buildDepartmentQuery(
        'collections/departments/records',
        divisionsDepartmentsComposable.divisions_departments_array.value,
      ),
    )
    if (departmentComposable.error.value != '') {
      notificationStore.addNotification({
        type: 'fail',
        message: 'Skyriaus filtras: ' + departmentComposable.error.value,
      })
    }
  } else if (divisionsDepartmentsComposable.error.value != '') {
    notificationStore.addNotification({
      type: 'fail',
      message: 'Skyriaus filtras: ' + divisionsDepartmentsComposable.error.value,
    })
  }
}

async function handleGroup(): Promise<void> {
  group.value = ''

  groupComposable.deleteItems()

  await departmentsGroupsComposable.fetchDepartmentsGroupsData(
    `collections/departments_groups/records?filter=(department_id='${department.value}')`,
  )
  if (
    departmentsGroupsComposable.departments_groups_array.value &&
    departmentsGroupsComposable.departments_groups_array.value.length != 0
  ) {
    await groupComposable.fetchGroupsData(
      buildGroupQuery(
        'collections/groups/records',
        departmentsGroupsComposable.departments_groups_array.value,
      ),
    )
    if (groupComposable.error.value != '') {
      notificationStore.addNotification({
        type: 'fail',
        message: 'Grupės filtras: ' + groupComposable.error.value,
      })
    }
  } else if (departmentsGroupsComposable.error.value != '') {
    notificationStore.addNotification({
      type: 'fail',
      message: 'Grupės filtras: ' + departmentsGroupsComposable.error.value,
    })
  }
}

function handleFileChange(event: Event): void {
  //@ts-ignore
  photo.value = event.target.files[0]
}

async function editContact(): Promise<void> {
  if (!areErrors.value && isModified.value) {
    const form = new FormData()
    form.append('name', name.value as string)
    form.append('surname', lastName.value as string)
    form.append('position', position.value as string)
    form.append('phone_number', phone.value as string)
    form.append('email', email.value as string)
    form.append('company_id', company.value as string)
    form.append('office_id', office.value as string)
    form.append('division_id', division.value as string)
    form.append('department_id', department.value as string)
    form.append('group_id', group.value as string)
    if (photo.value) {
      form.append('photo', photo.value as Blob)
    }
    try {
      await patchEdit(
        `collections/employees/records/${props.contact.id}`,
        form, //@ts-ignore
        userSore.userData?.token,
      )
      notificationStore.addNotification({
        type: 'success',
        message: `Kontaktas ${name.value} ${lastName.value} atnaujintas sėkmingai`,
      })
      emits('update')
    } catch (err) {
      //@ts-ignore
      const errorCode = err.code
      //@ts-ignore
      const status = err.status
      if (errorCode == 'ERR_NETWORK') {
        notificationStore.addNotification({
          type: 'fail',
          message: `Neprisijungta prie serverio`,
        })
      } else if (errorCode == 'ECONNABORTED') {
        notificationStore.addNotification({
          type: 'fail',
          message: `Nutraukta operacija`,
        })
      } else if (status == 404) {
        notificationStore.addNotification({
          type: 'fail',
          message: `Nerastas kontaktas ${props.contact.name + ' ' + props.contact.surname}`,
        })
        emits('update')
      } else {
        notificationStore.addNotification({
          type: 'fail',
          message: `Kontaktas ${name.value} ${lastName.value} nebuvo atnaujintas`,
        })
      }
    }
  }
}
</script>

<template>
  <div class="font-[Roboto]">
    <div class="formRow">
      <div class="formColumn">
        <p class="text-[30px] pl-[20px] pb-[5px]">Redaguoti kontaktą:</p>
        <div class="contactBlock">
          <p class="text-[18px]">Vardas:</p>
          <input class="contactInput" type="text" placeholder="Įveskite vardą..." v-model="name" />
          <p class="text-red-500">{{ nameErrors }}</p>
        </div>
        <div class="contactBlock">
          <p class="text-[18px]">Pavardė:</p>
          <input
            class="contactInput"
            type="text"
            placeholder="Įveskite pavardę..."
            v-model="lastName"
          />
          <p class="text-red-500">{{ surnameErrors }}</p>
        </div>
        <div class="contactBlock">
          <p class="text-[18px]">Pozicija:</p>
          <input
            class="contactInput"
            type="text"
            placeholder="Įveskite poziciją..."
            v-model="position"
          />
          <p class="text-red-500">{{ positionErrors }}</p>
        </div>
        <div>
          <p class="text-[25px] pl-[20px] pb-[10px]">Kontaktinė informacija:</p>
        </div>
        <div class="contactBlock">
          <p class="text-[18px]">Elektroninis paštas:</p>
          <input
            class="contactInput email iconPadding"
            type="email"
            placeholder="Įveskite el. paštą..."
            v-model="email"
          />
          <p class="text-red-500">{{ emailError }}</p>
        </div>
        <div class="contactBlock">
          <p class="text-[18px]">Telefono numeris:</p>
          <input
            class="contactInput phoneInput iconPadding"
            type="text"
            placeholder="Įveskite telefono numerį..."
            v-model="phone"
          />
        </div>
      </div>
      <div class="formColumn">
        <div class="w-[700px]">
          <div>
            <p class="text-[25px] pb-[10px] pl-[100px]">Įmonės detalės:</p>
          </div>
          <div class="contactBlock">
            <p class="text-[18px]">Įmonė:</p>
            <select class="contactSelect" v-model="company" @change="handleOffice">
              <option :value="undefined" selected class="text-gray-600">Pasirinkite įmonę</option>
              <option v-for="company in companyComposable.companyArray.value" :value="company.id">
                {{ company.name }}
              </option>
            </select>
            <p class="text-red-500" v-if="isCompanyEmpty">Kompanija yra privalomas laukas</p>
          </div>
          <div class="contactBlock">
            <p class="text-[18px]">Ofisas:</p>
            <select class="contactSelect" v-model="office" @change="handleDivision">
              <option :value="undefined" selected class="text-gray-300">Pasirinkite ofisą</option>
              <option v-for="office in officeComposable.officeArray.value" :value="office.id">
                {{ office.name }}
              </option>
            </select>
            <p class="text-red-500" v-if="isOfficeEmpty">Ofisas yra privalomas laukas</p>
          </div>
          <div class="contactBlock">
            <p class="text-[18px]">Padalinys:</p>
            <select class="contactSelect" v-model="division" @change="handleDepartment">
              <option :value="undefined" selected class="text-gray-300">
                Pasirinkite padalinį
              </option>
              <option
                v-for="division in divisionComposable.divisionArray.value"
                :value="division.id"
              >
                {{ division.name }}
              </option>
            </select>
            <p class="text-red-500" v-if="isDivisionEmpty">Padalinys yra privalomas laukas</p>
          </div>
          <div class="contactBlock">
            <p class="text-[18px]">Skyrius:</p>
            <select class="contactSelect" v-model="department" @change="handleGroup">
              <option :value="''" selected class="text-gray-300">Pasirinkite skyrių</option>
              <option
                v-for="department in departmentComposable.departmentArray.value"
                :value="department.id"
              >
                {{ department.name }}
              </option>
            </select>
          </div>
          <div class="contactBlock">
            <p class="text-[18px]">Grupė:</p>
            <select class="contactSelect" v-model="group">
              <option :value="''" selected class="text-gray-300">Pasirinkite grupę</option>
              <option v-for="group in groupComposable.groupArray.value" :value="group.id">
                {{ group.name }}
              </option>
            </select>
          </div>
          <div class="flex">
            <label for="addPhoto" class="addPhotoButton">ĮKELTI NUOTRAUKĄ</label>
            <input
              type="file"
              id="addPhoto"
              class="hidden"
              @change="handleFileChange"
              accept="image/png, image/jpeg"
            />
            <p class="pt-[35px] pl-[10px] text-[18px]">
              {{ photo == undefined ? 'No photo chosen' : photo?.name }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-row-reverse w-[full] pr-[30px]">
      <button class="addButton" @click="editContact">REDAGUOTI</button>
    </div>
    <div class="flex flex-row-reverse w-[full] pr-[30px] pb-[30px]">
      <p class="text-red-500 pr-[80px]" v-if="!isModified">Niekas nepakeista</p>
    </div>
  </div>
</template>
