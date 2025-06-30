<script setup lang="ts">
import ContactList from '@/components/ContactsComponents/ContactList.vue'
import { useContact } from '@/composables/contact'
import { onBeforeMount, ref, shallowRef, watch, type Component } from 'vue'
import { useNotification } from '@/stores/notification'
import { useOffice } from '@/composables/office'
import { useCompany } from '@/composables/company'
import { useDepartment } from '@/composables/department'
import { useDivision } from '@/composables/division'
import { useGroup } from '@/composables/group'
import { useCompaniesOffices } from '@/composables/companies_offices'
import type { companies_offices } from '@/interfaces/companies_offices'
import { useOfficesDivisions } from '@/composables/offices_divisions'
import type { offices_divisions } from '@/interfaces/offices_divisions'
import { useDivisionsDepartments } from '@/composables/divisions_departments'
import type { divisions_departments } from '@/interfaces/divisions_departments'
import { useDepartmentsGroups } from '@/composables/departments_groups'
import Pagination from '@/components/PaginationComponents/Pagination.vue'
import Searchbar from '@/components/SearchbarComponents/Searchbar.vue'
import Filter from '@/components/FilterComponents/Filter.vue'
import type { departments_groups } from '@/interfaces/departments_groups'
import { useUser } from '@/stores/user'
import ModalLayout from '@/components/ModalComponents/ModalLayout.vue'
import ContactCreateForm from '@/components/ContactsComponents/ContactCreateForm.vue'
import ContactEditForm from '@/components/ContactsComponents/ContactEditForm.vue'
import ContactDeleteConformation from '@/components/ContactsComponents/ContactDeleteConformation.vue'
import type { contact } from '@/interfaces/contact'

const notificationStore = useNotification()

const userStore = useUser()

//filter composables
const companyComposable = useCompany()
const officeComposable = useOffice()
const divisionComposable = useDivision()
const departmentComposable = useDepartment()
const groupComposable = useGroup()

//composables to get the right filters
const companiesOfficesComposable = useCompaniesOffices()
const officesDivisionsComposable = useOfficesDivisions()
const divisionsDepartmentsComposable = useDivisionsDepartments()
const departmentsGroupsComposable = useDepartmentsGroups()

// contact composable items
const { error, contactsArray, fetchContactsData, allContactsCount, pageAmount } = useContact()

const isCard = ref(true)

const openDropdown = ref(false)

const searchPrompt = ref<string | null>(null)

let companyFilter = ref<null | string>(null)
let officeFilter = ref<null | string>(null)
let divisionFilter = ref<null | string>(null)
let departmentFilter = ref<null | string>(null)
let groupFilter = ref<null | string>(null)

const optionsArray = [
  { value: 5, opt: '5' },
  { value: 10, opt: '10' },
  { value: 25, opt: '25' },
  { value: 50, opt: '50' },
  { value: 100, opt: '100' },
  { value: 99999, opt: 'Visi' },
]

const perPage = ref(25)
const currentPage = ref(1)

const component = shallowRef<null | Component>(null)
const showModal = ref(false)

const editDeleteContact = ref<null | contact>(null)

onBeforeMount(() => {
  initializeData()
})

async function initializeData(): Promise<void> {
  await fetchContactsData(
    buildQuery(
      1,
      perPage.value,
      searchPrompt.value,
      companyFilter.value,
      officeFilter.value,
      divisionFilter.value,
      departmentFilter.value,
      groupFilter.value,
    ),
  )
  await companyComposable.fetchCompaniesData('collections/companies/records')
}

