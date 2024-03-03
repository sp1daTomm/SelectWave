<template>
  <main>
    <section class="max-w-screen-xl px-3 py-8 mx-auto md:py-20">
      <h1 class="text-2xl font-semibold leading-normal text-center md:text-3xl">輕鬆建立投票所，讓您的聲音成為力量。</h1>
      <p class="py-4 leading-normal text-center text-gray-2 md:text-xl">一個平台，千種可能。「選集」，讓每個聲音都有影響。</p>
      <div class="flex justify-center">
        <RouterLink to="/login" class="inline-block px-6 py-2 mx-auto mt-4 text-white transition rounded-full bg-primary-dark hover:bg-primary">立即註冊</RouterLink>
      </div>
      <div class="flex flex-col gap-3 mt-6 md:flex-row-reverse md:justify-around">
        <img class="rounded-xl h-full w-10/12 md:w-[30%]" :src="headImageUrl01" alt="圖片01">
        <img class="rounded-xl w-10/12 self-end md:w-[30%] md:mt-6" :src="headImageUrl02" alt="圖片02">
        <img class="rounded-xl h-full w-10/12 md:w-[30%]" :src="headImageUrl03" alt="圖片03">
      </div>
    </section>
    <section class="relative py-8">

      <div class="px-3">
        <img :src="logoImageUrl" alt="選集LOGO" class="mx-auto w-14 md:w-36">
        <h2 class="pt-6 pb-4 text-2xl font-semibold leading-normal text-center md:text-3xl md:pb-8">全新概念的線上投票平台</h2>
        <p class="mx-auto leading-relaxed text-gray-2 md:max-w-screen-md md:text-xl md:leading-9">
          您的聲音，我們的力量，「選集」是一個創新的線上投票平台，旨在讓每個人都能輕鬆發聲，參與各種決策過程，並建立自己的線上投票所。無論是企業內部意見調查、社群活動的民主決策，還是學校的校園選舉，「選集」都是您最理想的合作夥伴。
        </p>
      </div>
      <div :style="{ backgroundImage: bgImgGraphic01 }" class=" z-[-1] bg-no-repeat bg-contain absolute top-0 left-0 w-1/4 h-full"></div>
      <div :style="{ backgroundImage: bgImgGraphic02 }" class=" z-[-1] bg-no-repeat bg-contain absolute top-0 right-0 w-1/4 h-full"></div>
    </section>
    <section class="max-w-screen-lg px-3 py-8 mx-auto">
      <div class="flex flex-col gap-5 md:flex-row-reverse ">
        <div class="px-[7%] pb-4 md:w-1/2 relative md:px-6">
          <img  :src="chartImage01" alt="即時結果">
          <h2 class="py-4 text-2xl font-semibold leading-normal md:text-3xl md:py-6">即時結果</h2>
          <p class="leading-relaxed text-gray-2 md:text-xl md:leading-9">無論您是發起者還是參與者，「選集」都能即時呈現投票結果，讓每個人都能清晰了解目前的狀態。此外，我們提供精美的報告，將投票活動的關鍵資訊以直觀的方式呈現，協助用戶更好地理解參與者的意見和趨勢。</p>
          <div class="absolute inset-0 bg-gray-4 h-4/5 mt-auto z-[-1] rounded-2xl"></div>
        </div>
        <div class="px-[7%] pb-5 md:w-1/2 relative md:px-6">
          <img  :src="chartImage02" alt="簡易建立投票所">
          <h2 class="py-4 text-2xl font-semibold leading-normal md:text-3xl md:py-6">簡易建立投票所</h2>
          <p class="leading-relaxed text-gray-2 md:text-xl md:leading-9">「選集」的使用十分簡單，只需幾個步驟，您就能建立自己的線上投票所。首先，註冊一個帳戶，然後選擇您的投票主題，設定投票選項，即可輕鬆啟動一場投票活動。無需繁瑣的設定，不論您是初次使用還是有豐富線上投票經驗，都能輕松上手。</p>
          <div class="absolute inset-0 bg-gray-4 h-4/5 mt-auto z-[-1] rounded-2xl"></div>
        </div>
      </div>
    </section>
    <section class="max-w-screen-lg px-3 py-8 mx-auto md:py-20">
      <h2 class="pb-4 text-2xl font-semibold leading-normal md:text-3xl md:py-6 md:text-center md:pb-8">全新概念的線上投票平台</h2>
      <ul class="flex flex-col justify-around md:flex-row-reverse">
        <li class="flex items-center gap-3 md:flex-col " v-for="(item, index) in sectionItems" :key="index + '_sectionItems'">
          <img :src="item.imgSrc" :alt="item.title" class="w-1/3  md:h-2/4 md:w-[unset]">
          <div class="flex-grow">
            <h3 class="text-xl font-medium leading-normal md:text-center md:pb-6 md:text-2xl">{{ item.title }}</h3>
            <p class="leading-relaxed text-gray-2 md:text-center md:text-xl">{{item.description}}</p>
          </div>
        </li>
      </ul>
    </section>
    <section class="max-w-screen-lg px-3 pb-8 mx-auto md:py-20">
      <div class="flex flex-col gap-3 md:flex-row md:items-center">
        <img :src="signupCover" alt="選集的服務" class="md:w-5/12">
        <div class="grow">
          <h2 class="pb-4 text-2xl font-semibold leading-normal md:text-3xl md:py-6 md:pb-8">不只有投票，我們還有...</h2>
          <div class="p-3 mb-4 bg-gray-4 rounded-2xl md:rounded-3xl md:p-8">
            <h3 class="pb-2 text-xl font-medium leading-normal md:text-2xl md:pb-4">留言</h3>
            <p class="text-gray-2 md:text-xl">可以在任何投票所發表你的言論</p>
          </div>
          <div class="p-3 mb-4 bg-gray-4 rounded-2xl md:rounded-3xl md:p-8">
            <h3 class="pb-2 text-xl font-medium leading-normal md:text-2xl md:pb-4 ">分享投票所</h3>
            <p class="text-gray-2 md:text-xl">分享給身邊的親朋好友來投票。</p>
          </div>
        </div>
      </div>
    </section>
    <section class="max-w-screen-lg px-3 pb-8 mx-auto md:py-20">
      <h2 class="pb-4 text-2xl font-semibold leading-normal text-center md:text-3xl md:py-6 md:pb-8">使用情境</h2>
      <ul class="flex flex-col md:gap-4 md:flex-row">
        <li class="p-3 mb-4 bg-gray-4 rounded-2xl md:w-1/3 md:rounded-3xl md:p-8"
        v-for="(item, index) in scenarioItems" :key="index + '_scenarioItems'">
            <h3 class="pb-2 text-xl font-medium leading-normal md:text-2xl md:pb-4">{{ item.title }}</h3>
            <p class="leading-normal text-gray-2 md:leading-relaxed md:text-xl">{{item.description}}</p>
        </li>
      </ul>
    </section>
    <section class="max-w-screen-lg px-3 pb-8 mx-auto md:py-20">
      <div class="md:border md:border-solid md:border-gray-3 md:flex md:items-center md:p-16 md:rounded-3xl md:gap-10">
        <img :src="logoImageUrl" alt="選集LOGO" class="w-14 md:w-36 ">
        <div>
          <h3 class="text-xl leading-relaxed  pb-2 mt-4 md:mt-[unset] md:pb-4 md:text-2xl ">輕鬆建立投票所，讓您的聲音成為決定力量。</h3>
          <RouterLink to="/login" class="px-6 py-2 mt-4 inline-block mx-auto md:mt-[unset]
          rounded-full bg-primary-dark text-white  hover:bg-primary
          transition">立即註冊</RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>
