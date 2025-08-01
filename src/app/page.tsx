import { Header } from '@/components/Header'
import { TimeConverter } from '@/components/TimeConverter'
import { HolidayDisplay } from '@/components/HolidayDisplay'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TimeConverter />

            <section className="mt-16">
              <h2 className="text-2xl font-bold mb-6">About Timestamps</h2>
              
              <div className="prose dark:prose-invert">
                <h3>What is a Timestamp?</h3>
                <p>
                  A timestamp is a sequence of characters or encoded information identifying when a certain event occurred, 
                  usually giving date and time of day, sometimes accurate to a small fraction of a second.
                </p>

                <h3>Unix Timestamp</h3>
                <p>
                  The Unix timestamp is the number of seconds that have elapsed since January 1, 1970 (midnight UTC/GMT), 
                  not counting leap seconds. It is widely used in Unix systems and programming in general.
                </p>

                <h3>Common Use Cases</h3>
                <ul>
                  <li>Database records to track when entries were created or modified</li>
                  <li>Log files to record when events occurred</li>
                  <li>Version control systems to track when changes were made</li>
                  <li>Message systems to record when messages were sent or received</li>
                  <li>File systems to track when files were created, modified, or accessed</li>
                </ul>

                <h3>Different Timestamp Formats</h3>
                <ul>
                  <li>Unix Timestamp (e.g., 1625097600)</li>
                  <li>ISO 8601 (e.g., 2021-07-01T00:00:00Z)</li>
                  <li>RFC 2822 (e.g., Thu, 01 Jul 2021 00:00:00 +0000)</li>
                  <li>Human Readable (e.g., July 1, 2021 12:00 AM UTC)</li>
                </ul>
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <HolidayDisplay />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
