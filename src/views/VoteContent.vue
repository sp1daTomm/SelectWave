<style>
.swiper-pagination-bullet-active{
  background-color: #F49E00;
}

</style>
<template>
  <main>
    <section class="relative max-w-screen-lg mx-auto px-6 py-5">
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
      <swiper-slide v-for="card in myCards" :key="card.id">
            <div class="relative flex flex-col overflow-hidden rounded-3xl">
              <div>
                <div :data-test="card.image" v-bind:style="{ backgroundImage:card.image }"
                class=" bg-cover rounded-3xl pb-[70%] relative">
                  <p class="text-white p-4 absolute bottom-0 drop-shadow-md">{{ card.title }}</p>
                </div>
              </div>
            </div>
          </swiper-slide>
          <div class="h-10"></div>
      </swiper>
      <button type="button" id="swiper-btn-prev"
                class="absolute hidden -translate-x-full -translate-y-1/2 md:block -left-6 top-1/2">
          <i
             class="text-3xl transition duration-150 text-gray-2 bi bi-arrow-left-circle hover:text-primary" />
        </button>
        <button type="button" id="swiper-btn-next"
                class="absolute hidden translate-x-full -translate-y-1/2 md:block -right-6 top-1/2">
          <i
             class="text-3xl transition duration-150 text-gray-2 bi bi-arrow-right-circle hover:text-primary" />
        </button>
        <div class="absolute mx-3 left-0 right-0 bottom-3 top-10 bg-primary-light rounded-2xl"></div>
    </section>

    <section class="py-8 md:py-20 max-w-screen-lg mx-auto px-3">
      <h1 class="text-2xl md:text-3xl leading-normal font-semibold">輕鬆建立投票所，讓您的聲音成為力量。</h1>
      <p class="md:text-xl text-gray-2 py-3">目前電視節目玲琅滿目，你最喜歡哪一台呢？</p>
      <ul class="flex gap-3 flex-wrap">
        <li><span class="text-primary pr-1 font-bold">#</span>公開投票</li>
        <li><span class="text-primary pr-1 font-bold">#</span>標籤01</li>
        <li><span class="text-primary pr-1 font-bold">#</span>標籤02</li>
        <li><span class="text-primary pr-1 font-bold">#</span>標籤03</li>
      </ul>
      <div class="flex items-center py-6">
        <div :style="{ backgroundImage:bgPersonImg}" class="w-8 h-8 rounded-full bg-cover"></div>
        <p class="pl-3 pr-4 font-medium">王小明</p>
        <div class="px-3 py-1 border-gray-2 border rounded-full border-2 text-gray-2">發起人</div>
      </div>
      <ul class="flex flex-col gap-3">
        <li class="flex items-center border rounded-3xl border-2 border-gray-3 p-3 relative">
          <input type="radio" name="flexRadioDefault" value="a" id="flexCheckDefault01" class="focus:ring-primary text-primary" v-model="selectedRadio">
          <label for="flexCheckDefault01" class="flex items-center justify-between w-full gap-3" :class="selectedRadio === 'a' ? 'red' : 'nonee'">
            <p class="pl-3 flex-grow">a.晚間新聞</p><p class="text-gray-2 flex-shrink-0" :class="{'text-amber-600': selectedRadio === 'a'}">38票</p>
          </label>
          <div class="absolute bg-gray-4 inset-y-0 right-0 left-[62%] z-[-1] rounded-r-3xl"
          :class="radioClass">
          </div>
        </li>
        <li class="flex items-center border rounded-3xl border-2 border-gray-3 p-3 relative">
          <input type="radio" name="flexRadioDefault" value="b" id="flexCheckDefault02" class="focus:ring-primary text-primary" v-model="selectedRadio">
          <label for="flexCheckDefault02" class="flex items-center justify-between w-full gap-3"  :class="selectedRadio === 'b' ? 'red' : 'nonee'">
            <p class="pl-3 flex-grow">b.晚間新聞</p><p class="text-gray-2 flex-shrink-0" :class="{'text-amber-600': selectedRadio === 'a'}">38票</p>
          </label>
          <div class="absolute bg-gray-4 inset-y-0 right-0 left-[62%] z-[-1] rounded-r-3xl">
          </div>
        </li>
      </ul>
      {{ selectedRadio }}
    </section>
    <section class="max-w-screen-lg mx-auto px-3 flex gap-4">
      <button class="w-10 h-10 bg-gray-4 rounded-full" type="button"><i class="bi bi-link"></i></button>
      <button type="button" class="px-6 py-2 border-2 rounded-full bg-black text-white hover:border-gray-2 hover:bg-gray-2 transition grow">送出投票</button>
    </section>
    <section class="max-w-screen-lg mx-auto px-3  gap-4 py-6">
      <div class="flex">
        <div class="flex justify-between w-full items-center">
          <h2 class="text-gray-1 pt-6 pb-4 text-xl md:text-3xl text-center leading-normal font-semibold md:pb-8">討論區</h2>
          <p class="text-gray-1">2則留言</p>
        </div>
      </div>
      <ul class="flex flex-col gap-3">
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
                <div class="flex items-center md:pb-6">
                  <p class="pl-3 pr-4 font-medium">王小明</p>
                  <div class="px-3 py-1 border-gray-2 border rounded-full border-2 text-gray-2 bg-white">發起人</div>
                  <p class="ml-auto text-gray-2">2023/12/31</p>
                </div>
                <p class="py-2 pl-3 leading-normal">我也是！</p>
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

    </section>

  </main>
