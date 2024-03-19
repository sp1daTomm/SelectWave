<script setup>
import {
  defineEmits, defineProps, onBeforeMount, onMounted, ref, watch,
} from 'vue';
import { turnDateTime } from '@/utils';

const showDropDown = ref(false);

const emit = defineEmits(['editReply', 'handleDeleteComment', 'state']);

const props = defineProps({
  memberId: {
    type: String,
    default: '',
  },
  data: {
    type: Object,
    default: () => ({}),
  },
  showReplyMenu: {
    type: String,
    default: '',
  },
});
watch(() => props.showReplyMenu, (newVal) => {
  showDropDown.value = newVal === props.data.id;
});

function clickOutsideDropdown(event) {
  if (event.target.dataset.dropdown === 'replyMenu') {
    return;
  }
  if (!event.target.closest('[data-dropdown=replyMenu]')) {
    showDropDown.value = '';
  }
}

onMounted(() => {
  window.addEventListener('click', clickOutsideDropdown);
});

onBeforeMount(() => {
  window.removeEventListener('click', clickOutsideDropdown);
});
</script>

<template>
  <div class="flex items-start gap-1 border-b-gray-4">
    <div
      :style="{ backgroundImage: 'url(' + data.author.avatar + ')' }"
      class="w-8 h-8 bg-cover rounded-full shrink"
    ></div>
    <div class="transition duration-300 grow">
      <div class="flex items-center justify-between mb-3">
        <p class="pl-3 pr-4 font-medium">{{ data.author.name }}</p>
        <div class="relative flex items-center gap-4">
          <p class="text-gray-2">{{ turnDateTime(data.createdTime) }}</p>
          <button
            class="grid w-8 h-8 transition duration-300 rounded-full place-content-center hover:bg-gray-2/50 text-gray-2 hover:text-gray-1"
            type="button"
            data-dropdown="replyMenu"
            v-if="memberId === data.author.id"
            @click="showDropDown = !showDropDown"
          >
            <i class="text-2xl bi bi-three-dots-vertical" />
          </button>
          <div
            v-if="memberId === data.author.id"
            data-dropdown="replyMenu"
            :class="`absolute z-10 ${
              showDropDown ? 'block' : 'hidden'
  } font-normal bg-white divide-y shadow-lg right-0 top-full
            rounded-2xl w-44 animate-fade-down animate-once animate-ease-in-out`"
          >
            <ul class="py-3 text-sm text-gray-700">
              <li
                class="block py-2 px-7 hover:text-primary"
                @click="
                  emit('editReply');
                  emit('state', {
                    target: data.id,
                    type: 'update'
                  });
                "
              >
                編輯
              </li>
              <li
                class="block py-2 px-7 hover:text-primary"
                @click="emit('handleDeleteComment')"
              >
                刪除
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p class="py-2 pl-3 leading-normal md:pb-3">
        {{ data.content }}
        <span class="text-xs text-gray-2">{{
          data.edited ? "( 已修改 )" : ""
        }}</span>
      </p>
      <slot />
    </div>
  </div>
</template>
