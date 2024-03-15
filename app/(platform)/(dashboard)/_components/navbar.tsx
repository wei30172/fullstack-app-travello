import { Button } from "@/components/ui/button"
import { Logo } from "@/components/shared/logo"
import { ModeToggle } from "@/components/shared/mode-toggle"
import { UserButton } from "./user-button"
import { FormPopover } from "@/components/form/form-popover"
import { MobileSidebar } from "./mobile-sidebar"
import { Plus } from "lucide-react"

export const Navbar = () => {
  return (
    <nav className="fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm bg-gray-100 dark:bg-gray-900 flex items-center">
      <MobileSidebar />
      <div className="flex items-center gap-x-4">
        <div className="hidden md:flex">
          <Logo />
        </div>
        <FormPopover align="start" sideOffset={6}>
          <Button variant="primary" size="sm" className="rounded-sm hidden md:block h-auto py-1.5 px-2">
            Create
          </Button>
        </FormPopover>
        <Button variant="primary" size="sm" className="rounded-sm block md:hidden">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="ml-auto flex items-center gap-x-2">
        <ModeToggle />
        <UserButton />
      </div>
    </nav>
  )
}