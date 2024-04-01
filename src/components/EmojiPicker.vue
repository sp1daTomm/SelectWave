<script  setup>
import {
  defineProps,
  ref,
  watch,
} from 'vue';
import emoji from '@/data/emoji-metadata.json';

const props = defineProps({
  selectEmoji: String,
});

const haveImage = ref(false);
const result = ref('');

watch(() => {
  const data = Object.values(emoji);
  const filterData = data.filter((item) => item.glyph === props.selectEmoji);
  if (filterData.length > 0) {
    haveImage.value = true;
    result.value = filterData[0].styles['3D'];
  } else {
    haveImage.value = false;
  }
  if (haveImage.value) {
    return result.value;
  }
  return '';
});

</script>
<template>
  <img v-if="haveImage" class="w-8 h-8" :src="result" alt="selectEmoji" />
  <span v-else-if="props.selectEmoji">{{ props.selectEmoji }}</span>
</template>