function buildQuery(
  pageNum: number,
  perPage: number,
  search: string | null,
  filterCompany: string | null,
  filterOffice: string | null,
  filterDivision: string | null,
  filterDepartment: string | null,
  filterGroup: string | null,
): string {
  let URL = `collections/employees/records?expand=office_id&page=${pageNum}&perPage=${perPage}`
  let filterURL = '&filter=('
  let filterNeeded = false
  if (search) {
    filterURL += `(name~'${search}' || surname~'${search}' || email~'${search}' || phone_number~'${search}' || position~'${search}')`
    filterNeeded = true
  }
  if (filterCompany) {
    filterURL += addAndFilterOption(`company_id='${filterCompany}'`, filterNeeded)
    filterNeeded = true
  }
  if (filterOffice) {
    filterURL += addAndFilterOption(`office_id='${filterOffice}'`, filterNeeded)
    filterNeeded = true
  }
  if (filterDivision) {
    filterURL += addAndFilterOption(`division_id='${filterDivision}'`, filterNeeded)
    filterNeeded = true
  }
  if (filterDepartment) {
    filterURL += addAndFilterOption(`department_id='${filterDepartment}'`, filterNeeded)
    filterNeeded = true
  }
  if (filterGroup) {
    filterURL += addAndFilterOption(`group_id='${filterGroup}'`, filterNeeded)
    filterNeeded = true
  }
  filterURL += ')'

  if (filterNeeded) {
    return URL + filterURL
  } else {
    return URL
  }
}

function addAndFilterOption(filterOption: string, filterNeeded: boolean): string {
  if (filterNeeded) {
    return '%26%26' + filterOption
  } else {
    return filterOption
  }
}

function switchView(): void {
  isCard.value = !isCard.value
}
//--------------------------------------------------------------------------------------------------------
// PAGINATION FUNCTIONS
//--------------------------------------------------------------------------------------------------------
async function changePage(pageNum: number): Promise<void> {
  currentPage.value = pageNum
  await fetchContactsData(
    buildQuery(
      pageNum,
      perPage.value,
      searchPrompt.value,
      companyFilter.value,
      officeFilter.value,
      divisionFilter.value,
      departmentFilter.value,
      groupFilter.value,
    ),
  )
}

async function changeItemsPerPage(newPerPage: number): Promise<void> {
  if (newPerPage != perPage.value && newPerPage != 0) {
    perPage.value = newPerPage
    await fetchContactsData(
      buildQuery(
        1,
        perPage.value,
        searchPrompt.value,
        companyFilter.value,
        officeFilter.value,
        divisionFilter.value,
        departmentFilter.value,
        groupFilter.value,
      ),
    )
    openDropdown.value = false
  }
}
//-------------------------------------------------------------------------------------------------
// SEARCH FUNCTIONS
//-------------------------------------------------------------------------------------------------

async function handleSearch(search: string): Promise<void> {
  if (search == '') {
    searchPrompt.value = null
  } else {
    searchPrompt.value = search
  }

  await fetchContactsData(
    buildQuery(
      1,
      perPage.value,
      searchPrompt.value,
      companyFilter.value,
      officeFilter.value,
      divisionFilter.value,
      departmentFilter.value,
      groupFilter.value,
    ),
  )
}

//------------------------------------------------------------------------------------------------------
// FILTER FUNCTIONS
//------------------------------------------------------------------------------------------------------

// functions for filter query building
function biuldOfficeFilterQuery(baseURL: string, array: companies_offices[]): string {
  let url = baseURL + '?filter=('
  let filterNeeded = false
  for (let i = 0; i < array.length; i++) {
    url += addOrFilterOption(`id='${array[i].office_id}'`, filterNeeded)
    filterNeeded = true
  }
  url += ')'
  return url
}

function buildDivisionFilterQuery(baseURL: string, array: offices_divisions[]): string {
  let url = baseURL + '?filter=('
  let filterNeeded = false
  for (let i = 0; i < array.length; i++) {
    url += addOrFilterOption(`id='${array[i].division_id}'`, filterNeeded)
    filterNeeded = true
  }
  url += ')'
  return url
}

function buildDepartmentFilterQuery(baseURL: string, array: divisions_departments[]): string {
  let url = baseURL + '?filter=('
  let filterNeeded = false
  for (let i = 0; i < array.length; i++) {
    url += addOrFilterOption(`id='${array[i].department_id}'`, filterNeeded)
    filterNeeded = true
  }
  url += ')'
  return url
}

