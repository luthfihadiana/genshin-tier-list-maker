<script setup lang="tsx">
import { onMounted, ref } from 'vue';
import { TierItem } from '../types';
import { cacheImage } from '../helpers';

type TierProps = {
  item: TierItem
};
const props = defineProps<TierProps>();

// Define a ref to hold the cached image URL
const cachedImageSrc = ref('');

onMounted(async () => {
  // Generate the full image URL using the item's name
  const imageUrl = `https://genshin.jmp.blue/characters/${props.item.name}/icon`;
  // Use cacheImage to fetch and cache the image, and set the cached URL to cachedImageSrc
  cachedImageSrc.value = await cacheImage(imageUrl);
});
</script>

<template>
  <div class="cursor-move w-[75px] h-[75px] relative">
    <span v-if="item.name.includes('traveler')" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
      {{ item.name.split("-")[1] }}
    </span>
    <img
      :alt="`image-icon-${item.name}`"
      :src="cachedImageSrc"
      :title="item.name"
      class="w-[75px] h-[75px]"
    />
  </div>
</template>