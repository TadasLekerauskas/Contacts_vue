<script setup lang="ts">
import { computed, onBeforeMount, ref, shallowRef, watch, type Component } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@/stores/user'
import { useNotification } from '@/stores/notification'
import { useOffice } from '@/composables/office'
import { useDivision } from '@/composables/division'
import { useDepartment } from '@/composables/department'
import { useGroup } from '@/composables/group'
import OfficeList from '@/components/StructureManagementComponents/OfficeComponents/OfficeList.vue'
import DivisionList from '@/components/StructureManagementComponents/DivisionComponents/DivisionList.vue'
import DepartmentList from '@/components/StructureManagementComponents/DepartmentComponents/DepartmentList.vue'
import GroupList from '@/components/StructureManagementComponents/GroupComponents/GroupList.vue'
import Pagination from '@/components/PaginationComponents/Pagination.vue'
import OfficeCreateForm from '@/components/StructureManagementComponents/OfficeComponents/OfficeCreateForm.vue'
import OfficeEditForm from '@/components/StructureManagementComponents/OfficeComponents/OfficeEditForm.vue'
import OfficeDeleteConfirmation from '@/components/StructureManagementComponents/OfficeComponents/OfficeDeleteConfirmation.vue'
import DivisionCreateForm from '@/components/StructureManagementComponents/DivisionComponents/DivisionCreateForm.vue'
import DivisionEditForm from '@/components/StructureManagementComponents/DivisionComponents/DivisionEditForm.vue'
import DivisionDeleteConfirmation from '@/components/StructureManagementComponents/DivisionComponents/DivisionDeleteConfirmation.vue'
import DepartmentCreateForm from '@/components/StructureManagementComponents/DepartmentComponents/DepartmentCreateForm.vue'
import DepartmentEditForm from '@/components/StructureManagementComponents/DepartmentComponents/DepartmentEditForm.vue'
import DepartmentDeleteConfirmation from '@/components/StructureManagementComponents/DepartmentComponents/DepartmentDeleteConfirmation.vue'
import GroupCreateForm from '@/components/StructureManagementComponents/GroupComponents/GroupCreateForm.vue'
import GroupEditForm from '@/components/StructureManagementComponents/GroupComponents/GroupEditForm.vue'
import GroupDeleteConfirmation from '@/components/StructureManagementComponents/GroupComponents/GroupDeleteConfirmation.vue'
import ModalLayout from '@/components/ModalComponents/ModalLayout.vue'
import type { office } from '@/interfaces/office'
import type { division } from '@/interfaces/division'
import type { department } from '@/interfaces/department'
import type { group } from '@/interfaces/group'

const router = useRouter()

const userStore = useUser()

const notificationStore = useNotification()

const perPage = 25
const currentPage = ref(1)

const officeComposable = useOffice()
const divisionComposable = useDivision()
const departmentComposable = useDepartment()
const groupComposable = useGroup()

const officeActive = ref(true)
const divisionActive = ref(false)
const departmentActive = ref(false)
const groupActive = ref(false)

const component = shallowRef<null | Component>(null)
const showModal = ref(false)
const itemProp = ref<null | office | division | department | group>(null)

const activeComponent = computed(() => {
  if (officeActive.value) {
    return { component: OfficeList, props: { officeArray: officeComposable.officeArray.value } }
  }
  if (divisionActive.value) {
    return {
      component: DivisionList,
      props: { divisionArray: divisionComposable.divisionArray.value },
    }
  }
  if (departmentActive.value) {
    return {
      component: DepartmentList,
      props: { departmentArray: departmentComposable.departmentArray.value },
    }
  }
  return { component: GroupList, props: { groupArray: groupComposable.groupArray.value } }
})

const currentStructure = computed(() => {
  if (officeActive.value) {
    return { pageAmount: officeComposable.pageAmount, name: 'office' }
  } else if (divisionActive.value) {
    return { pageAmount: divisionComposable.pageAmount, name: 'division' }
  } else if (departmentActive.value) {
    return { pageAmount: departmentComposable.pageAmount, name: 'department' }
  } else {
    return { pageAmount: groupComposable.pageAmount, name: 'group' }
  }
})

