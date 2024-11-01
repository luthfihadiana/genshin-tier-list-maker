<script setup lang="tsx">
import { onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';

type Position = {
  x: number;
  y: number;
}
const modalPinElement = useTemplateRef('modal-pin');
const position = ref<Position>({ x: 0, y: 0 });
const isDragging = ref(false);
const offset = ref<Position>({ x: 0, y: 0 });
const isPin = ref(false);
const isResize = ref(false);
const isShow = ref(true);

const startDrag = (event: MouseEvent) => {
  isDragging.value = true;
  offset.value.x = event.clientX - position.value.x;
  offset.value.y = event.clientY - position.value.y;
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
};

const onDrag = (event: MouseEvent) => {
  if (isDragging.value) {
    position.value.x = event.clientX - offset.value.x;
    position.value.y = event.clientY - offset.value.y;
  }
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
};

const centerPosition = () => {
  // Centers the element based on viewport dimensions
  position.value.x = window.innerWidth / 2 - ((modalPinElement.value?.clientWidth??250)/2); // Adjust for half width
  position.value.y = window.innerHeight / 2 - ((modalPinElement.value?.clientHeight??250)/2); // Adjust for half height
};

watch(isPin, ()=>{
  centerPosition();
  isShow.value = true;
});


onMounted(() => {
  centerPosition(); // Set initial position when component is mounted

  // Update position on window resize
  const handleResize = () => {
    if (isPin.value) {
      centerPosition(); // Recalculate the position if the component is pinned
    }
  };

  window.addEventListener('resize', handleResize);

  // Cleanup the resize event listener
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });
});

// Cleanup listeners when the component is unmounted
onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
});

const onToggle = () => {
  isPin.value = !isPin.value;
}

const onToggleResize = () => {
  isResize.value = !isResize.value;
}

const setIsShow = (value:boolean) => {
  isShow.value = value;
}
</script>
<template>
  <div
    ref="modal-pin"
    class="p-2 z-10 mt-10"
    :class="{
      'fixed min-w-[250px] max-w-[464px] bg-gray-600/50 rounded': isPin,
      'w-[30vw]': !isResize && isPin,
      'w-auto': isResize && isPin,
      'invisible': isPin && !isShow,
    }"
    :style="{ left: `${position.x}px`, top: `${position.y}px` }"
  >
    <div class="relative">
      <slot name="children" :isShow="isShow" :isResize="isResize" :isPin="isPin" :setIsShow="setIsShow"/>
      <div class="absolute -top-5" v-if="!isPin">
        <button class="px-4 py-1 rounded-md bg-gray-600/20 text-sm" @click="onToggle">
          Pin
        </button>
      </div>
      <div class="absolute -top-8 -right-1 flex gap-3" v-if="isPin">
        <button 
          class="p-1 rounded-md flex items-center justify-center" 
          :class="{
            'bg-yellow-600': !isResize,
            'bg-green-600': isResize,
          }"
          @click="onToggleResize"
        >
          <span class="material-symbols-outlined text-md">
            {{ !isResize ? "collapse_content": "expand_content"}}
          </span>
        </button>
        <button class="p-1 rounded-md bg-green-700 flex items-center justify-center cursor-grab" @mousedown="startDrag">
          <span class="material-symbols-outlined text-md">
            drag_pan
          </span>
        </button>
        <button class="p-1 rounded-md bg-red-700 flex items-center justify-center" @click="onToggle">
          <span class="material-symbols-outlined text-md">
            close
          </span>
        </button>
      </div>
    </div>
  </div>
</template>