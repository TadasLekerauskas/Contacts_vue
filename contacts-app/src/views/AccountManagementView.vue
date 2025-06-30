<script setup lang="ts">
import { onBeforeMount, ref, shallowRef, watch, type Component } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@/stores/user'
import AccountList from '@/components/AccountManagementComponents/AccountList.vue'
import { useAccount } from '@/composables/account'
import { useNotification } from '@/stores/notification'
import ModalLayout from '@/components/ModalComponents/ModalLayout.vue'
import AccountCreateForm from '@/components/AccountManagementComponents/AccountCreateForm.vue'
import AccountTeamporaryPasswordForm from '@/components/AccountManagementComponents/AccountTeamporaryPasswordForm.vue'
import type { account } from '@/interfaces/account'
import Pagination from '@/components/PaginationComponents/Pagination.vue'
import AccountEditForm from '@/components/AccountManagementComponents/AccountEditForm.vue'
import AccountDeleteConfirmation from '@/components/AccountManagementComponents/AccountDeleteConfirmation.vue'
import AccountPermissionsEditForm from '@/components/AccountManagementComponents/AccountPermissionsEditForm.vue'

const notificationStore = useNotification()

const router = useRouter()

const userStore = useUser()

const accountComposable = useAccount()

const perPage = 25
const currentPage = ref(1)

const showModal = ref(false)
const component = shallowRef<null | Component>(null)
const propPass = ref('')
const propAccount = ref<null | account>(null)

onBeforeMount(() => {
  //@ts-ignore
  accountComposable.fetchAccountsData(buildURL(1, perPage), userStore.userData?.token)
})

function buildURL(pageNum: number, perPage: number): string {
  return `collections/users/records?expand=permissions_id&page=${pageNum}&perPage=${perPage}`
}

function handleChangePage(nextPage: number): void {
  currentPage.value = nextPage
  accountComposable.fetchAccountsData(
    buildURL(currentPage.value, perPage), //@ts-ignore
    userStore.userData?.token,
  )
}

function openCreateModal(): void {
  component.value = AccountCreateForm
  showModal.value = true
}

function openEditModal(account: account): void {
  component.value = AccountEditForm
  propAccount.value = account
  showModal.value = true
}

function openDeleteModal(account: account): void {
  component.value = AccountDeleteConfirmation
  propAccount.value = account
  showModal.value = true
}

function openPermissionModal(account: account): void {
  component.value = AccountPermissionsEditForm
  propAccount.value = account
  showModal.value = true
}

async function update(): Promise<void> {
  //@ts-ignore
  await accountComposable.fetchAccountsData(buildURL(1, perPage), userStore.userData?.token)
  showModal.value = false
}

async function createUpdate(password: string): Promise<void> {
  //@ts-ignore
  await accountComposable.fetchAccountsData(buildURL(1, perPage), userStore.userData?.token)
  propPass.value = password
  component.value = AccountTeamporaryPasswordForm
}

watch(userStore, () => {
  if (
    userStore.userData == null ||
    !userStore.userData?.record.expand?.permissions_id?.read_permissions
  ) {
    router.push('/')
  }
})
watch(accountComposable.error, () => {
  notificationStore.addNotification({ type: 'fail', message: accountComposable.error.value })
})
</script>

<template>
  <div>
    <ModalLayout v-if="showModal" @close="showModal = false">
      <template #header>
        <p
          v-if="component == AccountDeleteConfirmation"
          class="text-[18px] pb-[15px] pt-[25px] pl-[25px]"
        >
          Ar tikrai norite ištrinti paskyrą?
        </p>
      </template>
      <component
        :is="component"
        @close="showModal = false"
        @update="update"
        @create="createUpdate"
        :password="propPass"
        :account="propAccount"
      />
    </ModalLayout>
    <p class="text-[50px] font-[Roboto]">Admin paskyros</p>
    <div class="flex pb-[30px]">
      <button
        class="circle blue"
        v-if="userStore.userData?.record.expand.permissions_id.edit_permissions"
        @click="openCreateModal"
      >
        <img src="@/assets/images/addNewIcon.png" class="h-[30px] w-[30px]" />
      </button>
      <p class="text-[35px] font-[Roboto] pl-[50px]">Sukurti naują admin paskyrą</p>
    </div>
    <div>
      <AccountList
        :account-array="accountComposable.accountArray.value"
        @edit="openEditModal"
        @delete="openDeleteModal"
        @edit-permissions="openPermissionModal"
      />
      <Pagination
        :company-filter="null"
        :department-filter="null"
        :division-filter="null"
        :group-filter="null"
        :office-filter="null"
        :page-amount="accountComposable.pageAmount.value"
        :per-page="perPage"
        :search="null"
        :tab="null"
        @change-page="handleChangePage"
      />
    </div>
  </div>
</template>
