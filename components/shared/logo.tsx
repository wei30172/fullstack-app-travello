import Link from "next/link"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { textFont } from "@/lib/fonts"

export const Logo = () => {
  return (
    <Link href="/">
      <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
        <Image
          src="/logo.png"
          alt="Logo"
          height={30}
          width={30}
        />
        <p className={cn(
          "text-lg text-teal-700 pb-1 font-bold",
          textFont.className,
        )}>
          Travello
        </p>
      </div>
    </Link>
  )
}