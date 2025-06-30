<script setup lang="ts">
import { computed, onBeforeUpdate, ref, watch } from 'vue'

const props = defineProps<{
  pageAmount: number
  search: string | null
  companyFilter: string | null
  officeFilter: string | null
  divisionFilter: string | null
  departmentFilter: string | null
  groupFilter: string | null
  perPage: number
  tab: string | null
}>()

const emits = defineEmits<{
  (e: 'change-page', pageNum: number): void
}>()

const currentPage = ref(1)

const pages = computed(() => {
  if (props.pageAmount != 0) {
    return props.pageAmount
  }
  return 1
})

function goBack(): void {
  if (currentPage.value > 1) {
    currentPage.value = currentPage.value - 1
    emits('change-page', currentPage.value)
  }
}

function goForward(): void {
  if (currentPage.value < props.pageAmount) {
    currentPage.value = currentPage.value + 1
    emits('change-page', currentPage.value)
  }
}

onBeforeUpdate(() => {
  if (currentPage.value > props.pageAmount && props.pageAmount != 0) {
    currentPage.value = props.pageAmount
    emits('change-page', currentPage.value)
  }
})

watch(
  () => [
    props.search,
    props.companyFilter,
    props.officeFilter,
    props.divisionFilter,
    props.departmentFilter,
    props.groupFilter,
    props.perPage,
    props.tab,
  ],
  () => {
    currentPage.value = 1
  },
)
</script>

<template>
  <div class="flex items-center justify-center pt-[10px]">
    <button class="pagination" @click="goBack">
      <img src="@/assets/images/paginationPrevious.png" class="w-[24px] h-[24px] float-left" />
      <p class="float-right">PRAEITAS PUSLAPIS</p>
    </button>
    <p class="text-black px-[10px] text-[20px]">{{ currentPage + '/' + pages }}</p>
    <button class="pagination" @click="goForward">
      <p class="float-left">KITAS PUSLAPIS</p>
      <img src="@/assets/images/paginationNext.png" class="w-[24px] h-[24px] float-right" />
    </button>
  </div>
</template>
