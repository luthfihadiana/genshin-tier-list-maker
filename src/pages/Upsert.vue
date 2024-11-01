<script setup lang="tsx">
import { ref, watch } from 'vue';
import draggable from 'vuedraggable';
import { DBEnum, TierListItem } from '../types';
import { DEFAULT_TIER_LIST } from '../constants';
import ModalPin from '../components/ModalPin.vue';
import Tier from '../components/Tier.vue';
import TierList from '../components/TierList.vue';
import { useListCharacters } from '../composable/useListCharacters';
import { useIndexedDB } from '../composable/useIndexedDb';
import { useTierListItem } from '../composable/useTierListItem';
import { useRoute } from 'vue-router'
import { showSnackbar } from '../helpers';

const route = useRoute();
const { tierListItem } = useTierListItem(Number(route.params.id));
const { data:listCharacters, isLoading } = useListCharacters();
const { openDB, addRecord, updateRecord } = useIndexedDB(
  DBEnum.TIER_LIST,
);

const captureElement = ref<HTMLElement | null>(null);

const title = ref("Tier List");
const lists = ref<TierListItem[]>(DEFAULT_TIER_LIST);

watch([tierListItem, isLoading], ([newTierListItem,isLoading])=> {
  if(newTierListItem && !isLoading){
    const assignedChar = newTierListItem
      .items
      .flatMap(el => el.items)
      .flatMap(el => el.name)
      .reduce<Record<string, boolean>>((prev,curr) => ({...prev, [curr]: true}),{});
    title.value = newTierListItem.title;
    lists.value = [...newTierListItem.items];
    listCharacters.value = listCharacters.value.filter(el => !assignedChar[el.name]);
  }
});


// Event handlers
const onChangeTitle = (event: Event) => {
  const target = event.target as HTMLElement;
  title.value = target.innerText;
}

const onSubmit = async () =>{
  try{
    await openDB();
    if(route.params.id){
      await updateRecord({
        id: Number(route.params.id),
        title: title.value,
        items: Array.from(lists.value.map(el=>({
          title: el.title,
          items: Array.from(el.items.map(el => ({
            name: el.name,
            id: el.id,
          }))),
        })))
      });
      showSnackbar("Tierlist berhasil diupdate", "success");
    }else{
      await addRecord({
        title: title.value,
        items: Array.from(lists.value.map(el=>({
          title: el.title,
          items: Array.from(el.items.map(el => ({
            name: el.name,
            id: el.id,
          }))),
        })))
      });
      showSnackbar("Tierlist berhasil dibuat", "success");
    }
  }catch(err){
    console.log(err);
    console.log("error bang messi");
  }
}
</script>

<template>
  <div class="w-full max-w-[928px] my-0 mx-auto" ref="captureElement">
    <div class="flex justify-between items-start mb-4 flex-col-reverse md:flex-row gap-2">
      <h2 class="text-xl outline-none" contenteditable="true" @input="onChangeTitle">
        <span>{{ title }}</span>
      </h2>
      <div class="self-end">
        <button class="px-4 py-1 rounded-md bg-blue-600/50 w-auto flex items-center gap-2" @click="onSubmit">
          <span class="material-symbols-outlined text-md">
            save
          </span>
          Save
        </button>
      </div>
    </div>
    <TierList
      v-model="lists"
      @delete-callback="(items)=> listCharacters = [...listCharacters, ...items]"
    />
    <ModalPin v-if="!isLoading">
      <template #children="{isShow, isPin:isPinCharacters, setIsShow, isResize}">
        <p v-if="(!isShow||isResize) && isPinCharacters">Characters</p>
        <draggable
          v-model="listCharacters"
          :group="{ name: 'shared', pull: true, put: true }"
          :fallbackOnBody="true"
          item-key="name"
          @start="setIsShow(false)"
          @end="setIsShow(true)"
          class="flex w-full gap-2 flex-wrap max-h-[200px] overflow-scroll justify-center"
          :class="{
            'hidden': isPinCharacters && (isResize || !isShow)
          }"
        >
          <template #item="{ element }">
            <Tier :item="element" :key="element.id"/>
          </template>
        </draggable>
      </template>
    </ModalPin>
  </div>
</template>