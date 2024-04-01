<!-- eslint-disable no-unused-vars -->
<script setup>
import { defineEmits, defineProps, ref } from 'vue';
import axios from 'axios';
import { useMessageStore } from '@/stores/message';
import { getCookie } from '@/utils';

const message = useMessageStore();
const onHover = ref(false);
const isLoading = ref(false);

const props = defineProps({
  isFollowed: Boolean,
  pollId: String,
});

const emit = defineEmits('handleIsFollowed');

const isFollowed = ref(props.isFollowed);

const handleFollow = async () => {
  const baseUrl = import.meta.env.VITE_APP_API_URL;
  isLoading.value = true;
  const { data } = await axios(`${baseUrl}/api/poll/${props.pollId}/follow`, {
    method: props.isFollowed ? 'DELETE' : 'GET',
    headers: {
      Authorization: `Bearer ${getCookie('selectWaveToken')}`,
    },
  });

  if (data.status) {
    isFollowed.value = !isFollowed.value;
    message.setMessage({
      message: data.message,
    });
    message.showToast(true);
    isLoading.value = false;
    emit('handleIsFollowed');
  }
  if (!data.status) {
    message.setMessage({
      message: data.message,
    });
    message.showToast(true, 'error');
    isLoading.value = false;
  }
};

</script>

<template>
  <button type="button" :disabled="isLoading" class="absolute top-0 right-0 grid w-10 h-10 p-2 transition duration-300 -translate-x-4 translate-y-4 border border-transparent rounded-lg bg-gray-1 place-content-center hover:border-primary-dark disabled:opacity-50" @mouseover="onHover = true" @mouseleave="onHover = false" @click="handleFollow">
              <i class="text-white bi bi-heart" :class="(isFollowed || onHover) ? 'hidden' : 'block'" />
              <i class="bi bi-heart-fill" :class="(isFollowed || onHover) ? 'block text-primary' : 'hidden'" />
            </button>
</template>
