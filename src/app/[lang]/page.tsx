import { Header } from '@/components/Header'
import { TimeConverter } from '@/components/TimeConverter'

const translations = {
  en: {
    about: 'About Timestamps',
    whatIs: 'What is a Timestamp?',
    whatIsDesc: 'A timestamp is a sequence of characters or encoded information identifying when a certain event occurred, usually giving date and time of day, sometimes accurate to a small fraction of a second.',
    unixTimestamp: 'Unix Timestamp',
    unixDesc: 'The Unix timestamp is the number of seconds that have elapsed since January 1, 1970 (midnight UTC/GMT), not counting leap seconds. It is widely used in Unix systems and programming in general.',
    useCases: 'Common Use Cases',
    useCasesList: [
      'Database records to track when entries were created or modified',
      'Log files to record when events occurred',
      'Version control systems to track when changes were made',
      'Message systems to record when messages were sent or received',
      'File systems to track when files were created, modified, or accessed'
    ],
    formats: 'Different Timestamp Formats',
    formatsList: [
      'Unix Timestamp (e.g., 1625097600)',
      'ISO 8601 (e.g., 2021-07-01T00:00:00Z)',
      'RFC 2822 (e.g., Thu, 01 Jul 2021 00:00:00 +0000)',
      'Human Readable (e.g., July 1, 2021 12:00 AM UTC)'
    ]
  },
  zh: {
    about: '关于时间戳',
    whatIs: '什么是时间戳？',
    whatIsDesc: '时间戳是一串字符或编码信息，用于标识某个事件发生的时间，通常包含日期和时间，有时精确到小数点后的秒数。',
    unixTimestamp: 'Unix时间戳',
    unixDesc: 'Unix时间戳是自1970年1月1日（UTC/GMT午夜）以来经过的秒数，不计闰秒。它在Unix系统和一般编程中被广泛使用。',
    useCases: '常见用途',
    useCasesList: [
      '数据库记录，用于追踪条目的创建或修改时间',
      '日志文件，用于记录事件发生的时间',
      '版本控制系统，用于追踪更改的时间',
      '消息系统，用于记录消息的发送或接收时间',
      '文件系统，用于追踪文件的创建、修改或访问时间'
    ],
    formats: '不同的时间戳格式',
    formatsList: [
      'Unix时间戳（例如：1625097600）',
      'ISO 8601（例如：2021-07-01T00:00:00Z）',
      'RFC 2822（例如：Thu, 01 Jul 2021 00:00:00 +0000）',
      '人类可读格式（例如：2021年7月1日 12:00 UTC）'
    ]
  },
  es: {
    about: 'Sobre las Marcas de Tiempo',
    whatIs: '¿Qué es una Marca de Tiempo?',
    whatIsDesc: 'Una marca de tiempo es una secuencia de caracteres o información codificada que identifica cuándo ocurrió un evento, generalmente proporcionando fecha y hora del día, a veces precisa hasta una pequeña fracción de segundo.',
    unixTimestamp: 'Marca de Tiempo Unix',
    unixDesc: 'La marca de tiempo Unix es el número de segundos transcurridos desde el 1 de enero de 1970 (medianoche UTC/GMT), sin contar los segundos bisiestos. Se utiliza ampliamente en sistemas Unix y en programación en general.',
    useCases: 'Casos de Uso Comunes',
    useCasesList: [
      'Registros de base de datos para rastrear cuándo se crearon o modificaron las entradas',
      'Archivos de registro para registrar cuándo ocurrieron los eventos',
      'Sistemas de control de versiones para rastrear cuándo se realizaron los cambios',
      'Sistemas de mensajes para registrar cuándo se enviaron o recibieron los mensajes',
      'Sistemas de archivos para rastrear cuándo se crearon, modificaron o accedieron a los archivos'
    ],
    formats: 'Diferentes Formatos de Marca de Tiempo',
    formatsList: [
      'Marca de tiempo Unix (ej: 1625097600)',
      'ISO 8601 (ej: 2021-07-01T00:00:00Z)',
      'RFC 2822 (ej: Thu, 01 Jul 2021 00:00:00 +0000)',
      'Formato legible (ej: 1 de julio de 2021 12:00 AM UTC)'
    ]
  }
}

interface HomeProps {
  params: { lang: string }
}

export default async function Home({ params }: HomeProps) {
  const lang = params.lang as keyof typeof translations
  const t = translations[lang] || translations.en

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <TimeConverter />
          </div>

          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">{t.about}</h2>
            
            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-xl font-semibold mb-3">{t.whatIs}</h3>
              <p className="mb-6">{t.whatIsDesc}</p>

              <h3 className="text-xl font-semibold mb-3">{t.unixTimestamp}</h3>
              <p className="mb-6">{t.unixDesc}</p>

              <h3 className="text-xl font-semibold mb-3">{t.useCases}</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                {t.useCasesList.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <h3 className="text-xl font-semibold mb-3">{t.formats}</h3>
              <ul className="list-disc pl-6 space-y-2">
                {t.formatsList.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}