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
        <ul class="flex flex-wrap gap-3 mb-3">
          <li v-for="tag in thisPollData.tags" :key="tag.id">
            <span class="pr-1 font-bold text-primary">#</span>
            {{ tag.name }}
          </li>
        </ul>
        <ul class="flex flex-col gap-2">
          <!-- <li class="text-sm">{{ thisPollData.totalVoters }} 人參與投票</li> -->
          <li class="pb-2 text-sm border-b">
            <div  class="py-2">投票時間</div>
            <div class="flex items-center justify-between">
              <div>{{ turnDate(thisPollData.startDate) }}</div>
              <div>
                {{ turnDate(thisPollData.endDate) }}
              </div>
            </div>
            </li>
          <li class="pb-2 text-sm border-b" v-if="thisPollData.endDate !== null">
            <div class="flex items-center justify-between">
              <div class="py-2">投票進度</div>
              <div>{{ progressPercentage }}%</div>
            </div>
            <div class="relative w-full h-2 rounded-full bg-gray-4">
              <div class="h-2 rounded-full bg-primary" :style="{ width: progressPercentage + '%' }"></div>
            </div>
          </li>
        </ul>
        <div class="flex items-center py-6">
          <div :style="{ backgroundImage:'url('+thisPollData.createdBy?.avatar+')'}" class="w-8 h-8 bg-cover rounded-full"></div>
          <p class="pl-3 pr-4 font-medium" :data-userId="thisPollData.createdBy?.id">{{ thisPollData.createdBy?.name }}</p>
          <div class="px-3 py-1 border-2 rounded-full border-gray-2 text-gray-2">發起人</div>
        </div>
        <ul class="flex flex-col gap-3">
          <li v-for="(option, idx) in thisPollData.options" :key="option.id"
           >
            <div class="relative flex items-center p-3 border-2 overflow-clip rounded-3xl border-gray-3"
            :class="{ 'border-primary': isSelectedRadio(option.id) }">
              <input type="radio" :disabled="!isCanVoting || thisPollData.status !== 'active' || isVoted(option.voters)"  name="flexRadioDefault" :value="option.id" :id="'flexCheckDefault'+idx" class="focus:ring-primary text-primary" v-model="selectedRadio">
              <label :for="'flexCheckDefault'+idx" class="flex items-center justify-between w-full gap-3">
                <p class="flex-grow pl-3"><span class="pr-2">{{ idx+1 }}.</span>{{ option.title }}</p><p class="flex-shrink-0 text-gray-2" >{{option.voters.length}} 票</p>
              </label>
              <div v-if="option.voters.length>0" class="absolute inset-y-0 right-0 z-[-1] w-[105%] h-[105%] origin-right transition duration-300 ease-in-out"
              :class="( option.voters.length / thisPollData.totalVoters )*100 >= 50 && ( option.voters.length / thisPollData.totalVoters )*100 < 80 ? 'bg-primary-light' : ( option.voters.length / thisPollData.totalVoters )*100 >= 80 ? 'bg-primary-dark' : 'bg-gray-4'"
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
          <button @click="share" class="w-10 h-10 rounded-full bg-gray-4" type="button"><i class="bi bi-link"></i></button>
          <button v-if="thisPollData.status==='active'" type="button" @click="doVoting(selectedRadio)" class="px-6 py-2 text-white transition bg-black border-2 rounded-full hover:border-gray-2 hover:bg-gray-2 grow">
            {{ doNotVotingText }}
          </button>
          <button v-else type="button" @click="isEndVotingMessage" class="px-6 py-2 text-white transition bg-black border-2 rounded-full hover:border-gray-2 hover:bg-gray-2 grow">
            投票已結束
          </button>
        </div>

      </section>
    </div>
    <CommentComponent
    :pollId="pollId" :memberName="memberName" :memberImg="memberImg" :memberId="memberId" :isLogin="isLogin" />

  </main>
</template>
<script>
import {
  computed,
  onMounted, ref, watch,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import CommentComponent from '@/components/CommentComponent.vue';
import { useMemberStore } from '@/stores/member';
import { useMessageStore } from '@/stores/message';
import { getCookie, turnDate } from '@/utils';
import 'swiper/css';
import 'swiper/css/pagination';

export default {
  components: {
    Swiper,
    SwiperSlide,
    CommentComponent,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const pollId = route.params.id;
    const memberStore = useMemberStore();
    const message = useMessageStore();
    const bgImg = 'url("/images/bg-01.svg")';
    const bgPersonImg = 'url("/images/loginCover.png")';

    const isLogin = ref(memberStore.isLogin);
    const memberId = ref(memberStore.member.id);
    const memberName = ref(memberStore.member.name);
    const memberImg = ref(memberStore.member.avatar);
    const selectedRadio = ref(null);
    const widthIsShow = true;
    const isCanVoting = ref(false);
    const doNotVotingText = ref('');
    const thisPollData = ref([]);
    const votedAll = ref(false);

    const progressPercentage = computed(() => {
      if (thisPollData.value.endDate === null) {
        return 0;
      }
      const start = new Date(thisPollData.value.startDate).getTime();
      const end = new Date(thisPollData.value.endDate).getTime();
      const now = new Date().getTime();
      const progress = ((now - start) / (end - start)) * 100;
      return Math.min(Math.max(progress, 0), 100).toFixed(2);
    });

    function share() {
      const url = window.location.href;
      navigator.clipboard.writeText(url)
        .then(() => {
          message.setMessage({
            message: '已複製',
          });
          message.showToast(true, 'success');
        })
        .catch((error) => {
          message.setMessage({
            title: '複製失敗',
            message: error,
          });
          message.showToast(true, 'error');
        });
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
          if (user.user.id === memberId.value) {
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
        message.setMessage({
          message: error.response.data.message,
        });
        message.showToast(true, 'error');
      }
    }

    function isVoted(voters) {
      const isMe = voters.filter((userId) => {
        return userId.user.id === memberId.value;
      });
      if (isMe.length > 0) {
        return true;
      }
      return false;
    }
    function doVoting(id) {
      if (isLogin.value === false) {
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

    watch(() => memberStore, (newVal) => {
      isLogin.value = newVal.isLogin;
      memberId.value = newVal.member.id;
      memberName.value = newVal.member.name;
      memberImg.value = newVal.member.avatar;
    });

    onMounted(() => {
      if (isLogin.value) {
        doNotVotingText.value = '送出投票';
        isCanVoting.value = true;
      } else {
        doNotVotingText.value = '登入後即可投票';
      }
      fetchPollData();
    });

    return {
      bgPersonImg,
      selectedRadio,
      modules: [Autoplay, Pagination],
      widthIsShow,
      bgImg,
      isSelectedRadio,
      thisPollData,
      isCanVoting,
      doNotVotingText,
      doVoting,
      isEndVotingMessage,
      memberId,
      pollId,
      isVoted,
      memberName,
      memberImg,
      isLogin,
      turnDate,
      share,
      progressPercentage,
    };
  },
};
</script>
