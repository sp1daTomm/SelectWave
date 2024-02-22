<script type="module">
import { Swiper, SwiperSlide } from 'swiper/vue';
import NavBar from '../components/NavbarEl.vue';
import GoTop from '../components/TopGoEl.vue';
// import PageFooter from '../components/ComponentFooter.vue';
import 'swiper/css';

export default {
  components: {
    NavBar,
    GoTop,
    // PageFooter,
    Swiper,
    SwiperSlide,
  },
  setup() {
    const onSwiper = (swiper) => {
      console.log(swiper);
    };
    const onSlideChange = () => {};
    return {
      onSwiper,
      onSlideChange,
    };
  },
  data() {
    return {
      currentCardIndex: 0,
      myCards: [
        {
          id: 1,
          image: '/src/assets/vote 01.png',
          deadline: '2024-03-10',
          title: '最喜歡的電視節目',
          description:
            'luptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.',
          tags: ['p', 't', 'e'],
          voteQty: '3000',
        },
        {
          id: 2,
          image: '/src/assets/vote 05.png',
          deadline: '2024-03-10',
          title: '最喜歡的食物',
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores ipsum iure nostrum exercitationem.',
          tags: ['s', 'r', 'i'],
          voteQty: '3000',
        },
        {
          id: 3,
          image: '/src/assets/vote 06.png',
          deadline: '2024-03-10',
          title: '最想去的國家',
          description:
            'Cupiditate voluptates animi is culpa perferendis reprehenderit assumenda.',
          tags: ['m', 'o', 'n'],
          voteQty: '3000',
        },
        {
          id: 4,
          image: '/src/assets/vote 07.png',
          deadline: '2024-03-10',
          title: '最喜歡的飲料',
          description:
            'Cupiditate voluptates animi is culpa perferendis reprehenderit assumenda.',
          tags: ['m', 'o', 'n'],
          voteQty: '3000',
        },
        {
          id: 5,
          image: 'image5.jpg',
          deadline: '2024-03-10',
          title: '最喜歡的飲料店',
          description:
            'Cupiditate voluptates animi is culpa perferendis reprehenderit assumenda.',
          tags: ['m', 'o', 'n'],
          voteQty: '3000',
        },
      ],
      allCards: [
        {
          id: 1,
          image: '/src/assets/vote 04.png',
          title: '喜歡狗還是貓',
          description:
            'luptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.',
          tags: ['p', 't', 'e'],
          voteQty: '3000',
        },
        {
          id: 2,
          image: '/src/assets/vote 08.png',
          title: '更喜歡健身房還是戶外運動',
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores ipsum iure nostrum exercitationem.',
          tags: ['s', 'r', 'i'],
          voteQty: '3000',
        },
        {
          id: 3,
          image: '/src/assets/vote 09.png',
          title: '喜歡使用 Instagram還是 Twitter',
          description:
            'Cupiditate voluptates animi blanditiis error! Beatae, ullam commodi officiis culpa perferendis reprehenderit assumenda.',
          tags: ['m', 'o', 'n'],
          voteQty: '3000',
        },
        {
          id: 4,
          image: '/src/assets/vote 10.png',
          title: '想要什麼超能力',
          description:
            'Consectetur adipisicing elit. Dolores ipsum iure nostrum exercitationem.',
          tags: ['w', 'a', 'r'],
          voteQty: '3000',
        },
        {
          id: 5,
          image: '/src/assets/vote 11.png',
          title: '喜歡的音樂風格',
          description:
            'Adipisicing elit. Dolores ipsum iure nostrum exercitationem.',
          tags: ['b', 'r', 'i'],
          voteQty: '3000',
        },
        {
          id: 6,
          image: '/src/assets/vote 12.png',
          title: '喜歡咖啡還是茶',
          description: 'Dolores ipsum iure nostrum exercitationem.',
          tags: ['d', 'e', 'e'],
          voteQty: '3000',
        },
        {
          id: 7,
          image: '/src/assets/vote 13.png',
          title: '喜歡在週末做什麼',
          description: 'Dolores ipsum iure nostrum exercitationem.',
          tags: ['d', 'e', 'e'],
          voteQty: '3000',
        },
        {
          id: 8,
          image: '/src/assets/vote 14.png',
          title: '戶外活動還是宅在家',
          description: 'Dolores ipsum iure nostrum exercitationem.',
          tags: ['d', 'e', 'e'],
          voteQty: '3000',
        },
        {
          id: 9,
          image: '/src/assets/vote 15.png',
          title: '最喜歡的電影',
          description: 'Dolores ipsum iure nostrum exercitationem.',
          tags: ['d', 'e', 'e'],
          voteQty: '3000',
        },
        {
          id: 10,
          image: '/src/assets/vote 16.png',
          title: '最喜歡的旅遊景點',
          description: 'Dolores ipsum iure nostrum exercitationem.',
          tags: ['d', 'e', 'e'],
          voteQty: '3000',
        },
        {
          id: 11,
          image: '/src/assets/vote 17.png',
          title: '最喜歡的國家',
          description: 'Dolores ipsum iure nostrum exercitationem.',
          tags: ['d', 'e', 'e'],
          voteQty: '3000',
        },
        {
          id: 12,
          image: '/src/assets/vote 18.png',
          title: '最喜歡的動漫角色',
          description: 'Dolores ipsum iure nostrum exercitationem.',
          tags: ['d', 'e', 'e'],
          voteQty: '3000',
        },
      ],
      currentDate: new Date(),
    };
  },
  methods: {
    prevSlide() {
      this.$refs.swiper.swiper.slidePrev();
    },
    nextSlide() {
      this.$refs.swiper.swiper.slideNext();
    },
    formatDeadline(deadline) {
      const formattedDate = new Date(deadline);
      const year = formattedDate.getFullYear();
      const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
      const day = formattedDate.getDate().toString().padStart(2, '0');
      return `${year}/${month}/${day}`;
    },
  },
  mounted() {
    console.log(this.$refs.swiper);
  },
};
</script>
<template>
  <NavBar />
  <div class="container flex justify-center">
    <div class="pull-content m-auto">
      <div>
        <filter></filter>
        <serch></serch>
      </div>
      <div class="container-my">
        <div class="title">我的投票</div>
        <div class="swiper-button-prev prev-left">
          <img src="../assets/arrow.png" alt="Icon" />
        </div>
        <div class="swiper-button-next prev-right">
          <img src="../assets/arrow-2.png" alt="Icon" />
        </div>
        <swiper
          :slides-per-view="4"
          :space-between="50"
          @swiper="onSwiper"
          @slideChange="onSlideChange"
          :pagination="{ clickable: true }"
          :navigation="{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }"
        >
          <swiper-slide v-for="card in myCards" :key="card.id">
            <div class="max-w-sm overflow-hidden shadow-lg rounded-3xl flex flex-wrap">
              <img :src="card.image" class="w-full img-size" alt="Card Image" />
              <div class="card-container relative">
                <p class="card-deadline absolute bottom-3 left-7 text-white">
                  {{ formatDeadline(myCards[currentCardIndex].deadline) }}止
                </p>
              </div>
              <div class="px-6 py-4">
                <div class="font-bold text-xl mb-2">{{ card.title }}</div>
              </div>
              <div class="px-6 pt-4 pb-2">
                <span
                  class="inline-block bg-gray-200 rounded-full px-3 py-1 text-gray-700 mr-2 mb-2"
                >
                  已有{{ card.voteQty }}人投票
                </span>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>

      <!-- <div class="create-my-vote hidden">
      </div> -->
      <div>
        <div class="title">全部投票</div>
        <div class="all-card mx-auto">
          <div class="flex flex-row container-all">
            <div class="flex flex-row flex-wrap justify-between">
              <div
                v-for="card in allCards"
                :key="card.id"
                class="w-full card-size mb-12"
              >
                <div
                  class="max-w-sm overflow-hidden shadow-lg rounded-3xl"
                >
                  <img
                    :src="card.image"
                    class="w-full img-size"
                    alt="image"
                  />
                  <div class="card-container relative">
                    <p
                      class="card-deadline absolute bottom-3 left-7 text-white"
                    >
                      {{ formatDeadline(myCards[currentCardIndex].deadline) }}止
                    </p>
                  </div>
                  <div class="px-6 py-4">
                    <div class="font-bold text-xl mb-2 h-12">{{ card.title }}</div>
                    <p class="text-gray-700 text-base"></p>
                  </div>
                  <div class="px-6 pt-4 pb-2">
                    <span
                      class="inline-block bg-gray-200 rounded-full px-3 py-1 text-gray-700 mr-2 mb-2"
                      >已有{{ card.voteQty }}人投票
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-container flex justify-center pt-3">
        <GoTop />
      </div>
    </div>
  </div>
  <PageFooter />
</template>

<style scoped>
* {
  box-sizing: border-box;
}
.container {
  width: 1920px;
}
.pull-content {
  width: 1341px;
}
.title {
  font-size: 32px;
}
.container-my {
  width: 1341px;
  position: relative;
}
.prev-left {
  position: absolute;
  left: -50px;
  top: 140px;
}
.prev-right {
  position: absolute;
  right: -50px;
  top: 140px;
}
.container-all {
  width: 1341px;
}
/* .my-card {
  } */
/* .all-card {
  } */
.card-size {
  width: 306px;
  height: 358px;
}
.img-size {
  height: 230px;
  width: 306px;
  background-color: #fcb738;
}
/* .card-style {
  } */
.add-box {
  background-color: #fff4e0;
}
.add-group {
  left: 130px;
  top: 130px;
}
/* .pagination-container {
  } */
@media screen and (max-width: 768px) {
}
@media screen and (min-width: 769px) {
}
</style>