const dataError = computed(() => {
  if (officeComposable.error.value != '') {
    return true
  }
  if (divisionComposable.error.value != '') {
    return true
  }
  if (departmentComposable.error.value != '') {
    return true
  }
  if (groupComposable.error.value != '') {
    return true
  }
  return false
})

const deleteHeader = computed(() => {
  if (
    component.value == OfficeDeleteConfirmation ||
    component.value == DivisionDeleteConfirmation ||
    component.value == DepartmentDeleteConfirmation ||
    component.value == GroupDeleteConfirmation
  ) {
    return true
  }
  return false
})

const header = computed(() => {
  if (officeActive.value) {
    return 'ofisą'
  } else if (divisionActive.value) {
    return 'padalinį'
  } else if (departmentActive.value) {
    return 'skyrių'
  } else {
    return 'grupę'
  }
})

//---------------------------------------------------------------------------------
// QUERIES TO BUILD LISTS
//---------------------------------------------------------------------------------

function buildQuery(structureType: string, pageNum: number, perPage: number): string {
  let URL = `collections/${structureType}/records?page=${pageNum}&perPage=${perPage}`
  return URL
}

onBeforeMount(() => {
  officeComposable.fetchOfficesData(buildQuery('offices', 1, perPage))
})

function officeClick(): void {
  if (officeActive.value == false) {
    officeComposable.fetchOfficesData(buildQuery('offices', 1, perPage))

    officeActive.value = true
    divisionActive.value = false
    departmentActive.value = false
    groupActive.value = false
  }
}

function divisionClick(): void {
  if (divisionActive.value == false) {
    divisionComposable.fetchDivisionsData(buildQuery('divisions', 1, perPage))

    officeActive.value = false
    divisionActive.value = true
    departmentActive.value = false
    groupActive.value = false
  }
}

function departmentClick(): void {
  if (departmentActive.value == false) {
    departmentComposable.fetchDepartmentsData(buildQuery('departments', 1, perPage))

    officeActive.value = false
    divisionActive.value = false
    departmentActive.value = true
    groupActive.value = false
  }
}

function groupClick(): void {
  if (groupActive.value == false) {
    groupComposable.fetchGroupsData(buildQuery('groups', 1, perPage))

    officeActive.value = false
    divisionActive.value = false
    departmentActive.value = false
    groupActive.value = true
  }
}
//-----------------------------------------------------------------------------------------------
// PAGINATION
//-----------------------------------------------------------------------------------------------

function handleChangePage(nextPage: number): void {
  currentPage.value = nextPage
  if (officeActive.value) {
    officeComposable.fetchOfficesData(buildQuery('offices', nextPage, perPage))
  } else if (divisionActive.value) {
    divisionComposable.fetchDivisionsData(buildQuery('divisions', nextPage, perPage))
  } else if (departmentActive.value) {
    departmentComposable.fetchDepartmentsData(buildQuery('departments', nextPage, perPage))
  } else {
    groupComposable.fetchGroupsData(buildQuery('groups', nextPage, perPage))
  }
}

//-----------------------------------------------------------------------------------------------
// MODAL FUNCTIONS
//-----------------------------------------------------------------------------------------------
function closeModal(): void {
  showModal.value = false
  component.value = null
}

function updateData(): void {
  if (officeActive.value) {
    officeComposable.fetchOfficesData(buildQuery('offices', currentPage.value, perPage))
  } else if (divisionActive.value) {
    divisionComposable.fetchDivisionsData(buildQuery('divisions', currentPage.value, perPage))
  } else if (departmentActive.value) {
    departmentComposable.fetchDepartmentsData(buildQuery('departments', currentPage.value, perPage))
  } else {
    groupComposable.fetchGroupsData(buildQuery('groups', currentPage.value, perPage))
  }
  showModal.value = false
}

