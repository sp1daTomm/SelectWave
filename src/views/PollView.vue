<script type="module">
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

export default {
  components: {
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
          image: '/src/assets/vote 07.png',
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
      isDropdownOpen: false,
      selectedOption: '最熱門',
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
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    selectOption(option) {
      this.selectedOption = option;
      this.isDropdownOpen = false;
    },
  },
  mounted() {
    console.log(this.$refs.swiper);
  },
};
</script>
<template>
  <div class="container flex justify-center">
    <div class="pull-content m-auto">
      <div>
        <filter></filter>
        <serch></serch>
      </div>
      <div class="container-my">
        <div class="flex flex-row justify-between">
          <div class="title font-bold text-2xl">我的投票</div>
          <div class="button-group flex flex-row flex-nowrap">
            <button class="h-10 w-30 rounded-md pull-manage px-4 py-2">
              投票管理
              <i class="bi bi-arrow-right"></i>
            </button>
            <button class="h-10 w-30 rounded-md ml-4 create-pull px-4 py-2">
              建立投票
              <i class="bi bi-plus-lg"></i>
            </button>
          </div>
        </div>
        <div class="swiper-button-prev prev-left">
          <img src="../assets/arrow.png" alt="Icon" />
        </div>
        <div class="swiper-button-next prev-right">
          <img src="../assets/arrow-2.png" alt="Icon" />
        </div>
        <swiper
          :slides-per-view="4"
          :space-between="24"
          :loop="true"
          @swiper="onSwiper"
          @slideChange="onSlideChange"
          :pagination="{ clickable: true }"
          :navigation="{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }"
        >
          <swiper-slide
            v-for="card in myCards"
            :key="card.id"
            class="card-size"
          >
            <div
              class="max-w-sm overflow-hidden border-2 border-gray-300 rounded-3xl flex flex-wrap bg-white"
            >
              <img :src="card.image" class="w-full img-size" alt="Card Image" />
              <div class="card-container relative">
                <div
                  class="card-more absolute px-1 z-50 right-2 top-2 rounded-md transition-colors duration-300"
                >
                  <i class="bi bi-three-dots dot-icon"></i>
                </div>
                <p class="card-deadline absolute bottom-3 left-7 text-white">
                  {{ formatDeadline(myCards[currentCardIndex].deadline) }}止
                </p>
                <!-- <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent h-115"></div> -->
              </div>
              <div class="px-6 py-4">
                <div class="font-bold text-xl mb-2">{{ card.title }}</div>
              </div>
              <div class="px-6 pt-4 pb-2">
                <span
                  class="inline-block rounded-full px-3 py-1 text-gray-500 -m-3 mb-2"
                >
                  已有{{ card.voteQty }}人投票
                </span>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <!-- <div class="relative">
        <img src="../assets/bg.png" class="absolute bottom-6 -z-50 w-screen screen-img" alt="image" />
      </div> -->
      <!-- <div class="create-my-vote hidden">
      </div> -->
      <div class="container-all">
        <div class="flex flex-row justify-between">
          <div class="title title-all font-bold text-2xl">所有投票</div>
          <div>
            <div class="flex flex-row flex-nowrap">
              <div class="relative inline-block mt-20">
                <button
                  @click="toggleDropdown"
                  class="drop-down bg-white px-4 py-2 rounded-lg cursor-pointer flex flex-row"
                >
                  {{ selectedOption }}
                  <i class="bi bi-chevron-down pl-1"></i>
                </button>
                <div
                  :class="{ hidden: !isDropdownOpen }"
                  id="myDropdown"
                  class="absolute mt-2 w-32 bg-white rounded-2xl shadow-lg -left-2"
                >
                  <div class="flex flex-col items-center text-center px-3 py-3">
                    <a
                      href="#home"
                      class="w-28 px-4 py-2 drop-item rounded-2xl hover:bg-primary-light hover:text-primary-dark"
                      @click.prevent="selectOption('最熱門')"
                      >最熱門</a
                    >
                    <a
                      href="#about"
                      class="w-28 px-4 py-2 drop-item rounded-2xl hover:bg-primary-light hover:text-primary-dark"
                      @click.prevent="selectOption('新到舊')"
                      >新到舊</a
                    >
                    <a
                      href="#contact"
                      class="w-28 px-4 py-2 drop-item rounded-2xl hover:bg-primary-light hover:text-primary-dark"
                      @click.prevent="selectOption('舊到新')"
                      >舊到新</a
                    >
                  </div>
                </div>
              </div>
              <div class="search-bar flex justify-center items-end ml-4 py-1">
                <div class="relative">
                  <input
                    type="text"
                    class="search-input rounded z-0 focus:shadow focus:outline-none px-4"
                    placeholder="搜尋投票"
                  />
                  <div class="absolute top-2 right-4">
                    <i
                      class="fa fa-search text-gray-500 z-20 hover:text-gray-500 bi bi-search"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="all-card mx-auto">
          <div class="flex flex-row container-all">
            <div class="flex flex-row flex-wrap justify-between">
              <div
                v-for="card in allCards"
                :key="card.id"
                class="w-full card-size mb-12"
              >
                <div
                  class="max-w-sm border-2 border-gray-300 rounded-3xl overflow-hidden"
                >
                  <img :src="card.image" class="w-full img-size" alt="image" />
                  <div class="card-container relative">
                    <p
                      class="card-deadline absolute bottom-3 left-7 text-white"
                    >
                      {{ formatDeadline(myCards[currentCardIndex].deadline) }}止
                    </p>
                  </div>
                  <div class="px-6 pt-4">
                    <div class="font-bold text-xl mb-2 h-12">
                      {{ card.title }}
                    </div>
                    <p class="text-gray-700 text-base"></p>
                  </div>
                  <div class="px-6 pt-2 pb-2">
                    <span
                      class="inline-block rounded-full py-1 text-gray-500 pr-3 mb-2"
                      >已有{{ card.voteQty }}人投票
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="paginate">
        <ul
          class="inline-flex -space-x-px text-base h-10 w-full justify-center"
        >
          <li>
            <a
              href="#"
              class="pagination-w flex items-center justify-center p-2.5 leading-tight text-gray-1 bg-white border border-gray-4 rounded-lg hover:bg-primary-light hover:text-primary-dark mr-1.5"
            >
              <span class="sr-only">回到第一頁</span>
              <i class="bi bi-chevron-double-left"></i>
            </a>
          </li>
          <li>
            <a
              href="#"
              class="pagination-w flex items-center justify-center p-2.5 leading-tight text-gray-1 bg-white border border-gray-4 rounded-lg hover:bg-primary-light hover:text-primary-dark mr-1.5"
            >
              <span class="sr-only">Previous</span>
              <i class="bi bi-chevron-left"></i>
            </a>
          </li>
          <li>
            <a
              href="#"
              class="pagination-w flex items-center justify-center p-2 leading-tight text-gray-1 bg-white border border-gray-4 rounded-lg hover:bg-primary-light hover:text-primary-dark mr-1.5"
            >
              1
            </a>
          </li>
          <li>
            <a
              href="#"
              class="pagination-w flex items-center justify-center p-2 leading-tight text-gray-1 bg-white border border-gray-4 rounded-lg hover:bg-primary-light hover:text-primary-dark mr-1.5"
            >
              2
            </a>
          </li>
          <li>
            <a
              href="#"
              class="pagination-w flex items-center justify-center p-2 leading-tight text-gray-1 bg-white border border-gray-4 rounded-lg hover:bg-primary-light hover:text-primary-dark mr-1.5"
            >
              3
            </a>
          </li>
          <li>
            <a
              href="#"
              class="pagination-w flex items-center justify-center p-2 leading-tight text-gray-1 bg-white border border-gray-4 rounded-lg hover:bg-primary-light hover:text-primary-dark mr-1.5"
            >
              10
            </a>
          </li>
          <li>
            <a
              href="#"
              class="pagination-w flex items-center justify-center p-2.5 leading-tight text-gray-1 bg-white hover:bg-primary-light rounded-lg hover:text-primary-dark mr-1.5"
            >
              <span class="sr-only">...</span>
              <i class="bi bi-three-dots"></i>
            </a>
          </li>
          <li>
            <a
              href="#"
              class="pagination-w flex items-center justify-center p-2.5 leading-tight text-gray-1 bg-white border border-gray-4 rounded-lg hover:bg-primary-light hover:text-primary-dark mr-1.5"
            >
              <span class="sr-only">Next</span>
              <i class="bi bi-chevron-right"></i>
            </a>
          </li>
          <li>
            <a
              href="#"
              class="pagination-w flex items-center justify-center p-2.5 leading-tight text-gray-1 bg-white border border-gray-4 rounded-lg hover:bg-primary-light hover:text-primary-dark"
            >
              <span class="sr-only">到最後一頁</span>
              <i class="bi bi-chevron-double-right"></i>
            </a>
          </li>
        </ul>
      </div>
      <!-- <div class="pagination-container flex flex-row justify-center pt-3">
        <i class="bi bi-chevron-double-left"></i>
        <i class="bi bi-chevron-left"></i>
        123
        <i class="bi bi-three-dots"></i>
        10
        <i class="bi bi-chevron-right"></i>
        <i class="bi bi-chevron-double-right"></i>
      </div> -->
    </div>
  </div>
  <div class="relative">
    <img
      src="../assets/bg.png"
      class="absolute -z-50 w-screen screen-img"
      alt="image"
    />
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}
.container {
  width: 1920px;
}
.pull-content {
  width: 1296px;
}
.title {
  font-size: 32px;
  margin-bottom: 32px;
}
.card-more {
  background-color: #1e1e1e;
  opacity: 80%;
}
.card-more:hover {
  background-color: #f49e00;
}
.dot-icon {
  color: #ffffff;
}
.paginate {
  margin-bottom: 120px;
}
/* .pagina {
  padding: 10px;
} */
.pull-manage {
  color: #1e1e1e;
  font-size: 16px;
  background-color: #f5f5f5;
}
.create-pull {
  color: #1e1e1e;
  font-size: 16px;
  background-color: #fff4e0;
}
.screen-img {
  bottom: 1520px;
  z-index: -10;
}
.title-all {
  margin-top: 80px;
}
.search-input {
  width: 306px;
  height: 40px;
  border: none;
  background-color: #f5f5f5;
}
.drop-down {
  color: #fcb738;
  border: 2px solid #fcb738;
}
#myDropDown {
  right: 100px;
}
.drop-item {
  color: #1e1e1e;
}
.container-my {
  width: 1296px;
  position: relative;
  padding-top: 80px;
  padding-bottom: 80px;
}
.prev-left {
  position: absolute;
  left: -50px;
  top: 290px;
}
.prev-right {
  position: absolute;
  right: -50px;
  top: 290px;
}
.container-all {
  width: 1296px;
}
/* .my-card {
  } */
/* .all-card {
  } */
.card-size {
  width: 306px;
}
.img-size {
  height: 226px;
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
@media screen and (max-width: 768px) {
}
@media screen and (min-width: 769px) {
}
</style>
