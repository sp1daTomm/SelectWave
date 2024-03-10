<style>
.swiper-pagination-bullet-active{
  background-color: #F49E00;
}

</style>
<template>
  <main>
    <div class="flex flex-col max-w-screen-lg mx-auto md:flex-row">
      <section class="relative w-full max-w-screen-lg px-8 py-5 mx-auto md:w-8/12">
        <ul class="hidden">
          <li>
            <button type="button">
              <div :style="{ backgroundImage:bgPersonImg}" class="w-8 h-8 bg-cover rounded-full"></div>
            </button>
          </li>
        </ul>
        <swiper
          :spaceBetween="30"
          :centeredSlides="true"
          :autoplay="{
            delay: 4000,
            disableOnInteraction: false,
          }"
          :pagination="{
            clickable: true,
          }"
          :navigation="navigation"
          :modules="modules"
        >
        <swiper-slide>
            <div class="relative flex flex-col overflow-hidden rounded-3xl">
              <div>
                <div v-bind:style="{ backgroundImage:'url('+ thisPollData.imageUrl +')' }"
                    class=" bg-cover rounded-3xl pb-[70%] relative">
                  <p class="absolute bottom-0 p-4 text-white drop-shadow-md"></p>
                </div>
              </div>
            </div>
          </swiper-slide>
          <swiper-slide v-for="(optionImg, idx) in thisPollData.options" :key="optionImg.id+'Img'">
            <div class="relative flex flex-col overflow-hidden rounded-3xl">
              <div>
                <div v-bind:style="{ backgroundImage:'url('+optionImg.imageUrl+')' }"
                    class="bg-cover rounded-3xl pb-[70%] relative">
                  <div
                       class="absolute inset-0 bg-gradient-to-t from-gray-1 via-transparent to-transparent" />
                  <p class="absolute bottom-0 p-4 text-white drop-shadow-md"><span class="pr-2">{{ idx+1 }}.</span>{{ optionImg.title }}</p>
                </div>
                </div>
            </div>
          </swiper-slide>
        <div class="h-10"></div>
        </swiper>
          <div class="absolute mx-3 left-0 right-0 bottom-3 top-10 bg-primary-light rounded-2xl
          md:bottom-[unset] md:top-10 md:left-0 md:right-0 md:pb-[68%]"></div>
      </section>

      <section class="max-w-screen-lg px-3 py-8 md:py-4">
        <h1 class="text-2xl font-semibold leading-normal md:text-3xl md:leading-relaxed">{{thisPollData.title}}</h1>
        <p class="py-3 md:text-xl text-gray-2 md:py-4">{{thisPollData.description}}</p>
        <ul class="flex flex-wrap gap-3">
          <li v-for="tag in thisPollData.tags" :key="tag.id">
            <span class="pr-1 font-bold text-primary">#</span>
            {{ tag.name }}
          </li>
        </ul>
        <div class="flex items-center py-6">
          <div :style="{ backgroundImage:'url('+thisPollData.createdBy?.avatar+')'}" class="w-8 h-8 bg-cover rounded-full"></div>
          <p class="pl-3 pr-4 font-medium" :data-userId="thisPollData.createdBy?.id">{{ thisPollData.createdBy?.name }}</p>
          <div class="px-3 py-1 border border-2 rounded-full border-gray-2 text-gray-2">發起人</div>
        </div>
        <ul class="flex flex-col gap-3">
          <li v-for="(option, idx) in thisPollData.options" :key="option.id"
           >
            <div class="relative flex items-center p-3 border-2 overflow-clip rounded-3xl border-gray-3"
            :class="{ 'border-primary': isSelectedRadio(option.id) }">
              <input type="radio" :disabled="!isCanVoting || thisPollData.status!=='active' || isVoted(option.voters)"  name="flexRadioDefault" :value="option.id" :id="'flexCheckDefault'+idx" class="focus:ring-primary text-primary" v-model="selectedRadio">
              <label :for="'flexCheckDefault'+idx" class="flex items-center justify-between w-full gap-3">
                <p class="flex-grow pl-3"><span class="pr-2">{{ idx+1 }}.</span>{{ option.title }}</p><p class="flex-shrink-0 text-gray-2" >{{option.voters.length}} 票</p>
              </label>
              <div v-if="option.voters.length>0" class="absolute inset-y-0 right-0 z-[-1] w-[105%] h-[105%] origin-right transition duration-300 ease-in-out"
              :class="( option.voters.length / thisPollData.totalVoters )*100 >= 50 && ( option.voters.length / thisPollData.totalVoters )*100 < 80 ? 'bg-primary/75' : ( option.voters.length / thisPollData.totalVoters )*100 >= 80 ? 'bg-primary-dark/75' : 'bg-gray-3/50'"
              :style="{
                transform:
                  `scaleX( ${(option.voters.length / thisPollData.totalVoters * 100)}%)`
              }"
              />
            </div>
            <p v-if="isVoted(option.voters)" class="float-right pr-2 text-gray-3">已投票</p>

          </li>
        </ul>
        <div class="flex gap-4 px-3 py-3">
          <button class="w-10 h-10 rounded-full bg-gray-4" type="button"><i class="bi bi-link"></i></button>
          <button v-if="thisPollData.status==='active'" type="button" @click="doVoting(selectedRadio)" class="px-6 py-2 text-white transition bg-black border-2 rounded-full hover:border-gray-2 hover:bg-gray-2 grow">
            {{ doNotVotingText }}
          </button>
          <button v-else type="button" @click="isEndVotingMessage" class="px-6 py-2 text-white transition bg-black border-2 rounded-full hover:border-gray-2 hover:bg-gray-2 grow">
            投票已結束
          </button>
        </div>

      </section>
    </div>
    <section class="relative">
      <div :style="{ backgroundImage:bgImg}" class="bg-no-repeat bg-right absolute inset-0 bg-40% hidden z-[-1] md:block"></div>
      <div class="max-w-screen-lg gap-4 px-3 py-6 mx-auto ">
      <div class="flex md:w-8/12">
        <div class="flex items-center justify-between w-full">
          <h2 class="pt-6 pb-4 text-xl font-semibold leading-normal text-center text-gray-1 md:text-3xl md:pb-8">討論區</h2>
          <p class="text-gray-1">{{commentData.length}}則留言</p>
        </div>
      </div>
      <ul class="flex flex-col gap-3 md:w-8/12">
        <li v-if="isLogin && commentData.length === 0" class="flex flex-col px-4 py-3 border border-2 rounded-3xl md:py-5" data-message="send">
          <div class="flex items-center pb-2 md:pb-6">
            <div :style="{ backgroundImage:'url('+ memberImg +')'}" class="w-8 h-8 bg-cover rounded-full"></div>
            <p class="pl-3 pr-4 font-medium">{{ memberName }}</p>
          </div>
          <input v-model="messageComment" type="text" class="block w-full px-4 py-2 mb-2 border-0 rounded-full focus:ring-primary focus:bg-white bg-gray-4 md:mb-4 placeholder:text-gray-3" placeholder="請輸入評論...">
          <button type="button" class="px-6 py-2 ml-auto text-white transition bg-black border-2 rounded-full hover:border-gray-2 hover:bg-gray-2" @click="sentComment('message')">送出</button>
        </li>
        <li v-if="commentData.length > 0" class="flex flex-col px-4 py-3 border border-2 rounded-3xl md:py-5">
          <div v-for="comment in commentData" :key="comment.id" class="flex" data-message="one">
            <div :style="{ backgroundImage:'url('+comment.author.avatar+')'}" class="w-8 h-8 bg-cover rounded-full shrink"></div>
            <div class="grow">
              <div class="flex justify-between">
                <p class="pt-1 pl-3 pr-4 font-medium">{{comment.author.name}}</p>
                <p class="text-gray-2">{{dateForm(comment.createdTime)}}</p>
              </div>
              <p class="py-2 pl-3 leading-normal">{{ comment.content }}</p>
            </div>
          </div>
          <div v-if="isLogin" class="px-4 py-3 rounded-lg bg-gray-4">
            <div class="flex" data-message="list">
              <div :style="{ backgroundImage:'url('+ memberImg +')'}" class="w-8 h-8 bg-cover rounded-full shrink"></div>
              <div class="grow">
                <div class="flex items-center">
                  <p class="pl-3 pr-4 font-medium">{{ memberName }}</p>
                  <!-- <div class="px-3 py-1 bg-white border border-2 rounded-full border-gray-2 text-gray-2">發起人</div> -->
                  <p class="ml-auto text-gray-2">{{ dateForm(new Date()) }}</p>
                </div>
                <p class="py-2 pl-3 leading-normal md:pb-3"></p>
              </div>
            </div>
            <div class="flex flex-col">
              <button :class="show ? '' : 'hidden'"  @click="show = !show" type="button" class="w-full px-4 py-2 text-left bg-white border border-2 rounded-3xl"><i class="mr-3 bi bi-arrow-90deg-left"></i>回覆</button>
              <input v-model="replyComment" :class="show ? 'hidden' : ''" type="text" class="block w-full px-4 py-2 mb-2 bg-white border-0 rounded-full focus:ring-primary focus:bg-white md:mb-4 placeholder:text-gray-3" placeholder="請輸入評論...">
              <button type="button" class="px-6 py-2 ml-auto text-white transition bg-black border-2 rounded-full hover:border-gray-2 hover:bg-gray-2" :class="show ? 'hidden' : ''" @click="sentComment('reply')">送出</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
    </section>

  </main>
