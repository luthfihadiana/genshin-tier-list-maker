import { onMounted, ref } from "vue";
import { v4 as uuidv4 } from 'uuid';
import { DBEnum, TierItem } from "../types";
import { useIndexedDB } from "./useIndexedDb";
import { fetcher } from "../helpers";

export function useListCharacters(){
  const data = ref<TierItem[]>([]);
  const isLoading = ref<boolean>(true);
  const { openDB, addRecord, getAllRecords } = useIndexedDB(
    DBEnum.CHARACTERS, 
  );
  const fetchData = async () =>{
    isLoading.value = true;
    fetcher<string[]>('https://genshin.jmp.blue/characters').then(res => {
      const resData = res.map((el) => {
        const uuid = uuidv4();
        addRecord({
          name: el,
          dataId: uuid,
        });
        return{
          id: uuid,
          name: el,
        }
      });
      data.value = [...resData]
    }).finally(()=>{
      isLoading.value = false;
    });
  }
  onMounted(async () => {
    await openDB();
    const result = await getAllRecords();
    if(result.length < 1){
      await fetchData();
    }else{
      data.value = [...result.map(el => ({
        name: el.name,
        id: el.dataId,
      }))]
      isLoading.value = false;
    }
  });
  return{
    data,
    isLoading,
    fetchData
  }
}