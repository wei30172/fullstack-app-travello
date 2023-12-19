const BoardIdLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <main className="h-full">
      <main className="relative pt-28 h-full">
        {children}
      </main>
    </main>
  )
}

export default BoardIdLayout