# Migdalor Frontend

A modern React-based frontend application for the Migdalor production management system, built with Vite and featuring a responsive design with multi-language support.

## 🚀 Features

### Core Functionality

- **Employee Management** - Complete CRUD operations for employee data
- **Station Management** - Work station configuration and monitoring
- **Assignment System** - Daily and weekly employee assignments with multi-employee support
- **Production Dashboard** - Real-time production metrics and charts
- **User Authentication** - Secure login with role-based access control
- **Reports Generation** - PDF export and data visualization

### UI/UX Features

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Dark/Light Theme** - Automatic theme switching with system preference detection
- **Multi-language Support** - Hebrew and English with RTL support
- **Real-time Updates** - Live data synchronization via MQTT
- **Interactive Charts** - Production data visualization with Chart.js
- **Modal Dialogs** - User-friendly forms and confirmations

## 🛠️ Technology Stack

- **React 19.1.1** - Modern React with hooks and functional components
- **Vite 7.1.2** - Fast build tool and development server
- **Tailwind CSS 4.1.12** - Utility-first CSS framework
- **React Router 7.8.2** - Client-side routing
- **Chart.js 4.5.0** - Data visualization library
- **i18next 25.5.2** - Internationalization framework
- **Axios 1.11.0** - HTTP client for API communication
- **Lucide React 0.542.0** - Beautiful icon library

## 📦 Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Setup

1. **Clone and navigate to frontend directory:**

   ```bash
   cd front-end
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create environment file:**

   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**

   ```env
   # API Configuration
   VITE_REACT_APP_SERVER_URL=http://localhost:8080

   # Application Configuration
   VITE_APP_NAME=Migdalor
   VITE_APP_VERSION=1.0.0

   # Debug Mode (optional)
   VITE_DEBUG=false

   # Build Configuration
   VITE_BUILD_TARGET=production
   ```

5. **Start development server:**

   ```bash
   npm run dev
   ```

6. **Open in browser:**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
front-end/
├── public/                 # Static assets
│   ├── loginPic.webp
│   ├── migdalorLogo.webp
│   └── manifest.json
├── src/
│   ├── api/               # API utilities
│   │   └── http.js        # Axios configuration
│   ├── components/        # Reusable components
│   │   ├── employees/     # Employee-related components
│   │   ├── reports/       # Report components
│   │   ├── stations/      # Station components
│   │   └── users/         # User management components
│   ├── config/            # Configuration files
│   │   └── api.js         # API endpoints
│   ├── constants/         # Application constants
│   │   ├── departments.js
│   │   └── status.js
│   ├── contexts/          # React contexts
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useFilterParams.js
│   │   └── useMe.js
│   ├── i18n/              # Internationalization
│   │   ├── index.js
│   │   └── locales/
│   │       ├── en.json
│   │       └── he.json
│   ├── pages/             # Page components
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ProductionPage.jsx
│   │   ├── ReportsPage.jsx
│   │   ├── SettingsPage.jsx
│   │   ├── StationPage.jsx
│   │   ├── WorkersPage.jsx
│   │   ├── UserManualPage.jsx
│   │   └── DeveloperManualPage.jsx
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── dist/                  # Production build output
├── package.json
├── vite.config.js
├── tailwind.config.js
└── eslint.config.js
```

## 🎨 Component Architecture

### Core Components

#### **Authentication**

- `LoginPage` - User authentication interface
- `AuthContext` - Global authentication state management
- `ProtectedRoute` - Route protection wrapper

#### **Employee Management**

- `EmployeeList` - Employee listing with search and filters
- `AddEmployeeForm` - Employee creation form
- `EditEmployeeForm` - Employee editing interface
- `EmployeeCard` - Employee display card
- `StatusDropdown` - Employee status selection

#### **Station Management**

- `StationManagement` - Station CRUD operations
- `StationItem` - Individual station display
- `StationSelector` - Station selection dropdown
- `AddAssignmentForm` - Assignment creation form

#### **Assignment System**

- `AssignmentComp` - Main assignment component
- `WeeklyTable` - Weekly assignment view
- `MultiEmployeeSelector` - Multi-employee selection
- `DepartmentDropdown` - Department filtering

#### **Reports & Analytics**

- `ReportGenerator` - Report creation interface
- `ReportDisplay` - Report visualization
- `ProductionEfficiencyChart` - Production metrics charts
- `DepartmentPerformanceOverview` - Department analytics

## 🌐 Internationalization

The application supports Hebrew and English with RTL (Right-to-Left) support for Hebrew.

### Adding New Translations

1. **Add translation keys to locale files:**

   ```json
   // src/i18n/locales/en.json
   {
     "newFeature": {
       "title": "New Feature",
       "description": "Feature description"
     }
   }
   ```

2. **Use translations in components:**

   ```jsx
   import { useTranslation } from "react-i18next";

   const { t } = useTranslation();
   return <h1>{t("newFeature.title")}</h1>;
   ```

### RTL Support

The application automatically detects language direction and applies appropriate CSS classes for RTL layout.

## 🎨 Theming

### Theme System

The application supports both light and dark themes with automatic system preference detection.

#### **Theme Context**

```jsx
import { useTheme } from "../contexts/ThemeContext";

const { theme, toggleTheme } = useTheme();
```

#### **Theme Classes**

