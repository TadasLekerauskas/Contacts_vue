<script setup lang="ts">
import CompanyList from '@/components/CompanyManagementComponents/CompanyList.vue'
import { useCompany } from '@/composables/company'
import { onBeforeMount, ref, shallowRef, watch, type Component } from 'vue'
import Pagination from '@/components/PaginationComponents/Pagination.vue'
import { useNotification } from '@/stores/notification'
import { useUser } from '@/stores/user'
import { useRouter } from 'vue-router'
import ModalLayout from '@/components/ModalComponents/ModalLayout.vue'
import CompanyCreateForm from '@/components/CompanyManagementComponents/CompanyCreateForm.vue'
import CompanyEditForm from '@/components/CompanyManagementComponents/CompanyEditForm.vue'
import CompanyDeleteConfirmation from '@/components/CompanyManagementComponents/CompanyDeleteConfirmation.vue'
import type { company } from '@/interfaces/company'

const notificationStore = useNotification()

const companyComposable = useCompany()

const userStore = useUser()

const router = useRouter()

const perPage = 25
const currentPage = ref(1)

const component = shallowRef<null | Component>(null)
const showModal = ref(false)

const editDeleteCompany = ref<null | company>(null)

function buildQuery(pageNum: number, perPage: number): string {
  let URL = `collections/companies/records?page=${pageNum}&perPage=${perPage}`
  return URL
}

onBeforeMount(() => {
  companyComposable.fetchCompaniesData(buildQuery(1, perPage))
})

function handleChangePage(nextPage: number) {
  currentPage.value = nextPage
  companyComposable.fetchCompaniesData(buildQuery(nextPage, perPage))
}

function openCreateModal(): void {
  showModal.value = true
  component.value = CompanyCreateForm
}

function openEditModal(company: company): void {
  editDeleteCompany.value = company
  showModal.value = true
  component.value = CompanyEditForm
}

function openDeleteModal(company: company): void {
  editDeleteCompany.value = company
  showModal.value = true
  component.value = CompanyDeleteConfirmation
}

function update(): void {
  showModal.value = false
  companyComposable.fetchCompaniesData(buildQuery(currentPage.value, perPage))
}

watch(companyComposable.error, () => {
  notificationStore.addNotification({ type: 'fail', message: companyComposable.error.value })
})
watch(userStore, () => {
  if (userStore.userData == null) {
    router.push('/')
  }
})
</script>

<template>
  <div>
    <ModalLayout v-if="showModal" @close="showModal = false">
      <template #header>
        <p
          v-if="component == CompanyDeleteConfirmation"
          class="text-[18px] pb-[15px] pt-[25px] pl-[25px]"
        >
          Ar tikrai norite ištrinti įmonę?
        </p>
      </template>
      <component
        :is="component"
        @update="update"
        @close="showModal = false"
        :company="editDeleteCompany"
      />
    </ModalLayout>
    <p class="text-[50px] font-[Roboto]">Įmonės</p>
    <div
      class="flex pb-[30px]"
      v-if="userStore.userData?.record.expand.permissions_id.edit_companies"
    >
      <button class="circle blue" @click="openCreateModal">
        <img src="@/assets/images/addNewIcon.png" class="h-[30px] w-[30px]" />
      </button>
      <p class="text-[35px] font-[Roboto] pl-[50px]">Pridėti naują įmonę</p>
    </div>
    <p class="pb-[50px]">
      Iš viso rasta: <span class="bold">{{ companyComposable.allCompanyCount }} įmonių</span>
    </p>
    <CompanyList
      :company-array="companyComposable.companyArray.value"
      @edit="openEditModal"
      @delete="openDeleteModal"
    />
    <Pagination
      :page-amount="companyComposable.pageAmount.value"
      :per-page="perPage"
      :company-filter="null"
      :department-filter="null"
      :division-filter="null"
      :group-filter="null"
      :office-filter="null"
      :search="null"
      :tab="null"
      @change-page="handleChangePage"
    />
  </div>
</template>
