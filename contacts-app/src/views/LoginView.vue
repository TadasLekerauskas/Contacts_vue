<script setup lang="ts">
import { useRouter } from 'vue-router'
import LoginForm from '@/components/LoginComponents/LoginForm.vue'

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
    <LoginForm />
  </div>
</template>
