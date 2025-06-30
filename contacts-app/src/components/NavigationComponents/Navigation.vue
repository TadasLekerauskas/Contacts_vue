<script setup lang="ts">
import { ref } from 'vue'
import { useUser } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUser()

let photoURL = ''

if (userStore.userData) {
  photoURL =
    //@ts-ignore
    BASE_URL +
    'files/users/' +
    userStore.userData.record.id +
    '/' +
    userStore.userData.record.avatar
}
const router = useRouter()

const show = ref(false)
function showBox(): void {
  show.value = true
}
function hideBox(): void {
  show.value = false
}

function goToPage(): void {
  router.push(`/changePassword/${userStore.userData?.token}`)
}
</script>

<template>
  <div class="fixed top-0 left-0 bg-[#1f3f77] h-[118px] w-full">
    <nav class="flex items-center h-full w-full pl-[50px]">
      <router-link v-if="userStore.userData != null" to="/" class="navItem">Kontaktai</router-link>
      <router-link v-if="userStore.userData != null" to="/company" class="navItem"
        >Įmonės</router-link
      >
      <router-link v-if="userStore.userData != null" to="/structure" class="navItem"
        >Struktūra</router-link
      >
      <router-link
        v-if="
          userStore.userData?.record.expand &&
          (userStore.userData?.record.expand.permissions_id.edit_permissions ||
            userStore.userData?.record.expand.permissions_id.delete_permissions)
        "
        to="/accounts"
        class="navItem"
        >Paskyros</router-link
      >
      <div class="flex items-center justify-end w-full pr-[50px]">
        <router-link v-if="userStore.userData == null" to="/login" class="navItem"
          >Prisijungti</router-link
        >
        <img
          v-else-if="userStore.userData.record.avatar != ''"
          :src="photoURL"
          class="w-[50px] h-[50px]"
          @mouseover="showBox"
          @mouseout="hideBox"
        />
        <img
          v-else
          src="@/assets/images/userIcon.png"
          class="w-[50px] h-[50px]"
          @mouseover="showBox"
          @mouseout="hideBox"
        />
      </div>
    </nav>
    <div
      v-show="show"
      class="fixed right-0 top-[84px] pt-[39px]"
      @mouseover="showBox"
      @mouseout="hideBox"
    >
      <div
        class="box-border w-[190px] h-max z-10 bg-white shadow-2xl rounded-xs p-[10px] text-black"
      >
        <p class="hover:bg-blue-300" @click="goToPage">Pakeisti slaptažodį</p>
        <p class="hover:bg-blue-300" @click="userStore.logout()">Atsijungti</p>
      </div>
    </div>
  </div>
</template>
