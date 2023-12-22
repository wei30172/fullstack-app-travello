import { ICard, IList } from "@/lib/models/types"

export type ListWithCards = IList & { cards: ICard[] }

export type CardWithList = ICard & { list: IList }