import Link from "next/link"

import { Logo } from "@/components/shared/logo"
import { Button } from "@/components/ui/button"

export const Navbar = () => {
  return (
    <div className="fixed top-0 w-full h-16 px-4 border-b shadow-sm bg-white flex items-center">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <Logo />
        <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
          <Button variant="outline" size="sm" asChild>
            <Link href="/sign-in">
              Login
            </Link>
          </Button>
          <Button variant="primary" size="sm" asChild>
            <Link href="/sign-up">
              Try Travello for free
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}