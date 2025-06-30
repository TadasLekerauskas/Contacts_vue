<script setup lang="ts">
const emits = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div class="modal-container" @click="emits('close')">
    <div class="modal" @click="(e) => e.stopPropagation()">
      <slot name="header">
        <div class="modal-header">
          <button class="button oval" @click="emits('close')">
            <img src="@/assets/images/closeIcon.png" class="w-[30px] h-[30px]" />
          </button>
        </div>
      </slot>
      <div class="modal-body">
        <slot>
          <p class="block w-full text-center">This is modal body</p>
        </slot>
      </div>
    </div>
  </div>
</template>
