export default function ProfileLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="border border-slate-300 p-8 rounded-md">
        {children}
      </div>
    </div>
  )
}