function openCreateStructureModal(): void {
  if (officeActive.value) {
    component.value = OfficeCreateForm
  } else if (divisionActive.value) {
    component.value = DivisionCreateForm
  } else if (departmentActive.value) {
    component.value = DepartmentCreateForm
  } else {
    component.value = GroupCreateForm
  }
  showModal.value = true
}

function openEditModal(item: office | division | department | group): void {
  if (officeActive.value) {
    component.value = OfficeEditForm
    itemProp.value = item as office
  } else if (divisionActive.value) {
    component.value = DivisionEditForm
    itemProp.value = item as division
  } else if (departmentActive.value) {
    component.value = DepartmentEditForm
    itemProp.value = item as department
  } else {
    component.value = GroupEditForm
    itemProp.value = item as group
  }
  showModal.value = true
}

function openDeleteModal(item: office | division | department | group): void {
  if (officeActive.value) {
    component.value = OfficeDeleteConfirmation
    itemProp.value = item as office
  } else if (divisionActive.value) {
    component.value = DivisionDeleteConfirmation
    itemProp.value = item as division
  } else if (departmentActive.value) {
    component.value = DepartmentDeleteConfirmation
    itemProp.value = item as department
  } else {
    component.value = GroupDeleteConfirmation
    itemProp.value = item as group
  }
  showModal.value = true
}

//-----------------------------------------------------------------------------------------------
// WATCH FUNCTIONS
//-----------------------------------------------------------------------------------------------

watch(officeComposable.error, () => {
  notificationStore.addNotification({ type: 'fail', message: officeComposable.error.value })
})
watch(divisionComposable.error, () => {
  notificationStore.addNotification({ type: 'fail', message: divisionComposable.error.value })
})
watch(departmentComposable.error, () => {
  notificationStore.addNotification({ type: 'fail', message: departmentComposable.error.value })
})
watch(groupComposable.error, () => {
  notificationStore.addNotification({ type: 'fail', message: groupComposable.error.value })
})
watch(userStore, () => {
  if (userStore.userData == null) {
    router.push('/')
  }
})
</script>

<template>
  <div>
    <ModalLayout @close="closeModal" v-if="showModal">
      <template #header>
        <p v-if="deleteHeader" class="text-[18px] pb-[15px] pt-[25px] pl-[25px]">
          Ar tikrai norite ištrinti {{ header }}?
        </p>
      </template>
      <component :is="component" @close="closeModal" @update="updateData" :item="itemProp" />
    </ModalLayout>
    <p class="text-[50px] font-[Roboto]">Struktūra</p>
    <div
      class="flex pb-[30px]"
      v-if="userStore.userData?.record.expand.permissions_id.edit_structure"
    >
      <button class="circle blue" @click="openCreateStructureModal">
        <img src="@/assets/images/addNewIcon.png" class="h-[30px] w-[30px]" />
      </button>
      <p class="text-[35px] font-[Roboto] pl-[50px]">Pridėti naują struktūrą</p>
    </div>
    <div class="flex">
      <button class="tab" :class="{ active: officeActive }" @click="officeClick">Ofisai</button>
      <button class="tab" :class="{ active: divisionActive }" @click="divisionClick">
        Padaliniai
      </button>
      <button class="tab" :class="{ active: departmentActive }" @click="departmentClick">
        Skyriai
      </button>
      <button class="tab" :class="{ active: groupActive }" @click="groupClick">Grupės</button>
    </div>
    <div>
      <component
        :is="activeComponent.component"
        v-bind="activeComponent.props"
        @edit="openEditModal"
        @delete="openDeleteModal"
      />
      <Pagination
        :page-amount="currentStructure.pageAmount.value"
        :per-page="perPage"
        :company-filter="null"
        :department-filter="null"
        :division-filter="null"
        :group-filter="null"
        :office-filter="null"
        :search="null"
        :tab="currentStructure.name"
        @change-page="handleChangePage"
      />
    </div>
  </div>
</template>
