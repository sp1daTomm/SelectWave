<script setup>
import {
  defineEmits,
  defineProps,
  onBeforeMount,
  onMounted,
  ref,
  watch,
} from 'vue';
import emojiData from 'emoji-mart-vue-fast/data/all.json';
import { EmojiIndex, Picker } from 'emoji-mart-vue-fast/src';
import EmojiPicker from '@/components/EmojiPicker.vue';
import { turnDateTime } from '@/utils';

const emojiIndex = ref(new EmojiIndex(emojiData));

const showDropDown = ref(false);

const showEmojiSelect = ref('');
const selectEmoji = ref('');

const showEmoji = (emoji) => {
  selectEmoji.value = emoji.native;
};

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
watch(
  () => props.showReplyMenu,
  (newVal) => {
    showDropDown.value = newVal === props.data.id;
  },
);

function clickOutsideDropdown(event) {
  if (event.target.dataset.dropdown === 'replyMenu') {
    return;
  }
  if (
    !event.target.dataset.emoji
    && !event.target.closest('[data-emoji=emojiPicker]')
    && !event.target.closest('[data-emoji=emojiButton]')
  ) {
    showEmojiSelect.value = '';
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
                    type: 'update',
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
      <div class="relative flex pl-3">
        <div class="flex items-center gap-4">
          <div v-if="memberId" class="px-2 py-1 transition duration-300 border rounded-full border-gray-2/50 hover:border-gray-2 group">
            <button
              class="flex items-center justify-center w-8 h-8 transition duration-300 delay-150 rounded-full text-gray-2 group-hover:text-gray-1 "
              type="button"
              data-emoji="emojiButton"
              @click="showEmojiSelect = showEmojiSelect === data.id ? '' : data.id"
            >
              <i class="text-xl -translate-y-[1px] bi bi-emoji-smile" />
            </button>
          </div>
          <div v-if="selectEmoji" class="px-2 py-1 border rounded-full">
            <EmojiPicker :selectEmoji="selectEmoji" />
          </div>
          <template v-if="data.likers && data?.likers.length > 0">
            <div v-for="liker in data.likers" :key="liker.user">
              <p v-if="liker" class="px-2 py-1 text-xl border rounded-full">
                <EmojiPicker :selectEmoji="liker.emoji" />
              </p>
            </div>
          </template>
        </div>
        <Transition
          enter-active-class="transition duration-300 ease-[cubic-bezier(0.19, 1, 0.22, 1)]"
          enter-from-class="-translate-y-20 opacity-0"
          enter-to-class="translate-y-0 opacity-100"
        >
          <div
            v-if="showEmojiSelect === data.id"
            class="absolute top-full left-0 z-[1] pt-2"
            data-emoji="emojiPicker"
          >
            <Picker :data="emojiIndex" title="" native="true"
            :showPreview="false"
            @select="showEmoji" />
          </div>
        </Transition>
      </div>
      <slot />
    </div>
  </div>
</template>
<style scoped>
.v3-emoji-picker {
  height: auto;
}
</style>
