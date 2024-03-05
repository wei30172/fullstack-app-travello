import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const fetcher = (url: string) => fetch(url).then((res) => res.json())