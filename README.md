# Skylys Weather Dashboard

[aureliabutton]

A visually stunning, minimalist weather dashboard that replicates the 'Skylys' design while significantly enhancing functionality and visual polish. The application serves as a comprehensive weather station, providing real-time weather data, forecasts, and environmental details for cities worldwide.

## 🌟 Features

- **Global Search & Navigation:** Responsive header with 'Skylys' branding, 'Popular Cities' dropdown, and robust search with auto-suggestions.
- **Hero Weather Card:** Centerpiece component displaying current weather conditions, temperature, and detailed metrics (Feels like, Humidity, Wind speed, Pressure).
- **Nearby Places / Multi-City Grid:** Compare weather conditions across different regions easily.
- **5-Day Forecast:** Visual timeline of upcoming weather conditions.
- **Dynamic Backgrounds:** Subtle background shifts based on time of day and weather conditions.
- **Recent Searches:** History feature to quickly revisit previous locations.
- **Unit Toggling:** Switch between Celsius and Fahrenheit.
- **Cloudflare Workers Backend:** Proxies requests to open weather APIs for security and caching.

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, TypeScript
- **Styling:** Tailwind CSS, ShadCN UI, Framer Motion
- **State Management:** Zustand
- **Icons:** Lucide React
- **Charts:** Recharts
- **Backend:** Cloudflare Workers, Hono
- **Storage:** Cloudflare Durable Objects (for caching/persistence)
- **Package Manager:** Bun

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0.0 or higher)
- [Node.js](https://nodejs.org/) (v18 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/skylys-weather-dashboard.git
   cd skylys-weather-dashboard
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

### Development

Start the development server:

```bash
bun run dev
```

This command starts the Vite development server. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

To create a production build:

```bash
bun run build
```

## 📦 Deployment

This project is designed to be deployed on Cloudflare Workers.

[aureliabutton]

### Manual Deployment

1. Authenticate with Cloudflare:
   ```bash
   npx wrangler login
   ```

2. Deploy the project:
   ```bash
   bun run deploy
   ```

## 📂 Project Structure

```
├── src/
│   ├── components/     # UI components (ShadCN + Custom)
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities and API clients
│   ├── pages/          # Application pages
│   └── main.tsx        # Entry point
├── worker/
│   ├── index.ts        # Worker entry point
│   ├── user-routes.ts  # API routes definition
│   └── entities.ts     # Durable Object entities
├── shared/             # Types shared between frontend and worker
└── wrangler.jsonc      # Cloudflare configuration
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.