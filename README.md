# BuildClub Global Events Map

A Next.js application that displays BuildClub events on an interactive global map using Leaflet and the Luma API.

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- A Luma API key

### Environment Setup

1. Create a `.env.local` file in the root directory
2. Add the following environment variables:

```env
LUMA_API_KEY=your_luma_api_key_here
```

You can obtain a Luma API key from the [Luma Dashboard](https://lu.ma/settings/api).

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Interactive global map showing BuildClub events
- Real-time event data from Luma API
- Event details with location and timing
- Country-wise event grouping
- Responsive design with dark mode support

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [React Leaflet](https://react-leaflet.js.org/) - Maps integration
- [Luma API](https://lu.ma/api) - Events data
- TypeScript
- Tailwind CSS

## Project Structure

```
├── app/
│   ├── api/
│   │   └── events/     # API routes
│   ├── components/     # React components
│   └── public/         # Static assets
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

