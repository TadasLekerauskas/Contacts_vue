<script setup lang="ts">
import ForgotPasswordForm from '@/components/LoginComponents/ForgotPasswordForm.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack(): void {
  router.back()
}
</script>

<template>
  <div class="blueBackground">
    <div class="backContainer">
      <button class="circle bg-white" @click="goBack">
        <img class="w-[24px] h-[24px]" src="@/assets/images/goBackIcon.png" />
      </button>
    </div>
    <ForgotPasswordForm />
  </div>
</template>
