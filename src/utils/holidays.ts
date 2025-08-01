import axios from 'axios'

interface Holiday {
  date: string
  localName: string
  name: string
  countryCode: string
  fixed: boolean
  global: boolean
  type: string
}

const COUNTRIES = ['US', 'CN', 'GB', 'JP', 'DE', 'FR', 'RU', 'IN'] // Major countries

export async function getHolidays(year: number = new Date().getFullYear()): Promise<Record<string, Holiday[]>> {
  try {
    const holidaysByCountry: Record<string, Holiday[]> = {}
    
    await Promise.all(
      COUNTRIES.map(async (country) => {
        try {
          const response = await axios.get(
            `https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`
          )
          holidaysByCountry[country] = response.data
        } catch (error) {
          console.error(`Failed to fetch holidays for ${country}:`, error)
          holidaysByCountry[country] = []
        }
      })
    )

    return holidaysByCountry
  } catch (error) {
    console.error('Failed to fetch holidays:', error)
    return {}
  }
}

export function getTodayHolidays(holidays: Record<string, Holiday[]>): Record<string, Holiday[]> {
  const today = new Date().toISOString().split('T')[0]
  const todayHolidays: Record<string, Holiday[]> = {}

  Object.entries(holidays).forEach(([country, countryHolidays]) => {
    const holidaysToday = countryHolidays.filter(
      holiday => holiday.date === today
    )
    if (holidaysToday.length > 0) {
      todayHolidays[country] = holidaysToday
    }
  })

  return todayHolidays
}