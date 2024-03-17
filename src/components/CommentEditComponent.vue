<template>
  <Transition
    enter-active-class="transition duration-500"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-500"
    leave-to-class="opacity-0"
    leave-from-class="opacity-100"
    >
    <div v-if="isEditing" class="flex items-center justify-between gap-4 px-3 py-2 rounded-xl bg-gray-4">
      <input v-model="modifiedContent" type="text" class="w-full px-4 py-2 bg-white border-0 rounded-full focus:ring-2 focus:ring-primary focus:bg-white placeholder:text-gray-3" :placeholder="placeholder">
      <button type="button" class="px-6 py-2 ml-auto text-white transition border-2 rounded-full bg-gray-1 whitespace-nowrap"
      :class="modifiedContent?.length === 0 ? 'border-0 hover:bg-gray-1 opacity-80 cursor-auto' : 'hover:border-primary-dark hover:bg-primary-dark'" @click="handleSubmit">{{ modifiedContent && modifiedContent.length > 0 ? '送出' : '關閉'}}</button>
    </div>
    <div v-else-if="!isEditing && isReply" class="flex justify-end">
      <button @click="startEditing" type="button" class="px-4 py-2 text-left bg-white border-2 rounded-3xl">
        <i class="mr-3 bi bi-arrow-90deg-left" />
        回覆
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { defineEmits, defineProps, ref } from 'vue';

const props = defineProps({
  isReply: {
    type: Boolean,
    default: false,
  },
  originalContent: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '請輸入評論...',
  },
});

const emit = defineEmits(['submitted']);

const isEditing = ref(false);
const modifiedContent = ref(props.originalContent);

function startEditing() {
  isEditing.value = true;
}

function handleSubmit() {
  if (modifiedContent.value.trim().length === 0) {
    isEditing.value = false;
    modifiedContent.value = props.originalContent;
  } else {
    emit('submitted', modifiedContent.value);
    isEditing.value = false;
    modifiedContent.value = props.originalContent;
  }
}
</script>
