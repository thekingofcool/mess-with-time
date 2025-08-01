'use client'

import { useState } from 'react'
import { timestampToDate, dateToTimestamp, formatDateTime, convertTimezone, addTime, getLocalTimezone } from '@/utils/time'

const timeUnits = [
  { value: 'years', label: 'Years' },
  { value: 'months', label: 'Months' },
  { value: 'days', label: 'Days' },
  { value: 'hours', label: 'Hours' },
  { value: 'minutes', label: 'Minutes' },
  { value: 'seconds', label: 'Seconds' }
] as const

export function TimeConverter() {
  const [inputValue, setInputValue] = useState('')
  const [sourceTimezone, setSourceTimezone] = useState(getLocalTimezone())
  const [targetTimezone, setTargetTimezone] = useState('UTC')
  const [timeUnit, setTimeUnit] = useState<typeof timeUnits[number]['value']>('hours')
  const [timeAmount, setTimeAmount] = useState(0)

  const [result, setResult] = useState<{
    original: string
    converted: string
    timestamp: number
  } | null>(null)

  const handleConvert = () => {
    try {
      // Try parsing as timestamp first
      let date = new Date()
      if (/^\d+$/.test(inputValue)) {
        date = timestampToDate(parseInt(inputValue))
      } else {
        date = new Date(inputValue)
      }

      if (isNaN(date.getTime())) {
        throw new Error('Invalid date/timestamp')
      }

      // Convert timezone if needed
      const convertedDate = convertTimezone(date, sourceTimezone, targetTimezone)
      
      // Apply time arithmetic if amount is not 0
      const finalDate = timeAmount !== 0 
        ? addTime(convertedDate, timeAmount, timeUnit)
        : convertedDate

      setResult({
        original: formatDateTime(date, 'en', sourceTimezone),
        converted: formatDateTime(finalDate, 'en', targetTimezone),
        timestamp: dateToTimestamp(finalDate)
      })
    } catch (error) {
      console.error('Conversion error:', error)
      setResult(null)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Enter Timestamp or Date
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="1234567890 or 2023-01-01T00:00:00Z"
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Source Timezone
            </label>
            <input
              type="text"
              value={sourceTimezone}
              onChange={(e) => setSourceTimezone(e.target.value)}
              placeholder="America/New_York"
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Target Timezone
            </label>
            <input
              type="text"
              value={targetTimezone}
              onChange={(e) => setTargetTimezone(e.target.value)}
              placeholder="UTC"
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Add/Subtract Time
            </label>
            <input
              type="number"
              value={timeAmount}
              onChange={(e) => setTimeAmount(parseInt(e.target.value) || 0)}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Time Unit
            </label>
            <select
              value={timeUnit}
              onChange={(e) => setTimeUnit(e.target.value as typeof timeUnit)}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
            >
              {timeUnits.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleConvert}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Convert
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <h3 className="font-medium mb-2">Results:</h3>
          <div className="space-y-2">
            <p>Original: {result.original}</p>
            <p>Converted: {result.converted}</p>
            <p>Timestamp: {result.timestamp}</p>
          </div>
        </div>
      )}
    </div>
  )
}