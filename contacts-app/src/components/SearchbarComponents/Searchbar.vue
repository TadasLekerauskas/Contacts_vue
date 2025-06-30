<script setup lang="ts">
import { ref } from 'vue';

const emits = defineEmits<{
    (e: 'searchChanged', searchPrompt: string): void
}>()

const searchPrompt = ref("")
let debounce: number;

function handleInput(event: Event): void {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
        //@ts-ignore
        searchPrompt.value = event.target.value
        emits('searchChanged', searchPrompt.value);
    }, 1000)
}
</script>

<template>
  <input type="text" placeholder="Ieškoti kontakto ..." class="search" :value="searchPrompt" @input="handleInput"></input>
</template>
