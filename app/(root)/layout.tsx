import AuthProvider from "@/providers/auth-provider"
import { QueryProvider } from "@/providers/query-provider"
import { ModalProvider } from "@/providers/modal-provider"
import { Toaster } from "@/components/ui/toaster"

const RootLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <AuthProvider>
      <QueryProvider>
        <Toaster />
        <ModalProvider />
        {children}
      </QueryProvider>
    </AuthProvider>
  )
}

export default RootLayout