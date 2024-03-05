"use client"

import { useQuery } from "@tanstack/react-query"

import { CardWithList } from "@/types"
import { fetcher } from "@/lib/utils"
import { useCardModal } from "@/hooks/use-card-modal"

import { Header } from "./header"
import { Description } from "./description"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Options } from "./options"

export const CardModal = () => {
  const id = useCardModal((state) => state.id)
  const isOpen = useCardModal((state) => state.isOpen)
  const onClose = useCardModal((state) => state.onClose)

  const { data: cardData } = useQuery<CardWithList, Error>({
    queryKey: ['card', id],
    queryFn: () => fetcher(`/api/cards/${id}`)
  })

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent>
      
        {!cardData
          ? <Header.Skeleton />
          : <Header data={cardData} />
        }
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          {/* <div className="col-span-3">
            <div className="w-full space-y-6">
              {!cardData
                ? <Description.Skeleton />
                : <Description data={cardData} />
              }
            </div>
          </div> */}
          {/* {!cardData
            ? <Options.Skeleton />
            : <Options data={cardData} />
          } */}
        </div>
      
      </DialogContent>
    </Dialog>
  )
}