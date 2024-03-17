<script setup>
import {
  defineProps, onBeforeMount, onMounted, ref,
} from 'vue';
import axios from 'axios';
import CommentEditComponent from '@/components/CommentEditComponent.vue';
import { useMessageStore } from '@/stores/message';
import { getCookie, turnDateTime } from '@/utils';

const message = useMessageStore();

const props = defineProps({
  pollId: String,
  memberId: String,
  memberName: String,
  memberImg: String,
  isLogin: Boolean,
});

const bgImg = ref('url("/images/bg-01.svg")');
const isMobile = ref(window.innerWidth < 768);

const commentData = ref([]);

const showReplyMenu = ref('');
const showReply = ref('');
const editTarget = ref('');

const newComment = ref('');
const modifyComment = ref({});

const getComment = async () => {
  try {
    const api = `${import.meta.env.VITE_APP_API_URL}/api/poll/${props.pollId}/comment`;
    const { data } = await axios.get(api);
    if (data.status) {
      commentData.value = data.result;
    }
  } catch (error) {
    message.setMessage({
      message: error.response.data.message,
    });
    message.showToast(true, 'error');
  }
};

async function handleDeleteComment(state, target) {
  const token = getCookie('selectWaveToken');
  let api = '';
  if (state === 'reply') {
    api = `${import.meta.env.VITE_APP_API_URL}/api/comment/reply/${target.id}`;
  } else if (state === 'message') {
    api = `${import.meta.env.VITE_APP_API_URL}/api/comment/${target.id}`;
  }
  message.setMessage({
    title: '確認刪除留言',
    message: `請確認是否要刪除 ${target.content} 的留言`,
  });
  try {
    const result = await this.message.showConfirm();
    if (result) {
      const { data } = await axios.delete(api, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.status) {
        message.setMessage({
          message: '已刪除留言',
        });
        message.showToast(true, 'success');
        await getComment();
      } else {
        message.setMessage({
          message: data.message,
        });
        message.showToast(true, 'error');
      }
    }
  } catch (error) {
    message.setMessage({
      message: error.response.data.message,
    });
    message.showToast(true, 'error');
  }
}

async function sendComment(state, id, content) {
  let api = '';
  let method = '';
  switch (state) {
    case 'newComment':
      api = `${import.meta.env.VITE_APP_API_URL}/api/comment`;
      method = 'post';
      break;
    case 'reply':
      api = `${import.meta.env.VITE_APP_API_URL}/api/comment/${id}/reply`;
      method = 'post';
      break;
    case 'updateComment':
      api = `${import.meta.env.VITE_APP_API_URL}/api/comment/${id}`;
      method = 'put';
      break;
    case 'updateReplyComment':
      api = `${import.meta.env.VITE_APP_API_URL}/api/comment/reply/${id}`;
      method = 'put';
      break;
    default:
      break;
  }
  const token = getCookie('selectWaveToken');
  try {
    const postComment = {
      pollId: props.pollId,
      content,
    };
    const { data } = await axios[method](api, postComment, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data.status) {
      message.setMessage({
        message: '已完成留言',
      });
      message.showToast(true, 'success');
      await getComment();
    } else {
      message.setMessage({
        message: data.message,
      });
      message.showToast(true, 'error');
    }
  } catch (error) {
    message.setMessage({
      message: error.response.data.message,
    });
    message.showToast(true, 'error');
  }
}

function handleComment(state, id, isClose, content) {
  let trimmedComment = '';
  switch (state) {
    case 'reply':
      console.log('reply', modifyComment.value[id]);
      console.log('reply', content);
      if (modifyComment.value[id] === undefined) {
        modifyComment.value[id] = '';
        showReply.value = '';
        return;
      }
      trimmedComment = modifyComment.value[id].trim();
      if (trimmedComment.length === 0) {
        modifyComment.value[id] = '';
        showReply.value = '';
        return;
      }
      if (modifyComment.value[id].trim() !== '') {
        sendComment('reply', id, modifyComment.value[id]);
        showReply.value = '';
        modifyComment.value[id] = '';
      }
      break;
    case 'newComment':
      trimmedComment = newComment.value.trim();
      if (trimmedComment.length === 0) {
        newComment.value = '';
        return;
      }
      if (newComment.value.trim() !== '' && trimmedComment.length > 0) {
        sendComment('newComment', null, newComment.value);
        newComment.value = '';
      }
      break;
    case 'replyComment':
      if (isClose || modifyComment.value[id] === undefined) {
        modifyComment.value[id] = '';
        showReply.value = '';
        return;
      }
      trimmedComment = content.trim();
      if (trimmedComment.length === 0) {
        showReply.value = '';
        modifyComment.value[id] = '';
        return;
      }
      if (content.trim() !== '') {
        sendComment('reply', id, content);
        showReply.value = '';
        modifyComment.value[id] = '';
      }
      break;
    case 'editComment':
      if (content === undefined || modifyComment.value[id] === undefined) {
        modifyComment.value[id] = '';
        editTarget.value = '';
        return;
      }
      trimmedComment = content.trim();
      if (trimmedComment.length === 0) {
        modifyComment.value[id] = '';
        return;
      }
      if (content.trim() !== '') {
        sendComment('updateComment', id, content);
        modifyComment.value[id] = '';
      }
      break;
    case 'editReplyComment':
      if (isClose || modifyComment.value[id] === undefined) {
        modifyComment.value[id] = '';
        return;
      }
      trimmedComment = content.trim();
      if (trimmedComment.length === 0) {
        modifyComment.value[id] = '';
        return;
      }
      if (content.trim() !== '') {
        sendComment('updateReplyComment', id, content);
        modifyComment.value[id] = '';
      }
      break;
    default:
      break;
  }
}

