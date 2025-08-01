'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getHolidays, getTodayHolidays, type Holiday } from '@/utils/holidays'

const countryNames = {
  en: {
    US: 'United States',
    CN: 'China',
    GB: 'United Kingdom',
    JP: 'Japan',
    DE: 'Germany',
    FR: 'France',
    RU: 'Russia',
    IN: 'India'
  },
  zh: {
    US: '美国',
    CN: '中国',
    GB: '英国',
    JP: '日本',
    DE: '德国',
    FR: '法国',
    RU: '俄罗斯',
    IN: '印度'
  },
  es: {
    US: 'Estados Unidos',
    CN: 'China',
    GB: 'Reino Unido',
    JP: 'Japón',
    DE: 'Alemania',
    FR: 'Francia',
    RU: 'Rusia',
    IN: 'India'
  }
}

const translations = {
  en: {
    title: "Today's Holidays",
    loading: 'Loading holidays...',
    error: 'Failed to fetch holidays',
    noHolidays: 'No public holidays today in major countries.'
  },
  zh: {
    title: '今日节假日',
    loading: '正在加载节假日信息...',
    error: '获取节假日信息失败',
    noHolidays: '今日主要国家没有公共假期。'
  },
  es: {
    title: 'Festivos de Hoy',
    loading: 'Cargando festivos...',
    error: 'Error al cargar los festivos',
    noHolidays: 'No hay festivos hoy en los principales países.'
  }
}

export function HolidayDisplay() {
  const [todayHolidays, setTodayHolidays] = useState<Record<string, Holiday[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const params = useParams()
  const currentLang = (params?.lang as string) || 'en'
  const t = translations[currentLang as keyof typeof translations] || translations.en
  const names = countryNames[currentLang as keyof typeof countryNames] || countryNames.en

  useEffect(() => {
    async function fetchHolidays() {
      try {
        const allHolidays = await getHolidays()
        const holidays = getTodayHolidays(allHolidays)
        setTodayHolidays(holidays)
        setLoading(false)
      } catch {
        setError(t.error)
        setLoading(false)
      }
    }

    fetchHolidays()
  }, [t.error])

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">{t.loading}</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-red-500 text-center p-4">
          {error}
        </div>
      </div>
    )
  }

  const hasHolidays = Object.keys(todayHolidays).length > 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        {t.title}
      </h2>
      
      {hasHolidays ? (
        <div className="space-y-4">
          {Object.entries(todayHolidays).map(([country, holidays]) => (
            <div key={country} className="border-b dark:border-gray-700 last:border-0 pb-3">
              <h3 className="font-medium text-lg mb-2 text-gray-900 dark:text-gray-100">
                {names[country as keyof typeof names] || country}
              </h3>
              <ul className="space-y-1">
                {holidays.map((holiday) => (
                  <li key={holiday.name} className="text-gray-600 dark:text-gray-300">
                    {holiday.name} ({holiday.localName})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-300 text-center py-8">
          {t.noHolidays}
        </p>
      )}
    </div>
  )
}