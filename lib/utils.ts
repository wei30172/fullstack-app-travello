import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const formatDateTime = (input: Date | string, locale: string = 'en-US') => {
  const date = new Date(input)

  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // e.g., "Mon"
    month: 'short', // e.g., "Jul"
    day: 'numeric', // e.g., 31
    hour: 'numeric', // e.g., 1
    minute: 'numeric', // e.g., 45
    hour12: true
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    year: 'numeric', // e.g., 2023
    day: 'numeric'
  }

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }

  const formattedDateTime = date.toLocaleString(locale, dateTimeOptions)
  const formattedDate = date.toLocaleString(locale, dateOptions)
  const formattedTime = date.toLocaleString(locale, timeOptions)

  return {
    dateTime: formattedDateTime, // e.g., "Sat, Mar 25, 2:30 PM"
    dateOnly: formattedDate, // e.g., "Sat, Mar 25, 2023"
    timeOnly: formattedTime // e.g., "2:30 PM"
  }
}