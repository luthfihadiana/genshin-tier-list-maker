import { onMounted, ref } from "vue";
import { DBEnum, TierListItem } from "../types";
import { useIndexedDB } from "./useIndexedDb";

export function useTierListItem(idTierList=0){
  const { openDB, getRecord } = useIndexedDB(
    DBEnum.TIER_LIST, 
  );
  const tierListItem = ref<{title:string,items:TierListItem[]}>();
  onMounted(async ()=> {
    if(idTierList){
      await openDB();
      const res = await getRecord(idTierList);
      if(res){
        tierListItem.value  = {
          title: res.title,
          items: res.items
        };
      }
    }
  });
  return {
    tierListItem
  }
}