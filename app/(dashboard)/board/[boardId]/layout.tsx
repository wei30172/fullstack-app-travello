import { notFound } from "next/navigation"
import { getBoard } from "@/lib/actions/board/get-board"

import { BoardNavbar } from "./_components/board-navbar"

export async function generateMetadata({ 
  params
 }: {
  params: { boardId: string }
 }) {
  const board = await getBoard(params.boardId)

  return {
    title: board?.title || "Trip",
  }
}

const BoardIdLayout = async ({
  children,
  params
}: {
  children: React.ReactNode
  params: { boardId: string }
}) => {
  const board = await getBoard(params.boardId)
  // console.log({board})

  if (!board) {
    notFound()
  }

  return (
    <div
      className="relative h-full bg-no-repeat bg-cover bg-center"
      // style={{ backgroundImage: `url(${board.imageFullUrl})` }}
    >
      <BoardNavbar boardData={board} />
      <div className="absolute inset-0 bg-black/10" />
      <main className="relative pt-28 h-full">
        {children}
      </main>
    </div>
  )
}

export default BoardIdLayout