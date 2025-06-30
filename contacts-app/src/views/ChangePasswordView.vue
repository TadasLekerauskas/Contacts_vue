<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { useUser } from '@/stores/user'
import ChangePasswordForm from '@/components/LoginComponents/ChangePasswordForm.vue'
import LoggedInChangePasswordForm from '@/components/LoginComponents/LoggedInChangePasswordForm.vue'

const route = useRoute()

const router = useRouter()

const userStore = useUser()

const token = route.params.token as string

function goBack(): void {
  router.push('/')
}
</script>

<template>
  <div class="blueBackground">
    <div class="backContainer">
      <button class="circle bg-white" @click="goBack">
        <img class="w-[24px] h-[24px]" src="@/assets/images/goBackIcon.png" />
      </button>
    </div>
    <ChangePasswordForm :token="token" v-if="userStore.userData == null" />
    <LoggedInChangePasswordForm v-else />
  </div>
</template>
