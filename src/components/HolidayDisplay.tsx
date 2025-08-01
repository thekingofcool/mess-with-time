'use client'

import { useEffect, useState } from 'react'
import { getHolidays, getTodayHolidays } from '@/utils/holidays'

const countryNames: Record<string, string> = {
  US: 'United States',
  CN: 'China',
  GB: 'United Kingdom',
  JP: 'Japan',
  DE: 'Germany',
  FR: 'France',
  RU: 'Russia',
  IN: 'India'
}

export function HolidayDisplay() {
  const [todayHolidays, setTodayHolidays] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchHolidays() {
      try {
        const allHolidays = await getHolidays()
        const holidays = getTodayHolidays(allHolidays)
        setTodayHolidays(holidays)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch holidays')
        setLoading(false)
      }
    }

    fetchHolidays()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        {error}
      </div>
    )
  }

  const hasHolidays = Object.keys(todayHolidays).length > 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Today's Holidays</h2>
      
      {hasHolidays ? (
        <div className="space-y-4">
          {Object.entries(todayHolidays).map(([country, holidays]) => (
            <div key={country} className="border-b dark:border-gray-700 last:border-0 pb-3">
              <h3 className="font-medium text-lg mb-2">
                {countryNames[country] || country}
              </h3>
              <ul className="space-y-1">
                {holidays.map((holiday: any) => (
                  <li key={holiday.name} className="text-gray-600 dark:text-gray-300">
                    {holiday.name} ({holiday.localName})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-300">
          No public holidays today in major countries.
        </p>
      )}
    </div>
  )
}