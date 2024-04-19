const AuthLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <main className="h-full flex items-center justify-center">
      <div className="border border-slate-300 p-8 rounded-md">
        {children}
      </div>
    </main>
  )
}

export default AuthLayout