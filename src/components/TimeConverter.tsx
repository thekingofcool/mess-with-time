'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { timestampToDate, dateToTimestamp, formatDateTime, convertTimezone, addTime, getLocalTimezone, timezoneLabels, timezoneGroups, type TimezoneId } from '@/utils/time'

const timeUnits = [
  { value: 'years', label: { en: 'Years', zh: '年', es: 'Años' } },
  { value: 'months', label: { en: 'Months', zh: '月', es: 'Meses' } },
  { value: 'days', label: { en: 'Days', zh: '日', es: 'Días' } },
  { value: 'hours', label: { en: 'Hours', zh: '小时', es: 'Horas' } },
  { value: 'minutes', label: { en: 'Minutes', zh: '分钟', es: 'Minutos' } },
  { value: 'seconds', label: { en: 'Seconds', zh: '秒', es: 'Segundos' } }
] as const

const translations = {
  en: {
    inputLabel: 'Enter Timestamp or Date',
    sourceTimezone: 'Source Timezone',
    targetTimezone: 'Target Timezone',
    addSubtractTime: 'Add/Subtract Time',
    timeUnit: 'Time Unit',
    convert: 'Convert',
    results: 'Results:',
    original: 'Original:',
    converted: 'Converted:',
    timestamp: 'Timestamp:',
    placeholder: '1234567890 or 2023-01-01T00:00:00Z'
  },
  zh: {
    inputLabel: '输入时间戳或日期',
    sourceTimezone: '源时区',
    targetTimezone: '目标时区',
    addSubtractTime: '增加/减少时间',
    timeUnit: '时间单位',
    convert: '转换',
    results: '结果：',
    original: '原始：',
    converted: '转换后：',
    timestamp: '时间戳：',
    placeholder: '1234567890 或 2023-01-01T00:00:00Z'
  },
  es: {
    inputLabel: 'Ingrese Marca de Tiempo o Fecha',
    sourceTimezone: 'Zona Horaria de Origen',
    targetTimezone: 'Zona Horaria de Destino',
    addSubtractTime: 'Agregar/Restar Tiempo',
    timeUnit: 'Unidad de Tiempo',
    convert: 'Convertir',
    results: 'Resultados:',
    original: 'Original:',
    converted: 'Convertido:',
    timestamp: 'Marca de tiempo:',
    placeholder: '1234567890 o 2023-01-01T00:00:00Z'
  }
}

export function TimeConverter() {
  const params = useParams()
  const currentLang = (params?.lang as string) || 'en'
  const t = translations[currentLang as keyof typeof translations] || translations.en
  const groups = timezoneGroups[currentLang] || timezoneGroups.en
  const labels = timezoneLabels[currentLang] || timezoneLabels.en

  const [inputValue, setInputValue] = useState('')
  const [sourceTimezone, setSourceTimezone] = useState<TimezoneId>(getLocalTimezone() as TimezoneId)
  const [targetTimezone, setTargetTimezone] = useState<TimezoneId>('UTC')
  const [timeUnit, setTimeUnit] = useState<typeof timeUnits[number]['value']>('hours')
  const [timeAmount, setTimeAmount] = useState(0)

  const [result, setResult] = useState<{
    original: string
    converted: string
    timestamp: number
  } | null>(null)

  const handleConvert = () => {
    try {
      let date = new Date()
      if (/^\d+$/.test(inputValue)) {
        date = timestampToDate(parseInt(inputValue))
      } else {
        date = new Date(inputValue)
      }

      if (isNaN(date.getTime())) {
        throw new Error('Invalid date/timestamp')
      }

      const convertedDate = convertTimezone(date, sourceTimezone, targetTimezone)
      const finalDate = timeAmount !== 0 
        ? addTime(convertedDate, timeAmount, timeUnit)
        : convertedDate

      setResult({
        original: formatDateTime(date, currentLang, sourceTimezone),
        converted: formatDateTime(finalDate, currentLang, targetTimezone),
        timestamp: dateToTimestamp(finalDate)
      })
    } catch (error) {
      console.error('Conversion error:', error)
      setResult(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {t.inputLabel}
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t.placeholder}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t.sourceTimezone}
            </label>
            <select
              value={sourceTimezone}
              onChange={(e) => setSourceTimezone(e.target.value as TimezoneId)}
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.entries(groups).map(([group, timezones]) => (
                <optgroup key={group} label={group}>
                  {timezones.map((tz) => (
                    <option key={tz} value={tz}>
                      {labels[tz]}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t.targetTimezone}
            </label>
            <select
              value={targetTimezone}
              onChange={(e) => setTargetTimezone(e.target.value as TimezoneId)}
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.entries(groups).map(([group, timezones]) => (
                <optgroup key={group} label={group}>
                  {timezones.map((tz) => (
                    <option key={tz} value={tz}>
                      {labels[tz]}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t.addSubtractTime}
            </label>
            <input
              type="number"
              value={timeAmount}
              onChange={(e) => setTimeAmount(parseInt(e.target.value) || 0)}
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t.timeUnit}
            </label>
            <select
              value={timeUnit}
              onChange={(e) => setTimeUnit(e.target.value as typeof timeUnit)}
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {timeUnits.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label[currentLang as keyof typeof unit.label] || unit.label.en}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleConvert}
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {t.convert}
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600">
          <h3 className="font-medium mb-3">{t.results}</h3>
          <div className="space-y-2">
            <p><span className="font-medium">{t.original}</span> {result.original}</p>
            <p><span className="font-medium">{t.converted}</span> {result.converted}</p>
            <p><span className="font-medium">{t.timestamp}</span> {result.timestamp}</p>
          </div>
        </div>
      )}
    </div>
  )
}