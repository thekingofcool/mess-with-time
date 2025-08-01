import { fromUnixTime, getUnixTime } from 'date-fns'
import { formatInTimeZone, getTimezoneOffset } from 'date-fns-tz'

export type TimezoneId = 
  | 'UTC'
  | 'Asia/Shanghai'
  | 'Asia/Tokyo'
  | 'Asia/Singapore'
  | 'America/New_York'
  | 'America/Los_Angeles'
  | 'Europe/London'
  | 'Europe/Paris'
  | 'Europe/Berlin'
  | 'Australia/Sydney'
  | 'Pacific/Auckland'

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

export const timezoneLabels: Record<string, Record<TimezoneId, string>> = {
  en: {
    'UTC': 'UTC (Coordinated Universal Time)',
    'Asia/Shanghai': 'China (UTC+8)',
    'Asia/Tokyo': 'Japan (UTC+9)',
    'Asia/Singapore': 'Singapore (UTC+8)',
    'America/New_York': 'New York (UTC-4)',
    'America/Los_Angeles': 'Los Angeles (UTC-7)',
    'Europe/London': 'London (UTC+1)',
    'Europe/Paris': 'Paris (UTC+2)',
    'Europe/Berlin': 'Berlin (UTC+2)',
    'Australia/Sydney': 'Sydney (UTC+10)',
    'Pacific/Auckland': 'Auckland (UTC+12)'
  },
  zh: {
    'UTC': '协调世界时 (UTC)',
    'Asia/Shanghai': '中国 (UTC+8)',
    'Asia/Tokyo': '日本 (UTC+9)',
    'Asia/Singapore': '新加坡 (UTC+8)',
    'America/New_York': '纽约 (UTC-4)',
    'America/Los_Angeles': '洛杉矶 (UTC-7)',
    'Europe/London': '伦敦 (UTC+1)',
    'Europe/Paris': '巴黎 (UTC+2)',
    'Europe/Berlin': '柏林 (UTC+2)',
    'Australia/Sydney': '悉尼 (UTC+10)',
    'Pacific/Auckland': '奥克兰 (UTC+12)'
  },
  es: {
    'UTC': 'UTC (Tiempo Universal Coordinado)',
    'Asia/Shanghai': 'China (UTC+8)',
    'Asia/Tokyo': 'Japón (UTC+9)',
    'Asia/Singapore': 'Singapur (UTC+8)',
    'America/New_York': 'Nueva York (UTC-4)',
    'America/Los_Angeles': 'Los Ángeles (UTC-7)',
    'Europe/London': 'Londres (UTC+1)',
    'Europe/Paris': 'París (UTC+2)',
    'Europe/Berlin': 'Berlín (UTC+2)',
    'Australia/Sydney': 'Sídney (UTC+10)',
    'Pacific/Auckland': 'Auckland (UTC+12)'
  }
}

export const timezoneGroups: Record<string, Record<string, TimezoneId[]>> = {
  en: {
    'UTC': ['UTC'],
    'Asia': ['Asia/Shanghai', 'Asia/Tokyo', 'Asia/Singapore'],
    'Americas': ['America/New_York', 'America/Los_Angeles'],
    'Europe': ['Europe/London', 'Europe/Paris', 'Europe/Berlin'],
    'Pacific': ['Australia/Sydney', 'Pacific/Auckland']
  },
  zh: {
    'UTC': ['UTC'],
    '亚洲': ['Asia/Shanghai', 'Asia/Tokyo', 'Asia/Singapore'],
    '美洲': ['America/New_York', 'America/Los_Angeles'],
    '欧洲': ['Europe/London', 'Europe/Paris', 'Europe/Berlin'],
    '太平洋': ['Australia/Sydney', 'Pacific/Auckland']
  },
  es: {
    'UTC': ['UTC'],
    'Asia': ['Asia/Shanghai', 'Asia/Tokyo', 'Asia/Singapore'],
    'América': ['America/New_York', 'America/Los_Angeles'],
    'Europa': ['Europe/London', 'Europe/Paris', 'Europe/Berlin'],
    'Pacífico': ['Australia/Sydney', 'Pacific/Auckland']
  }
}

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