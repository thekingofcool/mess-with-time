# Mess with Time

A versatile time conversion and manipulation tool built with Next.js. This web application provides an intuitive interface for working with timestamps, timezones, and date formats, along with educational content about time-related concepts.

## Features

- 🕒 Timestamp Conversion
  - Convert between Unix timestamps and human-readable formats
  - Support for multiple date formats (ISO 8601, RFC 2822, etc.)

- 🌍 Timezone Handling
  - Convert times between different timezones
  - Automatic local timezone detection
  - Support for all major timezone formats

- ⚡ Time Arithmetic
  - Add or subtract time units (years, months, days, hours, minutes, seconds)
  - Easy-to-use interface for time calculations

- 🎯 Additional Features
  - Display current holidays in major countries
  - Dark/Light theme support
  - Multi-language support (EN, CN, ES, FR, DE, RU)
  - Responsive design for all devices
  - Educational content about timestamps and time formats

## Tech Stack

- Next.js 13+ with App Router
- TypeScript
- Tailwind CSS
- next-themes for dark mode
- next-i18next for internationalization
- date-fns for time manipulation
- Nager.Date API for holiday information

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mess-with-time.git
   cd mess-with-time
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is configured for deployment on Cloudflare Pages. The deployment process is automated through GitHub Actions.

### Manual Deployment Steps

1. Build the project:
   ```bash
   npm run build
   ```

2. Test the production build locally:
   ```bash
   npm run start
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
