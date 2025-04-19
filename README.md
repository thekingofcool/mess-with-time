# Mess with Time

A comprehensive time manipulation toolkit that allows users to convert between time zones, work with timestamps, perform time calculations, and more.

## Features

- **Time Zone Converter**: Convert times between different time zones
- **Timestamp Converter**: Convert between human-readable dates and Unix timestamps
- **Time Calculator**: Calculate time differences or add/subtract time intervals
- **Current Time**: Display current time in various formats and time zones
- **Relative Time**: Calculate time differences between dates
- **Time Formatter**: Format dates and times in different styles

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- date-fns & date-fns-tz

## Getting Started

Follow these steps to set up the project locally:

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd mess-with-time

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Development

The app is structured as follows:

- `src/components/`: Contains the main components for each time tool
- `src/utils/`: Utility functions for date and time manipulation
- `src/pages/`: Page components (Index, NotFound)
- `src/lib/`: shadcn-ui component configurations

## Building for Production

To create a production build:

```sh
npm run build
```

To preview the production build locally:

```sh
npm run preview
```
