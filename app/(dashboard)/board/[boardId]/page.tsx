import { getLists } from "@/lib/actions/list/get-lists"
import { IList } from "@/lib/models/types"

import { ListContainer } from "./_components/list-container"

interface BoardIdPageProps {
  params: {
    boardId: string
  }
}

const BoardIdPage = async ({
  params,
}: BoardIdPageProps) => {
  const lists: IList[] = await getLists(params.boardId)

  return (
    <div className="p-4 h-full overflow-x-auto">
      <ListContainer
        boardId={params.boardId}
        data={lists}
      />
    </div>
  )
}

export default BoardIdPage