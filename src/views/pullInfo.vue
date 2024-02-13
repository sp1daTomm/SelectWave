<template>
  <header></header>
  <div class="container m-auto">
    <!-- <RouterLink to="/"></RouterLink>
    <RouterLink to="/pullInfo"></RouterLink> -->
    <pull>
      <div>
        <filter></filter>
        <serch></serch>
      </div>
      <div class="">
      <div class="flex items-center">
        <div class="title">我的投票</div>
        <div class="ml-4 pt-3">全部</div>
      </div>
        <div class="my-card">
          <div class="flex flex-row  content-center
          justify-between container-my mx-2">
              <div
                v-for="card in myCards"
                :key="card.id"
                class="w-full mb-4
                overflow-hidden card-size card-style"
              >
                <img
                  class="w-full img-size"
                  src=""
                  alt="Sunset in the mountains"
                />
                <div class="px-6 py-4">
                  <div class="font-bold text-xl mb-2">{{ card.title }}</div>
                  <p class="text-gray-700 text-base">{{ card.description }}</p>
                </div>
                <div class="px-6 pt-4 pb-2">
                  <span
                    v-for="tag in card.tags"
                    :key="tag"
                    class="inline-block bg-gray-200 rounded-full px-3 py-1
             text-gray-700 mr-2 mb-2"
                    >#{{ tag }}</span
                  >
                </div>
              </div>
              <div class="add-box img-size relative">
              <div class="add-group absolute">
              <img src="../assets/addIcon.png" class="add-icon p-2" alt="icon"/>
              <div class="add-text">建立投票</div>
              </div>
              </div>
            </div>
        </div>
      </div>
      <div>
        <div class="title">全部投票</div>
        <div class="all-card mx-auto">
        <div class="flex flex-row container-all">
          <div class="flex flex-row flex-wrap justify-between">
      <div v-for="card in allCards"
      :key="card.id"
      class="w-full mb-4
      card-size overflow-hidden">
        <div class="max-w-sm rounded overflow-hidden shadow-lg ">
          <img class="w-full img-size" alt="Sunset in the mountains" />
          <div class="px-6 py-4">
            <div class="font-bold text-xl mb-2">{{ card.title }}</div>
            <p class="text-gray-700 text-base">{{ card.description }}</p>
          </div>
          <div class="px-6 pt-4 pb-2">
            <span v-for="tag in card.tags" :key="tag"
            class="inline-block bg-gray-200 rounded-full px-3 py-1
             text-gray-700 mr-2 mb-2">#{{ tag }}
            </span>
          </div>
        </div>
        </div>
      </div>
    </div>
        </div>
      </div>
      <pagination>
      </pagination>
    </pull>
  </div>
  <footer></footer>
</template>
<script type="module">
export default {
  data() {
    return {
      myCards: [
        {
          id: 1,
          image: 'image1.jpg',
          title: 'The Coldest Sunset',
          description: 'luptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.',
          tags: ['p', 't', 'e'],
        },
        {
          id: 2,
          image: 'image2.jpg',
          title: 'The Hottest Sunrise',
          description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores ipsum iure nostrum exercitationem.',
          tags: ['s', 'r', 'i'],
        },
        {
          id: 3,
          image: 'image3.jpg',
          title: 'The Coolest Moonlight',
          description: 'Cupiditate voluptates animi blanditiis error! Beatae, ullam commodi officiis culpa perferendis reprehenderit assumenda.',
          tags: ['m', 'o', 'n'],
        },
      ],
      allCards: [
        {
          id: 1,
          image: 'image1.jpg',
          title: 'The Coldest Sunset',
          description: 'luptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.',
          tags: ['p', 't', 'e'],
        },
        {
          id: 2,
          image: 'image2.jpg',
          title: 'The Hottest Sunrise',
          description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores ipsum iure nostrum exercitationem.',
          tags: ['s', 'r', 'i'],
        },
        {
          id: 3,
          image: 'image3.jpg',
          title: 'The Coolest Moonlight',
          description: 'Cupiditate voluptates animi blanditiis error! Beatae, ullam commodi officiis culpa perferendis reprehenderit assumenda.',
          tags: ['m', 'o', 'n'],
        },
        {
          id: 4,
          image: 'image4.jpg',
          title: 'The Warmest Day',
          description: 'Consectetur adipisicing elit. Dolores ipsum iure nostrum exercitationem.',
          tags: ['w', 'a', 'r'],
        },
        {
          id: 5,
          image: 'image5.jpg',
          title: 'The Brightest Sky',
          description: 'Adipisicing elit. Dolores ipsum iure nostrum exercitationem.',
          tags: ['b', 'r', 'i'],
        },
        {
          id: 6,
          image: 'image6.jpg',
          title: 'The Deepest Ocean',
          description: 'Dolores ipsum iure nostrum exercitationem.',
          tags: ['d', 'e', 'e'],
        },
        {
          id: 7,
          image: 'image6.jpg',
          title: 'The Deepest Ocean',
          description: 'Dolores ipsum iure nostrum exercitationem.',
          tags: ['d', 'e', 'e'],
        },
        {
          id: 8,
          image: 'image6.jpg',
          title: 'The Deepest Ocean',
          description: 'Dolores ipsum iure nostrum exercitationem.',
          tags: ['d', 'e', 'e'],
        },
        {
          id: 9,
          image: 'image6.jpg',
          title: 'The Deepest Ocean',
          description: 'Dolores ipsum iure nostrum exercitationem.',
          tags: ['d', 'e', 'e'],
        },
        {
          id: 10,
          image: 'image6.jpg',
          title: 'The Deepest Ocean',
          description: 'Dolores ipsum iure nostrum exercitationem.',
          tags: ['d', 'e', 'e'],
        },
        {
          id: 11,
          image: 'image6.jpg',
          title: 'The Deepest Ocean',
          description: 'Dolores ipsum iure nostrum exercitationem.',
          tags: ['d', 'e', 'e'],
        },
        {
          id: 12,
          image: 'image6.jpg',
          title: 'The Deepest Ocean',
          description: 'Dolores ipsum iure nostrum exercitationem.',
          tags: ['d', 'e', 'e'],
        },
      ],
    };
  },
};
</script>

<style scoped>
*{
  box-sizing: border-box;
}
.container {
  width: 1920px;
}
.title {
  font-size: 32px;
}
.container-my {
  /* border-color: black;
  border: 1px solid; */
  width: 1341px;
}
.container-all {
  /* border-color: black;
  border: 1px solid; */
  width: 1341px;
}
.my-card {
}
.all-card {
}
.card-size {
  width: 314px;
  height: 412px;
}
.img-size {
  height: 314px;
  width: 314px;
  background-color:#FCB738;
}
.card-style {
}
.add-box {
  background-color: #FFF4E0;
}
.add-group {
  left: 130px;
  top: 130px;
}
/* @media screen and (max-width: 768px) {
}
@media screen and (min-width: 769px) {
  .my-card{
    margin: auto;
  }
} */
</style>