<script setup>
const headImageUrl01 = '/home/head01.jpg';
const headImageUrl02 = '/home/head02.jpg';
const headImageUrl03 = '/home/head03.jpg';
const logoImageUrl = '../img_components/logo.svg';
const bgImgGraphic01 = 'url("/home/graphic01.png")';
const bgImgGraphic02 = 'url("/home/graphic02.png")';
const chartImage01 = '/home/chartImage01.png';
const chartImage02 = '/home/chartImage02.png';
const signupCover = '/images/signupCover.svg';

const sectionItems = [
  { imgSrc: '/home/sectionImage01.jpg', title: '簡單註冊', description: '只要 email 即可立即註冊，成為會員。' },
  { imgSrc: '/home/sectionImage02.jpg', title: '輕鬆建立', description: '任何議題皆可投票。' },
  { imgSrc: '/home/sectionImage03.jpg', title: '立即投票', description: '完成註冊即可參與任何投票。' },
];

const scenarioItems = [
  { title: '發起會議', description: '您不僅能參與投票，還能主動發起引人注目的議題，讓您的聲音成為社群、團隊或組織中的引領者。我們提供一個開放且易於使用的平台，讓您能夠發表您關心的問題，並集結眾多聲音，共同尋找最佳解決方案。' },
  { title: '簡單調查', description: '無論是企業內部意見調查、學術研究問卷，還是社區活動的參與度調查，我們都能滿足您的需求。' },
  { title: '意見收集', description: '無論你是對新科技有什麼看法，還是對最愛午餐選擇有何建議，都歡迎你在這裡分享。我們提供了一個簡單的平台，讓你輕鬆表達意見，參與有趣的討論。' },
];
</script>