</template>
<script>
import { ref } from 'vue';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    const show = ref(true);
    const bgPersonImg = 'url("/images/loginCover.png")';
    const selectedRadio = ref(null);
    const replyComment = ref('');
    const messageComment = ref('');
    const widthIsShow = true;
    const navigation = ref({
      nextEl: '#swiper-btn-next',
      prevEl: '#swiper-btn-prev',
    });
    const myCards = [
      {
        id: 1,
        image: 'url("/src/assets/vote 01.png")',
        deadline: '2024-03-10',
        title: '最喜歡的電視節目',
        description:
            'luptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.',
        tags: ['p', 't', 'e'],
        voteQty: '3000',
      },
      {
        id: 2,
        image: 'url("/src/assets/vote 05.png")',
        deadline: '2024-03-10',
        title: '最喜歡的食物',
        description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores ipsum iure nostrum exercitationem.',
        tags: ['s', 'r', 'i'],
        voteQty: '3000',
      },
      {
        id: 3,
        image: 'url("/src/assets/vote 06.png")',
        deadline: '2024-03-10',
        title: '最想去的國家',
        description:
            'Cupiditate voluptates animi is culpa perferendis reprehenderit assumenda.',
        tags: ['m', 'o', 'n'],
        voteQty: '3000',
      },
      {
        id: 4,
        image: 'url("/src/assets/vote 07.png")',
        deadline: '2024-03-10',
        title: '最喜歡的飲料',
        description:
            'Cupiditate voluptates animi is culpa perferendis reprehenderit assumenda.',
        tags: ['m', 'o', 'n'],
        voteQty: '3000',
      },
      {
        id: 5,
        image: 'url("/src/assets/vote 07.png")',
        deadline: '2024-03-10',
        title: '最喜歡的飲料店',
        description:
            'Cupiditate voluptates animi is culpa perferendis reprehenderit assumenda.',
        tags: ['m', 'o', 'n'],
        voteQty: '3000',
      },
    ];
    function formatDeadline(deadline) {
      const formattedDate = new Date(deadline);
      const year = formattedDate.getFullYear();
      const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
      const day = formattedDate.getDate().toString().padStart(2, '0');
      return `${year}/${month}/${day}`;
    }

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

    return {
      show,
      bgPersonImg,
      selectedRadio,
      replyComment,
      messageComment,
      sentComment,
      modules: [Autoplay, Pagination, Navigation],
      widthIsShow,
      navigation,
      myCards,
      formatDeadline,
    };
  },
};
</script>