</template>
<script>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { useMessageStore } from '@/stores/message';
import { getCookie } from '@/utils';
import { useMemberStore } from '../stores/member';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const pollId = route.params.id;
    const memberStore = useMemberStore();
    const memberId = memberStore.member.id;
    const memberName = memberStore.member.name;
    const memberImg = memberStore.member.avatar;
    const show = ref(true);
    const bgPersonImg = 'url("/images/loginCover.png")';
    const bgImg = 'url("/images/bg-01.svg")';
    const selectedRadio = ref(null);
    const replyComment = ref('');
    const messageComment = ref('');
    const widthIsShow = true;
    const isCanVoting = ref(false);
    const doNotVotingText = ref('');
    const message = useMessageStore();
    const thisPollData = ref([]);
    const votedAll = ref(false);
    const isLogin = ref(false);
    const commentData = ref([]);
    async function fetchCommentData() {
      try {
        const api = `${import.meta.env.VITE_APP_API_URL}/api/poll/${pollId}/comment`;
        const { data } = await axios.get(api);
        if (data.status) {
          commentData.value = data.result;
        }
      } catch (error) {

        // console.error('Error fetching poll data:', error);
      }
    }
    async function pushComment(state) {
      let stateValue = null;
      if (state === 'message') {
        stateValue = messageComment.value;
      } else if (state === 'reply') {
        stateValue = replyComment.value;
      }

      const token = getCookie('selectWaveToken');
      const api = `${import.meta.env.VITE_APP_API_URL}/api/comment`;
      const postComment = {
        pollId,
        content: stateValue,
      };
      axios.post(api, postComment, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.setMessage({
        message: '已完成留言',
      });
      message.showToast(true, 'success');
      fetchCommentData();
    }
    function sentComment(state) {
      if (state === 'reply') {
        const trimmedComment = replyComment.value.trim();
        if (trimmedComment.length === 0) {
          replyComment.value = '';
          return;
        }
        if (replyComment.value.trim() !== '') {
          pushComment('reply');
          show.value = !show.value;
          replyComment.value = '';
        }
      } else if (state === 'message') {
        const trimmedComment = messageComment.value.trim();
        if (trimmedComment.length === 0) {
          messageComment.value = '';
          return;
        }
        if (messageComment.value.trim() !== '' && trimmedComment.length > 0) {
          pushComment('message');
          messageComment.value = '';
        }
      }
    }
    function dateForm(date) {
      // const date = '2024-03-09T16:16:56.548Z';
      const utcDate = new Date(date);

      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // 使用 24 小時制
        timeZone: 'Asia/Taipei', // 設定時區為 UTC
      };

      const formatter = new Intl.DateTimeFormat('en-US', options);
      const formattedDate = formatter.format(utcDate);

      return formattedDate.replace(',', '');
    }
    function isSelectedRadio(value) {
      return selectedRadio.value === value;
    }

    function isEndVotingMessage() {
      message.setMessage({
        message: '投票已結束，無法投票',
      });
      message.showToast(true, 'error');
    }
    function votedNum(options) {
      let num = 0;
      options.forEach((option) => {
        option.voters.forEach((user) => {
          if (user.user.id === memberId) {
            num += 1;
          }
        });
      });
      if (options.length === num) {
        votedAll.value = true;
      }

      if (votedAll.value === true) {
        isCanVoting.value = false;
        doNotVotingText.value = '都已投票過';
      }
    }

    async function fetchPollData() {
      try {
        const api = `${import.meta.env.VITE_APP_API_URL}/api/poll/${pollId}`;
        const response = await axios.get(api);
        thisPollData.value = response.data.poll;
        votedNum(thisPollData.value.options);
      } catch (error) {

        // console.error('Error fetching poll data:', error);
      }
    }

    function isVoted(voters) {
      const isMe = voters.filter((userId) => {
        return userId.user.id === memberId;
      });
      if (isMe.length > 0) {
        return true;
      }
      return false;
    }
    function doVoting(id) {
      if (!memberId) {
        message.setMessage({
          message: '請先登入',
        });
        message.showToast(true, 'error');
        router.push('/login');
        return;
      }
      if (isCanVoting.value === false) {
        message.setMessage({
          message: '投票失敗',
        });
        message.showToast(true, 'error');
        return;
      }
      const optionId = {
        optionId: id,
      };
      const token = getCookie('selectWaveToken');
      const api = `${import.meta.env.VITE_APP_API_URL}/api/vote`;
      axios.post(api, optionId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(({ data }) => {
          if (data.status) {
            message.setMessage({
              message: '已完成投票',
            });
            message.showToast(true, 'success');
            fetchPollData();
          }
        })
        .catch(() => {
          message.setMessage({
            message: '投票失敗',
          });
          message.showToast(true, 'error');
        });
    }

    onMounted(() => {
      const token = getCookie('selectWaveToken');
      if (token) {
        isLogin.value = true;
        isCanVoting.value = true;
        doNotVotingText.value = '送出投票';
      } else {
        isLogin.value = false;
        isCanVoting.value = false;
        doNotVotingText.value = '登入後即可投票';
      }
      fetchPollData();
      fetchCommentData();
    });

    return {
      show,
      bgPersonImg,
      selectedRadio,
      replyComment,
      messageComment,
      modules: [Autoplay, Pagination, Navigation],
      widthIsShow,
      bgImg,
      sentComment,
      isSelectedRadio,
      thisPollData,
      isCanVoting,
      doNotVotingText,
      doVoting,
      isEndVotingMessage,
      memberId,
      pollId,
      isVoted,
      commentData,
      memberName,
      memberImg,
      isLogin,
      dateForm,
    };
  },
};
</script>
