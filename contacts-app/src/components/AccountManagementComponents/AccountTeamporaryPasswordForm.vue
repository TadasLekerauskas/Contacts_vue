<script setup lang="ts">
const props = defineProps<{
  password: string
}>()
</script>

<template>
  <div>
    <p class="text-[22px] pl-[50px] pb-[30px]">Laikinas slaptažodis:</p>
  </div>
  <div class="w-full text-gray-500 pl-[50px] pb-[100px]">
    <p>Laikinas paskyros slaptažodis: {{ props.password }}</p>
  </div>
</template>
