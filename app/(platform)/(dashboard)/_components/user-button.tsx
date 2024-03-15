import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAvatar } from "@/components/shared/user-avatar"
import { SignOutButton } from "@/components/button/signout-button"
import { NavItems } from "./nav-items"
import {
  UserRoundCog,
  CreditCard,
} from "lucide-react"

export const UserButton = () => {
  const routes = [
    {
      label: "Profile",
      icon: <UserRoundCog className="h-4 w-4 mr-2" />,
      href: "/profile",
    },
    // {
    //   label: "Billing",
    //   icon: <CreditCard className="h-4 w-4 mr-2" />,
    //   href: "/billing",
    // },
  ]
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger><UserAvatar /></DropdownMenuTrigger>
      <DropdownMenuContent className="pt-1">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <NavItems routes={routes} />
        <DropdownMenuItem>
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}