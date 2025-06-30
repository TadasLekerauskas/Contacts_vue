<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navigation from './components/NavigationComponents/Navigation.vue'
import NotificationContainer from './components/NotificationComponents/NotificationContainer.vue'
</script>

<template>
  <Navigation />
  <NotificationContainer />
  <div class="pt-[90px] pl-[40px] text-black pr-[50px]">
    <RouterView />
  </div>
</template>
