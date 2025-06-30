<script setup lang="ts">
import type { selectOption } from '@/interfaces/selectOption'
import { onBeforeMount, ref, watch } from 'vue'

const props = defineProps<{
  options: selectOption[] | null
  selected: string[] | null
}>()

const emits = defineEmits<{
  (e: 'change', selectedOptions: string[]): void
}>()

const selectedOptions = ref([] as string[])
let itemCount = 0

onBeforeMount(() => {
  if (props.selected != null) {
    selectedOptions.value = props.selected
    itemCount = props.selected.length
  }
})

function handleOption(optionId: string): void {
  if (exists(optionId)) {
    const index = selectedOptions.value.findIndex((item) => {
      return item == optionId
    })
    selectedOptions.value.splice(index, 1)
    itemCount--
  } else {
    selectedOptions.value[itemCount++] = optionId
  }
  emits('change', selectedOptions.value)
}

function exists(optionId: string): boolean {
  if (
    selectedOptions.value.find((item) => {
      return item == optionId
    })
  ) {
    return true
  }
  return false
}

watch(
  () => props.selected,
  () => {
    if (props.selected != null) {
      selectedOptions.value = props.selected
      itemCount = props.selected.length
    }
  },
)
</script>

<template>
  <div class="multipleSelect">
    <div
      class="selectOption"
      :class="{ selected: exists(option.id) }"
      v-for="option in props.options"
      @click="handleOption(option.id)"
      v-if="props.options != null"
    >
      {{ option.name }}
    </div>
    <div class="selectOption" v-else>Pasirinkimų nėra!</div>
  </div>
</template>
