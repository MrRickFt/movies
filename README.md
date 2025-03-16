# MovieApp

A movie discovery application built with Angular 17, Angular Material, and Firebase. This application allows users to browse popular, now playing, and top-rated movies with a sleek, responsive UI.

## Features

- **User Authentication**: Login with Google through Firebase Authentication
- **Movie Categories**: Browse movies by popular, now playing, and top-rated categories
- **Movie Details**: View comprehensive information about each movie
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Favorites System**: Save and manage your favorite movies

## Technology Stack

- **Frontend**: Angular 17, Angular Material, RxJS
- **Authentication**: Firebase Authentication
- **State Management**: RxJS
- **Styling**: SCSS 

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v17 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/url-proyect
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create `src/environments/environment.ts` and `src/environments/environment.prod.ts`
   - Add your Firebase configuration and any API keys

Example environment file:
```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  },
  tmdbApiKey: "YOUR_TMDB_API_KEY",
  tmdbBaseUrl: "https://api.themoviedb.org/3"
};
```

## Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

```bash
npm start
```

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

```bash
npm run build
```


## Project Structure

```
src/
├── app/
│   ├── core/               # Core functionality, services, guards, interfaces
│   │   ├── factories/      # Factory pattern implementations
│   │   ├── guards/         # Route guards
│   │   ├── interfaces/     # TypeScript interfaces
│   │   └── services/       # Shared services
│   ├── features/           # Feature modules
│   │   ├── auth/           # Authentication components
│   │   └── movies/         # Movie-related components
│   ├── shared/             # Shared modules, components, and utilities
│   │   ├── components/     # Reusable components
│   │   └── material.module.ts # Angular Material imports
│   └── app.component.ts    # Root component
├── assets/                 # Static assets like images and icons
├── environments/           # Environment configuration
└── styles.scss             # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

m