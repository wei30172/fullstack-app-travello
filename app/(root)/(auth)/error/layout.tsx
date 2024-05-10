import { Suspense } from "react"

const ErrorLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <Suspense>
      {children}
    </Suspense>
  )
}

export default ErrorLayout