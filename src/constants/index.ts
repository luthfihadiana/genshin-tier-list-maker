import { TierListItem } from "../types";

export const DEFAULT_TIER_LIST:TierListItem[] = [
  {
    title: "S",
    items: []
  },
  {
    title: "A",
    items: []
  },
  {
    title: "B",
    items: []
  },
  {
    title: "C",
    items: []
  },
  {
    title: "D",
    items: []
  }
]

export const INDEX_DB_NAME = {
  TIER_LIST_MAKER_GENSHIN: "tier-list-maker-genshin",
}

export type IndexDBNameKeys = (typeof INDEX_DB_NAME)[keyof typeof INDEX_DB_NAME];