- `theme-bg-primary` - Primary background
- `theme-bg-secondary` - Secondary background
- `theme-text-primary` - Primary text color
- `theme-text-secondary` - Secondary text color
- `theme-border-primary` - Primary border color
- `theme-accent` - Accent color

### Customizing Themes

Edit the CSS variables in `src/index.css`:

```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #000000;
  /* ... other variables */
}

[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
  /* ... dark theme variables */
}
```

## 📱 Responsive Design

The application is built with a mobile-first approach using Tailwind CSS.

### Breakpoints

- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up

### Responsive Components

All components are designed to work seamlessly across different screen sizes:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

## 🔧 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Code Style

The project uses ESLint for code quality and consistency:

```bash
npm run lint
```

### Component Guidelines

1. **Functional Components** - Use functional components with hooks
2. **Props Validation** - Use TypeScript or PropTypes for prop validation
3. **State Management** - Use React Context for global state
4. **Styling** - Use Tailwind CSS classes
5. **Naming** - Use PascalCase for components, camelCase for functions

### Adding New Features

1. **Create component structure:**

   ```
   src/components/new-feature/
   ├── NewFeature.jsx
   ├── NewFeatureForm.jsx
   └── index.js
   ```

2. **Add routing:**

   ```jsx
   // In App.jsx
   <Route path="/new-feature" element={<NewFeaturePage />} />
   ```

3. **Add translations:**
   ```json
   // In locale files
   "newFeature": { "title": "New Feature" }
   ```

## 🧪 Testing

### Running Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run end-to-end tests
npm run e2e

# Run e2e tests with UI
npm run e2e:ui
```

### Test Structure

```
src/
├── components/
│   └── __tests__/          # Component unit tests
│       ├── DateTime.test.jsx
│       ├── ErrorMessage.test.jsx
│       ├── LanguageSwitcher.test.jsx
│       ├── Navbar.test.jsx
│       ├── ProtectedRoute.test.jsx
│       └── ThemeToggle.test.jsx
├── pages/
│   └── __tests__/          # Page component tests
│       ├── HomePage.test.jsx
│       ├── LoginPage.test.jsx
│       ├── ProductionPage.test.jsx
│       ├── ReportsPage.test.jsx
│       └── SettingsPage.test.jsx
├── hooks/
│   └── __tests__/          # Custom hook tests
│       └── useMe.test.jsx
├── contexts/
│   └── __tests__/          # Context tests
│       ├── AuthContext.test.jsx
│       └── ThemeContext.test.jsx
└── tests/
    └── e2e/                # End-to-end tests
        ├── auth.spec.ts
        ├── home.spec.ts
        ├── navbar.spec.ts
        ├── production.spec.ts
        ├── reports.spec.ts
        ├── settings.spec.ts
        ├── station.spec.ts
        └── user-management.spec.ts
```

### Testing Technologies

- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing utilities
- **Playwright** - End-to-end testing
- **Jest DOM** - DOM testing utilities

### Writing Tests

#### Unit Tests Example

```jsx
// src/components/__tests__/Button.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../Button";

describe("Button Component", () => {
  it("renders button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### E2E Tests Example

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from "@playwright/test";

test("user can login", async ({ page }) => {
  await page.goto("/login");

  await page.fill('[data-testid="username"]', "testuser");
  await page.fill('[data-testid="password"]', "password");
  await page.click('[data-testid="login-button"]');

  await expect(page).toHaveURL("/");
  await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
});
```

## 📦 Building for Production

### Build Process

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

### Build Optimization

- **Code Splitting** - Automatic code splitting for better performance
- **Tree Shaking** - Unused code elimination
- **Minification** - JavaScript and CSS minification
- **Asset Optimization** - Image and font optimization

### Environment Variables

Production environment variables:

```env
# API Configuration
VITE_REACT_APP_SERVER_URL=https://your-production-api.com

# Application Configuration
VITE_APP_NAME=Migdalor
VITE_APP_VERSION=1.0.0

# Debug Mode (set to false for production)
VITE_DEBUG=false

# Build Configuration
VITE_BUILD_TARGET=production
```

## 🚀 Deployment

### AWS Amplify

1. Connect GitHub repository
2. Set build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Add environment variables
4. Deploy

### Other Platforms

- **Vercel** - Zero-config deployment
- **Netlify** - Drag and drop deployment
- **GitHub Pages** - Free hosting for static sites

## 🔍 Performance Optimization

### Bundle Analysis

```bash
npm run build
npx vite-bundle-analyzer dist
```

### Performance Tips

1. **Lazy Loading** - Use React.lazy() for code splitting
2. **Memoization** - Use React.memo() for expensive components
3. **Virtual Scrolling** - For large lists
4. **Image Optimization** - Use WebP format and lazy loading

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**

   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **API Connection Issues**

   - Check `VITE_REACT_APP_SERVER_URL` environment variable
   - Verify backend server is running
   - Check CORS configuration

3. **Theme Issues**
   - Clear browser cache
   - Check CSS variable definitions
   - Verify theme context provider

### Debug Mode

Enable debug mode in development:

```env
VITE_DEBUG=true
```

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Chart.js Documentation](https://www.chartjs.org/)
- [i18next Documentation](https://www.i18next.com/)

---

**Migdalor Frontend** - Modern, responsive, and feature-rich production management interface.
