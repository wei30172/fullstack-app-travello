export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <main className="h-full flex items-center justify-center">
      {children}
    </main>
  )
}