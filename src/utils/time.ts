import { fromUnixTime, getUnixTime } from 'date-fns'
import { formatInTimeZone, getTimezoneOffset } from 'date-fns-tz'

export const timeFormats = {
  iso: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  human: {
    en: 'MMMM d, yyyy h:mm:ss a',
    zh: 'yyyy年MM月dd日 HH:mm:ss',
    es: 'd \'de\' MMMM \'de\' yyyy HH:mm:ss',
    fr: 'd MMMM yyyy HH:mm:ss',
    de: 'd. MMMM yyyy HH:mm:ss',
    ru: 'd MMMM yyyy HH:mm:ss',
  }
}

export const commonTimezones = [
  'UTC',
  'Asia/Shanghai',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Singapore',
  'Australia/Sydney',
  'Pacific/Auckland'
]

export function timestampToDate(timestamp: number): Date {
  return fromUnixTime(timestamp)
}

export function dateToTimestamp(date: Date): number {
  return getUnixTime(date)
}

export function formatDateTime(date: Date, locale: string = 'en', timezone: string = 'UTC'): string {
  return formatInTimeZone(
    date,
    timezone,
    timeFormats.human[locale as keyof typeof timeFormats.human] || timeFormats.human.en
  )
}

export function getLocalTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export function convertTimezone(date: Date, fromZone: string, toZone: string): Date {
  const fromOffset = getTimezoneOffset(fromZone, date)
  const toOffset = getTimezoneOffset(toZone, date)
  const diffInMilliseconds = toOffset - fromOffset
  return new Date(date.getTime() + diffInMilliseconds)
}

export function addTime(date: Date, amount: number, unit: 'years' | 'months' | 'days' | 'hours' | 'minutes' | 'seconds'): Date {
  const newDate = new Date(date)
  switch (unit) {
    case 'years':
      newDate.setFullYear(date.getFullYear() + amount)
      break
    case 'months':
      newDate.setMonth(date.getMonth() + amount)
      break
    case 'days':
      newDate.setDate(date.getDate() + amount)
      break
    case 'hours':
      newDate.setHours(date.getHours() + amount)
      break
    case 'minutes':
      newDate.setMinutes(date.getMinutes() + amount)
      break
    case 'seconds':
      newDate.setSeconds(date.getSeconds() + amount)
      break
  }
  return newDate
}