function buildGroupFilterQuery(baseURL: string, array: departments_groups[]): string {
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

//functions for handling filtering
async function handleCompany(companyId: string): Promise<void> {
  companyFilter.value = companyId

  officeFilter.value = null
  divisionFilter.value = null
  departmentFilter.value = null
  groupFilter.value = null

  officeComposable.deleteItems()
  divisionComposable.deleteItems()
  departmentComposable.deleteItems()
  groupComposable.deleteItems()

  await fetchContactsData(
    buildQuery(
      1,
      perPage.value,
      searchPrompt.value,
      companyFilter.value,
      officeFilter.value,
      divisionFilter.value,
      departmentFilter.value,
      groupFilter.value,
    ),
  )
  await companiesOfficesComposable.fetchCompaniesOfficesData(
    `collections/companies_offices/records?filter=(company_id='${companyId}')`,
  )
  if (
    companiesOfficesComposable.companies_offices_Array.value &&
    companiesOfficesComposable.companies_offices_Array.value.length != 0
  ) {
    await officeComposable.fetchOfficesData(
      biuldOfficeFilterQuery(
        'collections/offices/records',
        companiesOfficesComposable.companies_offices_Array.value,
      ),
    )
  }
}

async function handleOffice(officeId: string): Promise<void> {
  officeFilter.value = officeId

  divisionFilter.value = null
  departmentFilter.value = null
  groupFilter.value = null

  divisionComposable.deleteItems()
  departmentComposable.deleteItems()
  groupComposable.deleteItems()

  await fetchContactsData(
    buildQuery(
      1,
      perPage.value,
      searchPrompt.value,
      companyFilter.value,
      officeFilter.value,
      divisionFilter.value,
      departmentFilter.value,
      groupFilter.value,
    ),
  )
  await officesDivisionsComposable.fetchOfficesDivisionsData(
    `collections/offices_divisions/records?filter=(office_id='${officeId}')`,
  )
  if (
    officesDivisionsComposable.offices_divisions_array.value &&
    officesDivisionsComposable.offices_divisions_array.value.length != 0
  ) {
    await divisionComposable.fetchDivisionsData(
      buildDivisionFilterQuery(
        'collections/divisions/records',
        officesDivisionsComposable.offices_divisions_array.value,
      ),
    )
  }
}

async function handleDivision(divisionId: string): Promise<void> {
  divisionFilter.value = divisionId

  departmentFilter.value = null
  groupFilter.value = null

  departmentComposable.deleteItems()
  groupComposable.deleteItems()

  await fetchContactsData(
    buildQuery(
      1,
      perPage.value,
      searchPrompt.value,
      companyFilter.value,
      officeFilter.value,
      divisionFilter.value,
      departmentFilter.value,
      groupFilter.value,
    ),
  )
  await divisionsDepartmentsComposable.fetchDivisionsDepartmentsData(
    `collections/divisions_departments/records?filter=(division_id='${divisionId}')`,
  )
  if (
    divisionsDepartmentsComposable.divisions_departments_array.value &&
    divisionsDepartmentsComposable.divisions_departments_array.value.length != 0
  ) {
    await departmentComposable.fetchDepartmentsData(
      buildDepartmentFilterQuery(
        'collections/departments/records',
        divisionsDepartmentsComposable.divisions_departments_array.value,
      ),
    )
  }
}

async function handleDepartment(departmentId: string): Promise<void> {
  departmentFilter.value = departmentId

  groupFilter.value = null

  groupComposable.deleteItems()

  await fetchContactsData(
    buildQuery(
      1,
      perPage.value,
      searchPrompt.value,
      companyFilter.value,
      officeFilter.value,
      divisionFilter.value,
      departmentFilter.value,
      groupFilter.value,
    ),
  )
  await departmentsGroupsComposable.fetchDepartmentsGroupsData(
    `collections/departments_groups/records?filter=(department_id='${departmentId}')`,
  )
  if (
    departmentsGroupsComposable.departments_groups_array.value &&
    departmentsGroupsComposable.departments_groups_array.value.length
  ) {
    groupComposable.fetchGroupsData(
      buildGroupFilterQuery(
        'collections/groups/records',
        departmentsGroupsComposable.departments_groups_array.value,
      ),
    )
  }
}

async function handleGroup(groupId: string): Promise<void> {
  groupFilter.value = groupId
  await fetchContactsData(
    buildQuery(
      1,
      perPage.value,
      searchPrompt.value,
      companyFilter.value,
      officeFilter.value,
      divisionFilter.value,
      departmentFilter.value,
      groupFilter.value,
    ),
  )
}
//-------------------------------------------------------------------------------------------------------
// BUTTON FUNCTIONS
//-------------------------------------------------------------------------------------------------------

function openCreateModal(): void {
  component.value = ContactCreateForm
  showModal.value = true
}

function openEditModal(contact: contact): void {
  editDeleteContact.value = contact
  component.value = ContactEditForm
  showModal.value = true
}

function openDeleteModal(contact: contact): void {
  editDeleteContact.value = contact
  component.value = ContactDeleteConformation
  showModal.value = true
}

//-------------------------------------------------------------------------------------------------------
// AFTER MODAL ACTIONS FUNCTION
//-------------------------------------------------------------------------------------------------------
function update(): void {
  showModal.value = false
  fetchContactsData(
    buildQuery(
      currentPage.value,
      perPage.value,
      searchPrompt.value,
      companyFilter.value,
      officeFilter.value,
      divisionFilter.value,
      departmentFilter.value,
      groupFilter.value,
    ),
  )
}

//--------------------------------------------------------------------------------------------------------
// WATCH FUNCTIONS
//--------------------------------------------------------------------------------------------------------
watch(error, () => {
  notificationStore.addNotification({ type: 'fail', message: error.value })
})
watch(contactsArray, () => {
  if (contactsArray.value?.length == 0 && searchPrompt.value) {
    notificationStore.addNotification({
      type: 'fail',
      message: "Nėra rezultatų su paieška '" + searchPrompt.value + "'",
    })
  }
})
</script>

<template>
  <div>
    <ModalLayout @close="showModal = false" v-if="showModal">
      <template #header>
        <p
          v-if="component == ContactDeleteConformation"
          class="text-[18px] pb-[15px] pt-[15px] pl-[15px]"
        >
          Ar tikrai norite ištrinti kontaktą?
        </p>
      </template>
      <component
        :is="component"
        @close="showModal = false"
        @update="update"
        :contact="editDeleteContact"
      />
    </ModalLayout>
    <p class="text-[50px] font-[Roboto]">Kontaktų sistema</p>
    <div class="flex">
      <Searchbar @search-changed="handleSearch" />
      <div>
        <button class="button" @click="openDropdown = !openDropdown">
          <img src="@/assets/images/itemAmountIcon.png" class="w-[36px] h-[36px]" />
        </button>
        <div v-if="openDropdown" class="dropdown">
          <p v-for="option in optionsArray" @click="changeItemsPerPage(option.value)">
            {{ option.opt }}
          </p>
        </div>
      </div>
      <button class="button" @click="switchView">
        <img v-if="isCard" src="@/assets/images/tableIcon.png" class="w-[33px] h-[33px]" />
        <img v-else src="@/assets/images/cardIcon.png" class="w-[30px] h-[30px]" />
      </button>
      <button
        class="button"
        v-if="userStore.userData?.record.expand?.permissions_id?.edit_employees"
        @click="openCreateModal"
      >
        <img src="@/assets/images/addNewIcon.png" class="w-[33px] h-[33px]" />
      </button>
    </div>
    <p>
      Iš viso rasta: <span class="bold">{{ allContactsCount }} kontaktų</span>
    </p>
    <Filter
      :companyArray="companyComposable.companyArray.value"
      :officeArray="officeComposable.officeArray.value"
      :divisionArray="divisionComposable.divisionArray.value"
      :departmentArray="departmentComposable.departmentArray.value"
      :groupArray="groupComposable.groupArray.value"
      @choose-company="handleCompany"
      @choose-office="handleOffice"
      @choose-division="handleDivision"
      @choose-department="handleDepartment"
      @choose-group="handleGroup"
    />
    <ContactList
      :constact-array="contactsArray"
      :is-card="isCard"
      @edit="openEditModal"
      @delete="openDeleteModal"
    />
    <Pagination
      :page-amount="pageAmount"
      :search="searchPrompt"
      :company-filter="companyFilter"
      :office-filter="officeFilter"
      :division-filter="divisionFilter"
      :department-filter="departmentFilter"
      :group-filter="groupFilter"
      :per-page="perPage"
      :tab="null"
      @change-page="changePage"
    />
  </div>
</template>
