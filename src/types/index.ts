export type ResListCharacters = string[];

export type TierItem = {
  name: string,
  id: string,
};

export type TierListItem = {
  title: string,
  items: TierItem[]
};

export enum DBEnum {
  CHARACTERS="CHARACTERS",
  TIER_LIST="TIER_LIST",
};