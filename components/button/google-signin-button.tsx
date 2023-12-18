import { signIn } from 'next-auth/react'

import { Button } from '@/components/ui/button'

const GoogleSignInButton = ({
  children,
  callbackUrl
}: {
  children: React.ReactNode
  callbackUrl: string
}) => {

  const loginWithGoogle = async () => {
    await signIn("google", { callbackUrl })
  }

  return (
    <Button onClick={loginWithGoogle} className="w-full">
      {children}
    </Button>
  )
}

export default GoogleSignInButton