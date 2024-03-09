<style>
.swiper-pagination-bullet-active{
  background-color: #F49E00;
}

</style>
<template>
  <main>
    <div class="flex flex-col md:flex-row max-w-screen-lg mx-auto">
      <section class="relative max-w-screen-lg mx-auto px-8 py-5 md:w-8/12 w-full">
        <ul class="hidden">
          <li>
            <button type="button">
              <div :style="{ backgroundImage:bgPersonImg}" class="w-8 h-8 rounded-full bg-cover"></div>
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
                  <p class="text-white p-4 absolute bottom-0 drop-shadow-md"></p>
                </div>
              </div>
            </div>
          </swiper-slide>
          <swiper-slide v-for="(optionImg, idx) in thisPollData.options" :key="optionImg.id+'Img'">
            <div class="relative flex flex-col overflow-hidden rounded-3xl">
              <div>
                <div v-bind:style="{ backgroundImage:'url('+optionImg.imageUrl+')' }"
                    class=" bg-cover rounded-3xl pb-[70%] relative">
                  <p class="text-white p-4 absolute bottom-0 drop-shadow-md"><span class="pr-2">{{ idx+1 }}.</span>{{ optionImg.title }}</p>
                </div>
                </div>
            </div>
          </swiper-slide>
        <div class="h-10"></div>
        </swiper>
          <div class="absolute mx-3 left-0 right-0 bottom-3 top-10 bg-primary-light rounded-2xl
          md:bottom-[unset] md:top-10 md:left-0 md:right-0 md:pb-[68%]"></div>
      </section>

      <section class="py-8 md:py-4 max-w-screen-lg px-3">
        <h1 class="text-2xl md:text-3xl leading-normal md:leading-relaxed font-semibold">{{thisPollData.title}}</h1>
        <p class="md:text-xl text-gray-2 py-3 md:py-4">{{thisPollData.description}}</p>
        <ul class="flex gap-3 flex-wrap">
          <li v-for="tag in thisPollData.tags" :key="tag.id">
            <span class="text-primary pr-1 font-bold">#</span>
            {{ tag.name }}
          </li>
        </ul>
        <div class="flex items-center py-6">
          <div :style="{ backgroundImage:'url('+thisPollData.createdBy?.avatar+')'}" class="w-8 h-8 rounded-full bg-cover"></div>
          <p class="pl-3 pr-4 font-medium" :data-userId="thisPollData.createdBy?.id">{{ thisPollData.createdBy?.name }}</p>
          <div class="px-3 py-1 border-gray-2 border rounded-full border-2 text-gray-2">發起人</div>
        </div>
        <ul class="flex flex-col gap-3">
          <li v-for="(option, idx) in thisPollData.options" :key="option.id"
           >
            <div class="overflow-hidden flex items-center border rounded-3xl border-2 border-gray-3 p-3 relative"
            :class="{ 'border-primary': isSelectedRadio(option.id) }">
              <input type="radio" :disabled="!isCanVoting || thisPollData.status!=='active' || isVoted(option.voters)"  name="flexRadioDefault" :value="option.id" :id="'flexCheckDefault'+idx" class="focus:ring-primary text-primary" v-model="selectedRadio">
              <label :for="'flexCheckDefault'+idx" class="flex items-center justify-between w-full gap-3">
                <p class="pl-3 flex-grow"><span class="pr-2">{{ idx+1 }}.</span>{{ option.title }}</p><p class="text-gray-2 flex-shrink-0" >{{option.voters.length}} 票</p>
              </label>
              <div v-if="option.voters.length>0" class="absolute bg-gray-4 inset-y-0 right-0 z-[-1] rounded-r-3xl"
              :class="{ 'bg-primary-light': isSelectedRadio(option.id) }"
              :style="{left:( option.voters.length / thisPollData.totalVoters )+'%'}"
              >
              </div>
            </div>
            <p v-if="isVoted(option.voters)" class="pr-2 float-right text-gray-3">已投票</p>

          </li>
        </ul>
        <div class="px-3 flex gap-4 py-3">
          <button class="w-10 h-10 bg-gray-4 rounded-full" type="button"><i class="bi bi-link"></i></button>
          <button v-if="thisPollData.status==='active'" type="button" @click="doVoting(selectedRadio)" class="px-6 py-2 border-2 rounded-full bg-black text-white hover:border-gray-2 hover:bg-gray-2 transition grow">
            {{ doNotVotingText }}
          </button>
          <button v-else type="button" @click="isEndVotingMessage" class="px-6 py-2 border-2 rounded-full bg-black text-white hover:border-gray-2 hover:bg-gray-2 transition grow">
            投票已結束
          </button>
        </div>

      </section>
    </div>
    <section class="relative">
      <div :style="{ backgroundImage:bgImg}" class="bg-no-repeat bg-right absolute inset-0 bg-40% hidden z-[-1] md:block"></div>
      <div class=" max-w-screen-lg mx-auto px-3  gap-4 py-6 ">
      <div class="flex md:w-8/12">
        <div class="flex justify-between w-full items-center">
          <h2 class="text-gray-1 pt-6 pb-4 text-xl md:text-3xl text-center leading-normal font-semibold md:pb-8">討論區</h2>
          <p class="text-gray-1">2則留言</p>
        </div>
      </div>
      <ul class="flex flex-col gap-3 md:w-8/12">
        <li class="border rounded-3xl border-2 py-3 px-4 flex flex-col md:py-5" data-message="send">
          <div class="flex items-center md:pb-6 pb-2">
            <div :style="{ backgroundImage:bgPersonImg}" class="w-8 h-8 rounded-full bg-cover"></div>
            <p class="pl-3 pr-4 font-medium">王小明</p>
          </div>
          <input v-model="messageComment" type="text" class="focus:ring-primary focus:bg-white rounded-full px-4 py-2 block bg-gray-4 border-0 w-full mb-2 md:mb-4 placeholder:text-gray-3" placeholder="請輸入評論...">
          <button type="button" class=" px-6 py-2 border-2 rounded-full bg-black text-white hover:border-gray-2 hover:bg-gray-2 transition ml-auto" @click="sentComment('message')">送出</button>
        </li>
        <li class="border rounded-3xl border-2 py-3 px-4 flex flex-col md:py-5">
          <div class="flex" data-message="one">
            <div :style="{ backgroundImage:bgPersonImg}" class="w-8 h-8 shrink rounded-full bg-cover"></div>
            <div class="grow">
              <div class="flex justify-between">
                <p class="pl-3 pr-4 pt-1 font-medium">王小明</p>
                <p class="text-gray-2">2023/12/31</p>
              </div>
              <p class="py-2 pl-3 leading-normal">我超喜歡！</p>
            </div>
          </div>
          <div class="bg-gray-4 py-3 px-4 rounded-lg">
            <div class="flex" data-message="list">
              <div :style="{ backgroundImage:bgPersonImg}" class="w-8 h-8 shrink rounded-full bg-cover"></div>
              <div class="grow">
                <div class="flex items-center">
                  <p class="pl-3 pr-4 font-medium">王小明</p>
                  <div class="px-3 py-1 border-gray-2 border rounded-full border-2 text-gray-2 bg-white">發起人</div>
                  <p class="ml-auto text-gray-2">2023/12/31</p>
                </div>
                <p class="py-2 pl-3 leading-normal md:pb-3">我也是！</p>
              </div>
            </div>
            <div class="flex flex-col">
              <button :class="show ? '' : 'hidden'"  @click="show = !show" type="button" class="bg-white border rounded-3xl border-2 text-left px-4 py-2 w-full"><i class="bi bi-arrow-90deg-left mr-3"></i>回覆</button>
              <input v-model="replyComment" :class="show ? 'hidden' : ''" type="text" class="focus:ring-primary focus:bg-white rounded-full px-4 py-2 block bg-white border-0 w-full mb-2 md:mb-4 placeholder:text-gray-3" placeholder="請輸入評論...">
              <button type="button" class=" px-6 py-2 border-2 rounded-full bg-black text-white hover:border-gray-2 hover:bg-gray-2 transition ml-auto" :class="show ? 'hidden' : ''" @click="sentComment('reply')">送出</button>
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
import { useRoute } from 'vue-router';
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
    const route = useRoute();
    const pollId = route.params.id;
    const memberStore = useMemberStore();
    const memberId = memberStore.member.id;
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

    function sentComment(state) {
      if (state === 'reply') {
        const trimmedComment = replyComment.value.trim();
        if (trimmedComment.length === 0) {
          replyComment.value = '';
          return;
        }
        if (replyComment.value.trim() !== '') {
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
          messageComment.value = '';
        }
      }
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
        isCanVoting.value = true;
        doNotVotingText.value = '送出投票';
      } else {
        isCanVoting.value = false;
        doNotVotingText.value = '登入後即可投票';
      }
      fetchPollData();
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
    };
  },
};
</script>
