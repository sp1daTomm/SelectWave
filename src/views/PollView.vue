<script type="module">
import { ref } from 'vue';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    const navigation = ref({
      nextEl: '#swiper-btn-next',
      prevEl: '#swiper-btn-prev',
    });
    return {
      navigation,
      modules: [Navigation],
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
  },
};
</script>
<template>
  <section class="relative">
    <div class="container flex flex-col gap-6 pt-6 pb-12 md:py-20 md:gap-8">
      <div class="flex flex-col justify-between md:items-center md:flex-row">
        <div class="text-2xl font-bold md:text-3xl">我的投票</div>
        <div class="flex flex-row w-full button-group flex-nowrap md:w-auto">
          <button class="h-10 px-4 py-2 rounded-md text-gray-1 bg-gray-4">
            投票管理
            <i class="bi bi-arrow-right"></i>
          </button>
          <button class="h-10 px-4 py-2 ml-4 rounded-md text-gray-1 bg-primary-light">
            建立投票
            <i class="bi bi-plus-lg"></i>
          </button>
        </div>
      </div>
      <div class="relative">
        <swiper :slides-per-view="4" :space-between="24" :loop="true" :modules="modules"
                :navigation="navigation">
          <swiper-slide v-for="card in myCards" :key="card.id">
            <div
                 class="relative flex flex-col overflow-hidden bg-white border-2 border-gray-300 rounded-3xl">
              <div class="relative">
                <img :src="card.image" class="object-cover" alt="Card Image" />
                <div
                     class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <p class="absolute text-sm leading-normal text-white bottom-3 left-3">
                  {{ formatDeadline(myCards[ currentCardIndex ].deadline) }}止
                </p>
              </div>
              <div
                   class="absolute z-50 px-1 transition-colors duration-300 rounded-md card-more right-2 top-2">
                <i class="bi bi-three-dots dot-icon" />
              </div>
              <div class="flex flex-col">
                <div class="px-6 py-4">
                  <div class="mb-2 font-medium md:leading-6 md:text-xl">{{ card.title }}</div>
                </div>
                <div class="px-6 pt-4 pb-2">
                  <span class="inline-block px-3 py-1 mb-2 -m-3 text-gray-500 rounded-full text-sm leading-[1.2]">
                    已有{{ card.voteQty }}人投票
                  </span>
                </div>
              </div>
            </div>
          </swiper-slide>
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
      </div>
    </div>
    <img src="../assets/bg.png" class="absolute bottom-0 w-full -z-10" alt="image" />
  </section>
  <section class="container flex flex-col pt-6 pb-12 gap-6 md:pt-20 md:pb-[7.5rem] md:gap-8">
    <div class="flex flex-col justify-between md:items-center md:flex-row">
      <div class="text-2xl font-bold md:text-3xl">所有投票</div>
      <div class="flex flex-row items-center gap-4 flex-nowrap">
        <div class="relative inline-block">
          <button @click="toggleDropdown"
                  class="flex flex-row px-4 py-2 bg-white border-2 rounded-lg cursor-pointer text-primary border-primary">
            {{ selectedOption }}
            <i class="pl-1 bi bi-chevron-down"></i>
          </button>
          <div :class="{ hidden: !isDropdownOpen }" id="myDropdown"
               class="absolute z-10 w-32 mt-2 bg-white shadow-lg rounded-2xl -left-2">
            <div class="flex flex-col items-center px-3 py-3 text-center">
              <a href="#home"
                 class="px-4 py-2 w-28 text-gray-1 rounded-2xl hover:bg-primary-light hover:text-primary-dark"
                 @click.prevent="selectOption('最熱門')">最熱門</a>
              <a href="#about"
                 class="px-4 py-2 w-28 text-gray-1 rounded-2xl hover:bg-primary-light hover:text-primary-dark"
                 @click.prevent="selectOption('新到舊')">新到舊</a>
              <a href="#contact"
                 class="px-4 py-2 w-28 text-gray-1 rounded-2xl hover:bg-primary-light hover:text-primary-dark"
                 @click.prevent="selectOption('舊到新')">舊到新</a>
            </div>
          </div>
        </div>
        <div class="flex items-end justify-center search-bar">
          <div class="relative">
            <input type="text" class="z-0 px-4 rounded search-input focus:shadow focus:outline-none"
                   placeholder="搜尋投票" />
            <div class="absolute top-2 right-4">
              <i class="z-20 text-gray-500 fa fa-search hover:text-gray-500 bi bi-search"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
         class="grid grid-cols-2 gap-x-3 gap-y-6 md:gap-x-6 md:gap-y-12 md:grid-cols-4">
        <div v-for="card in allCards" :key="card.id"
             class="relative flex flex-col h-full overflow-hidden bg-white border-2 border-gray-300 rounded-3xl">
          <div class="relative">
            <img :src="card.image" class="object-cover w-full min-h-60" alt="Card Image" />
            <div
                 class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <p class="absolute text-white bottom-3 left-3">
              {{ formatDeadline(myCards[ currentCardIndex ].deadline) }}止
            </p>
          </div>
          <div class="flex flex-col justify-between h-full p-4 pt-3 md:pt-5 md:p-6">
            <h3 class="mb-2 font-medium">{{ card.title }}</h3>
            <p class="inline-block px-3 py-1 mb-2 -m-3 text-gray-500 rounded-full">
              已有{{ card.voteQty }}人投票
            </p>
          </div>
        </div>
    </div>
      <ul class="inline-flex justify-center w-full h-10 -space-x-px text-base">
        <li>
          <a href="#"
             class="pagination-w flex items-center justify-center p-2.5 leading-tight text-gray-1 bg-white border border-gray-4 rounded-lg hover:bg-primary-light hover:text-primary-dark mr-1.5">
            <span class="sr-only">回到第一頁</span>
            <i class="bi bi-chevron-double-left"></i>
          </a>
        </li>
        <li>
          <a href="#"
             class="pagination-w flex items-center justify-center p-2.5 leading-tight text-gray-1 bg-white border border-gray-4 rounded-lg hover:bg-primary-light hover:text-primary-dark mr-1.5">
            <span class="sr-only">Previous</span>
            <i class="bi bi-chevron-left"></i>
          </a>
        </li>
        <li>
          <a href="#"
             class="pagination-w flex items-center justify-center p-2 leading-tight text-gray-1 bg-white border border-gray-4 rounded-lg hover:bg-primary-light hover:text-primary-dark mr-1.5">
            1
          </a>
        </li>
        <li>
          <a href="#"
             class="pagination-w flex items-center justify-center p-2 leading-tight text-gray-1 bg-white border border-gray-4 rounded-lg hover:bg-primary-light hover:text-primary-dark mr-1.5">
            2
          </a>
        </li>
        <li>
          <a href="#"
             class="pagination-w flex items-center justify-center p-2 leading-tight text-gray-1 bg-white border border-gray-4 rounded-lg hover:bg-primary-light hover:text-primary-dark mr-1.5">
            3
          </a>
        </li>
        <li>
          <a href="#"
             class="pagination-w flex items-center justify-center p-2 leading-tight text-gray-1 bg-white border border-gray-4 rounded-lg hover:bg-primary-light hover:text-primary-dark mr-1.5">
            10
          </a>
        </li>
        <li>
          <a href="#"
             class="pagination-w flex items-center justify-center p-2.5 leading-tight text-gray-1 bg-white hover:bg-primary-light rounded-lg hover:text-primary-dark mr-1.5">
            <span class="sr-only">...</span>
            <i class="bi bi-three-dots"></i>
          </a>
        </li>
        <li>
          <a href="#"
             class="pagination-w flex items-center justify-center p-2.5 leading-tight text-gray-1 bg-white border border-gray-4 rounded-lg hover:bg-primary-light hover:text-primary-dark mr-1.5">
            <span class="sr-only">Next</span>
            <i class="bi bi-chevron-right"></i>
          </a>
        </li>
        <li>
          <a href="#"
             class="pagination-w flex items-center justify-center p-2.5 leading-tight text-gray-1 bg-white border border-gray-4 rounded-lg hover:bg-primary-light hover:text-primary-dark">
            <span class="sr-only">到最後一頁</span>
            <i class="bi bi-chevron-double-right"></i>
          </a>
        </li>
      </ul>
  </section>
</template>

<style scoped>
</style>
