<script setup lang="tsx">
import { onMounted, ref } from "vue";
import CardItem from "../components/CardItem.vue";
import { useIndexedDB } from "../composable/useIndexedDb";
import { DBEnum } from "../types";
import { useRouter } from 'vue-router'

type ListTierListItem = {
  id:number, 
  title:string
}

const router = useRouter();
const list = ref<ListTierListItem[]>();
const { openDB, getAllRecords } = useIndexedDB(
  DBEnum.TIER_LIST,
);
onMounted(async ()=> {
  await openDB();
  const res = await getAllRecords();
  list.value = res.map(el => ({
    title: el.title,
    id: el.id as number
  }))
});
const onClickCard = (item:ListTierListItem) =>{
  router.push({ path: `/list/${item.id}` })
}
</script>

<template>
  <section class="w-full max-w-[928px] my-0 mx-auto">
    <div class="flex flex-col xs:flex-row justify-between w-full mb-8 gap-2">
      <h2 class="font-title text-xl">List<span class="font-text"> - ({{list?.length}})</span></h2>
      <div class="self-end">
        <router-link class="px-4 py-1 rounded-md bg-gray-600 w-auto" :to="{ name: 'Create' }">
          + Add Tierlist 
        </router-link>
      </div>
    </div>
    <div class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <CardItem v-for="(item) in list" :title="item.title" :key="item.id" @click="() => onClickCard(item)"/>
    </div>
  </section>
</template>