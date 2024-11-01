<script setup lang="tsx">
import draggable from 'vuedraggable';
import debounce from 'lodash.debounce';
import { TierItem, TierListItem } from '../types';
import Tier from './Tier.vue';
const { onDeleteCallback } = defineProps<{ onDeleteCallback: (deletedItems:TierItem[])=> void }>()
const lists = defineModel<TierListItem[]>({required: true});

const onChangeTitleList = (index: number, event: Event) => {
  const target = event.target as HTMLElement;
  lists.value[index].title = target.innerText;
}

const debouncedOnChangeTitleList = debounce(onChangeTitleList, 500);

const onAddItemInIndex = (index:number) => {
  lists.value.splice(index+1, 0, {
    title: 'New',
    items: [],
  });
}

const onDelete = (index: number) => {
  const allItems = lists.value[index].items;
  lists.value.splice(index, 1);
  onDeleteCallback(allItems);
}
</script>
<template>
  <div class="flex flex-col h-full bg-gray-600/20 rounded-md">
    <draggable
      v-model="lists"
      :group="{name: 'lists', pull: true}"
      :fallbackOnBody="true"
      item-key="title"
      handle=".handle"
    >
      <template #item="{ element:list, index }">
        <div class="relative w-full flex min-h-[110px]">
          <div 
            class="flex justify-center items-center p-2 md:p-4 w-[80px] md:w-[120px] outline-none text-center bg-gray-600 shadow-inner"
            :class="{
              'rounded-ss-md': index === 0,
              'rounded-es-md': index === lists.length - 1,
            }"
            contenteditable="true" 
            @input="debouncedOnChangeTitleList(index, $event)"
          >
            <span class="overflow-hidden">
              {{ list.title }}
            </span>
          </div>
          <draggable
            v-model="list.items"
            :group="{ name: 'shared', pull: true, put: true }"
            :fallbackOnBody="true"
            item-key="id"
            class="flex-1 flex w-full gap-2 p-1 flex-wrap md:p-4 shadow-inner"
          >
            <template #item="{ element }">
              <Tier :item="element" :key="element.id"/>
            </template>
          </draggable>
          <div
            class="group absolute w-full h-1 -bottom-1 z-10 rounded flex justify-center"
          >
            <button 
              class="relative w-full h-0 rounded transition-all ease-in-out group-hover:h-full cursor-pointer"
              :class="{
                'bg-blue-300/30': index !== lists.length - 1,
              }"
              @click="onAddItemInIndex(index)"
            >
              <span class="hidden w-[24px] h-[24px] group-hover:grid absolute top-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400 place-items-center">
                <span class="hidden material-symbols-outlined text-[28px] cursor-pointer group-hover:block text-sm">
                  add
                </span>
              </span> 
            </button>
          </div>
          <div class="group absolute h-full min-w-8 -right-4 top-0 flex items-center">
            <button
              class="relative w-8 h-0 bg-red-700 rounded-full transition-all ease-in-out group-hover:h-8 text-white cursor-pointer"
              @click="onDelete(index)"
              :class="{
                'hidden': lists.length === 1
              }"
            >
              <span class="hidden material-symbols-outlined text-[28px] cursor-pointer group-hover:block text-sm">
                delete
              </span>
            </button>
          </div>
          <div class="group absolute h-full min-w-8 -left-4 top-0 flex items-center">
            <button
              class="handle relative w-8 h-0 bg-white rounded-md transition-all ease-in-out group-hover:h-8 text-gray-600 cursor-pointer"
              :class="{
                'hidden': lists.length === 1
              }"
            >
              <span class="hidden material-symbols-outlined text-[28px] cursor-pointer group-hover:block text-sm">
                drag_indicator
              </span>
            </button>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>