function handleCommentSubmitted(commentId, content) {
  if (commentId) {
    handleComment('replyComment', commentId, false, content);
  } else {
    handleComment('newComment', null, false, content);
  }
}

function handleCommentEdited(state, commentId, content) {
  if (state === 'reply') {
    handleComment('editReplyComment', commentId, content === undefined, content);
  } else {
    handleComment('editComment', commentId, content === undefined, content);
  }
}

function clickOutsideDropdown(event) {
  if (event.target.dataset.dropdown === 'replyMenu') {
    return;
  }
  if (!event.target.closest('[data-dropdown=replyMenu]')) {
    showReplyMenu.value = '';
  }
}

onMounted(() => {
  getComment();
  window.addEventListener('click', clickOutsideDropdown);
});

onBeforeMount(() => {
  window.removeEventListener('click', clickOutsideDropdown);
});

</script>

<template>
  <section class="relative bg-fixed bg-40% bg-right bg-no-repeat" :style="{ backgroundImage: isMobile ? '' : bgImg }">
      <div class="max-w-screen-lg gap-4 px-3 py-6 mx-auto ">
      <div class="flex md:w-8/12">
        <div class="flex items-center justify-between w-full">
          <h2 class="pt-6 pb-4 text-xl font-semibold leading-normal text-center text-gray-1 md:text-3xl md:pb-8">討論區</h2>
          <p class="text-gray-1">{{commentData.length}}則留言</p>
        </div>
      </div>
      <ul class="flex flex-col gap-6 md:w-8/12">
        <li v-if="memberName" class="flex flex-col px-4 py-3 bg-white border-2 rounded-3xl md:py-5" data-message="send">
          <div class="flex items-center pb-2 md:pb-6">
            <div :style="{ backgroundImage:'url('+ memberImg +')'}" class="w-8 h-8 bg-cover rounded-full"></div>
            <p class="pl-3 pr-4 font-medium">{{ memberName }}</p>
          </div>
          <div class="flex items-center gap-4">
            <input v-model="newComment" type="text" class="block w-full px-4 py-2 mb-2 border-0 rounded-full focus:ring-primary focus:bg-white focus:ring-2 bg-gray-4 md:mb-0 placeholder:text-gray-3" placeholder="請輸入評論...">
            <button type="button" class="px-6 py-2 ml-auto text-white transition border-2 rounded-full border-gray-1 bg-gray-1 hover:border-primary-dark hover:bg-primary-dark whitespace-nowrap disabled:hover:border-transparent disabled:opacity-50 disabled:hover:bg-gray-1" :disabled="newComment?.length === 0" @click="handleComment('newComment')">送出</button>
          </div>
        </li>
        <template v-if="commentData.length > 0">
          <li v-for="(comment) in commentData" :key="comment.id" class="flex flex-col gap-3 px-4 py-3 bg-white border-2 md:gap-5 rounded-3xl md:py-5">
              <div class="flex items-start gap-1 border-b-gray-4" data-message="one">
              <div :style="{ backgroundImage:'url('+comment.author.avatar+')'}" class="w-8 h-8 bg-cover rounded-full shrink"></div>
              <div class="grow">
                <div class="flex justify-between mb-3">
                  <p class="pt-1 pl-3 pr-4 font-medium">{{comment.author.name}}</p>
                  <div class="relative flex items-center gap-4">
                    <p class="text-gray-2">{{turnDateTime(comment.createdTime)}}</p>
                    <button class="grid w-8 h-8 transition duration-300 rounded-full place-content-center hover:bg-gray-2/50 text-gray-2 hover:text-gray-1" type="button" data-dropdown="replyMenu" v-if="comment.author.id === memberId"
                                @click="showReplyMenu = showReplyMenu === comment.id ? '' : comment.id">
                          <i class="text-2xl bi bi-three-dots-vertical"></i>
                        </button>
                    <div
                          data-dropdown="replyMenu"
                          :class="`absolute z-10 ${showReplyMenu === comment.id ? 'block' : 'hidden'} font-normal bg-white divide-y shadow-lg right-0 top-full rounded-2xl w-44 animate-fade-down animate-once animate-ease-in-out`">
                        <ul class="py-3 text-sm text-gray-700">
                          <li class="block py-2 px-7 hover:text-primary" @click="editTarget = comment.id">編輯
                          </li>
                          <li class="block py-2 px-7 hover:text-primary" @click="handleDeleteComment('message', comment)">刪除
                          </li>
                        </ul>
                      </div>
                  </div>
                </div>
                <p class="py-2 pl-3 leading-normal">{{ comment.content }}</p>
                <div class="flex items-center gap-4" v-if="comment.author.id === memberId && editTarget === comment.id">
                  <input v-model="modifyComment[comment.id]" type="text" class="block w-full px-4 py-2 mb-2 border-0 rounded-full focus:ring-primary focus:bg-white focus:ring-2 bg-gray-4 md:mb-0 placeholder:text-gray-3" :placeholder="comment.content">
                  <button type="button" class="px-6 py-2 ml-auto text-white transition border-2 rounded-full border-gray-1 bg-gray-1 whitespace-nowrap disabled:hover:border-transparent disabled:hover:bg-gray-1 disabled:opacity-50 disabled:cursor-auto hover:border-primary-dark hover:bg-primary-dark"
                  :disabled="modifyComment[comment.id] === undefined || modifyComment[comment.id]?.length === 0"
                  @click="handleCommentEdited('message', comment.id, modifyComment[comment.id])">送出</button>
                  <button type="button" class="px-6 py-2 ml-auto transition border-2 rounded-full text-gray-1 border-gray-1 whitespace-nowrap hover:bg-gray-1 hover:text-white"
                  @click="editTarget = ''; modifyComment[comment.id] = ''">關閉</button>
                </div>
              </div>
            </div>
            <ul v-if="comment.replies.length > 0">
              <li v-for="reply in comment.replies" :key="reply.id" class="px-4 py-3 rounded-lg bg-gray-4">
                <div class="flex mb-4" data-message="list">
                <div :style="{ backgroundImage:'url('+ reply.author.avatar +')'}" class="w-8 h-8 bg-cover rounded-full shrink"></div>
                <div class="grow">
                  <div class="flex items-center justify-between mb-3">
                    <p class="pl-3 pr-4 font-medium">{{ reply.author.name }}</p>
                    <div class="relative flex items-center gap-4">
                      <p class="text-gray-2">{{turnDateTime(reply.createdTime)}}</p>
                      <button class="grid w-8 h-8 transition duration-300 rounded-full place-content-center hover:bg-gray-2/50 text-gray-2 hover:text-gray-1" type="button" data-dropdown="replyMenu"
                              @click="showReplyMenu = showReplyMenu === reply.id ? '' : reply.id">
                        <i class="text-2xl bi bi-three-dots-vertical" />
                      </button>
                      <div
                          data-dropdown="replyMenu"
                          :class="`absolute z-10 ${showReplyMenu === reply.id ? 'block' : 'hidden'} font-normal bg-white divide-y shadow-lg right-0 top-full rounded-2xl w-44 animate-fade-down animate-once animate-ease-in-out`">
                        <ul class="py-3 text-sm text-gray-700">
                          <li class="block py-2 px-7 hover:text-primary" @click="editTarget = reply.id">編輯
                          </li>
                          <li class="block py-2 px-7 hover:text-primary" @click="handleDeleteComment('reply', reply)">刪除
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <p class="py-2 pl-3 leading-normal md:pb-3">{{ reply.content }} <span class="ml-8">{{ reply.edited ? '已修改' : '' }}</span></p>
                </div>
              </div>
              <CommentEditComponent
              v-if="isLogin"
                :is-reply="true"
                @submitted="content => handleCommentSubmitted(reply.id, content)"
              />
              </li>
            </ul>
            <CommentEditComponent
            v-if="isLogin"
              :is-reply="true"
              @submitted="content => handleCommentSubmitted(comment.id, content)"
            />
          </li>
        </template>
      </ul>
    </div>
    </section>
</template>
