<script setup>
import {
  defineProps, onMounted, ref,
} from 'vue';
import axios from 'axios';
import CommentContent from '@/components/CommentContent.vue';
import CommentEditComponent from '@/components/CommentEditComponent.vue';
import { useMessageStore } from '@/stores/message';
import { getCookie } from '@/utils';

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

const editTarget = ref('');
const stateType = ref({
  target: '',
  type: '',
});
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

async function handleDeleteComment(target) {
  const token = getCookie('selectWaveToken');
  let api = '';
  api = `${import.meta.env.VITE_APP_API_URL}/api/comment/${target.id}`;
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
    case 'update':
      api = `${import.meta.env.VITE_APP_API_URL}/api/comment/${id}`;
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

function handleComment(state, id, content) {
  let trimmedComment = '';
  if (state === 'newComment') {
    trimmedComment = newComment.value.trim();
    if (trimmedComment.length === 0) {
      newComment.value = '';
      return;
    }
    if (newComment.value.trim() !== '' && trimmedComment.length > 0) {
      sendComment('newComment', null, newComment.value);
      newComment.value = '';
    }
    return;
  }
  if (state === 'update' || state === 'reply') {
    if (content === undefined) {
      return;
    }
    trimmedComment = content.trim();
    if (trimmedComment.length === 0) {
      return;
    }
    if (content.trim() !== '') {
      sendComment(state, id, content);
      modifyComment.value[id] = '';
    }
  }
}

function handleCommentSubmitted(state, commentId, content) {
  handleComment(state, commentId, content);
  editTarget.value = '';
}

onMounted(() => {
  getComment();
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
            <button type="button" class="px-6 py-2 ml-auto text-white transition border-2 rounded-full border-gray-1 bg-gray-1 hover:border-primary-dark hover:bg-primary-dark whitespace-nowrap disabled:hover:border-transparent disabled:opacity-50 disabled:hover:bg-gray-1" :disabled="newComment?.length === 0" @click="handleCommentSubmitted('newComment', null, newComment)">送出</button>
          </div>
        </li>
        <template v-if="commentData.length > 0">
          <template v-for="(comment) in commentData" :key="comment.id">
          <li v-if="!comment.isReply" class="flex flex-col gap-3 px-4 py-3 transition duration-300 bg-white border-2 md:gap-5 rounded-3xl md:py-5">
            <CommentContent :data="comment"
            :memberId="memberId"
            @editReply="editTarget = comment.id"
            @state="content => stateType = content"
            @handleDeleteComment="handleDeleteComment(comment)"
            >
              <CommentEditComponent
                v-if="editTarget === comment.id"
                :placeholder="comment.content"
                :is-editing="editTarget === comment.id"
                :originalTarget="comment.id"
                @cancelEdit="editTarget = ''"
                @state="content => stateType = content"
                @submitted="content => handleCommentSubmitted(
                  (stateType.target === comment.id ? stateType.type : ''), comment.id, content)"
              />
          </CommentContent>
            <ul class="space-y-3" v-if="comment.replies.length > 0">
              <li v-for="reply in comment.replies" :key="reply.id" class="px-4 py-3 transition duration-300 rounded-lg bg-gray-4">
                <CommentContent :data="reply"
                :memberId="memberId"
                @editReply="editTarget = reply.id"
                @state="content => stateType = content"
                @handleDeleteComment="handleDeleteComment(reply)"
                >
              <CommentEditComponent
                v-if="isLogin"
                :placeholder="editTarget === reply.id ? reply.content : '請輸入評論...'"
                :is-editing="editTarget === reply.id"
                :originalTarget="reply.id"
                @cancelEdit="editTarget = ''"
                @state="content => stateType = content"
                @submitted="content => handleCommentSubmitted(
                  (stateType.target === reply.id ? stateType.type : ''), reply.id, content)"
              />
              <ul class="pt-5 ml-10" v-if="reply.replies.length > 0">
                  <li v-for="subReply in reply.replies" :key="subReply.id" class="px-4 py-3 transition duration-300 border-t rounded-lg bg-gray-4">
                    <CommentContent :data="subReply"
                    :memberId="memberId"
                    @editReply="editTarget = subReply.id"
                    @state="content => stateType = content"
                    @handleDeleteComment="handleDeleteComment(subReply)"
                    >
                    <CommentEditComponent
                      v-if="isLogin"
                      :placeholder="editTarget === subReply.id ? subReply.content : ''"
                      :is-editing="editTarget === subReply.id"
                      :is-subReply="true"
                      :originalTarget="subReply.id"
                      @state="content => stateType = content"
                      @cancelEdit="editTarget = ''"
                      @submitted="content => handleCommentSubmitted(
                        (stateType.target === subReply.id ? stateType.type : ''), subReply.id, content)"
                    />
                    </CommentContent>
                  </li>
                </ul>
                </CommentContent>
              </li>
            </ul>
            <div class="grow">
              <CommentEditComponent
              v-if="isLogin"
                @submitted="content => handleCommentSubmitted('reply', comment.id, content)"
              />
            </div>
          </li>
          </template>
        </template>
      </ul>
    </div>
    </section>
</template>
