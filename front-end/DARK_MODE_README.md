# 🌙 Dark Mode Implementation

This document describes the comprehensive dark mode implementation for the Migdalor frontend application.

## ✨ Features

- **Automatic Theme Detection**: Detects system preference on first visit
- **Persistent Theme Storage**: Remembers user's theme choice in localStorage
- **Smooth Transitions**: All theme changes include smooth 300ms transitions
- **Comprehensive Coverage**: All pages and components support both themes
- **Creative Toggle**: Beautiful animated toggle switch with sun/moon icons
- **CSS Variables**: Uses CSS custom properties for easy theme management

## 🎨 Theme Colors

### Light Theme

- **Primary Background**: `#f3f4f6` (Light gray)
- **Secondary Background**: `#ffffff` (White)
- **Tertiary Background**: `#f9fafb` (Very light gray)
- **Primary Text**: `#111827` (Dark gray)
- **Secondary Text**: `#6b7280` (Medium gray)
- **Accent Color**: `#1f6231` (Green)

### Dark Theme

- **Primary Background**: `#0f172a` (Very dark blue)
- **Secondary Background**: `#1e293b` (Dark blue-gray)
- **Tertiary Background**: `#334155` (Medium blue-gray)
- **Primary Text**: `#f1f5f9` (Light gray)
- **Secondary Text**: `#cbd5e1` (Medium light gray)
- **Accent Color**: `#10b981` (Emerald green)

## 🛠️ Implementation Details

### 1. Theme Context (`src/contexts/ThemeContext.jsx`)

- Manages theme state globally
- Provides theme toggle functionality
- Handles localStorage persistence
- Detects system preference

### 2. Theme Toggle Component (`src/components/ThemeToggle.jsx`)

- Beautiful animated toggle switch
- Sun/moon icons that change with theme
- Gradient backgrounds for visual appeal
- Accessible with proper ARIA labels

### 3. CSS Variables (`src/index.css`)

- Comprehensive CSS custom properties
- Theme-aware utility classes
- Smooth transitions for all elements
- RTL/LTR support maintained

### 4. Updated Components

All major components have been updated to use theme-aware classes:

- **Pages**: HomePage, LoginPage, WorkersPage, ProductivityPage, StationPage, Settings
- **Components**: Navbar, NavItems, DateTime, UpdatesCards, ThemeDemo
- **Forms**: All input fields, buttons, and form elements

## 🎯 Usage

### Using Theme Context

```jsx
import { useTheme } from "@contexts/ThemeContext";

function MyComponent() {
  const { theme, toggleTheme, isDark, isLight } = useTheme();

  return (
    <div className={isDark ? "dark-styles" : "light-styles"}>
      <button onClick={toggleTheme}>
        Switch to {isDark ? "light" : "dark"} mode
      </button>
    </div>
  );
}
```

### Using Theme Utility Classes

```jsx
// Background colors
<div className="theme-bg-primary">Primary background</div>
<div className="theme-bg-secondary">Secondary background</div>
<div className="theme-bg-tertiary">Tertiary background</div>

// Text colors
<p className="theme-text-primary">Primary text</p>
<p className="theme-text-secondary">Secondary text</p>
<p className="theme-text-tertiary">Tertiary text</p>

// Borders and shadows
<div className="theme-border-primary theme-shadow-md">Card with border and shadow</div>

// Accent colors
<button className="theme-accent theme-accent-hover">Accent button</button>
```

### Using CSS Variables Directly

```css
.my-component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border-color: var(--border-primary);
  box-shadow: var(--shadow-md);
}
```

## 🚀 Getting Started

1. **Theme Toggle**: Located in the navbar (desktop) and mobile menu
2. **Automatic Detection**: First visit detects system preference
3. **Persistence**: Theme choice is saved and restored on reload
4. **Smooth Transitions**: All elements transition smoothly between themes

## 🎨 Customization

To add new theme-aware styles:

1. **Add CSS Variables**: Define new variables in `src/index.css`
2. **Create Utility Classes**: Add corresponding utility classes
3. **Update Components**: Use the new classes in components

Example:

```css
/* Add to :root and [data-theme="dark"] */
--my-custom-color: #ff0000;
--my-custom-color-dark: #ff6666;

/* Add utility class */
.theme-custom {
  color: var(--my-custom-color);
}
```

## 🔧 Technical Notes

- **Performance**: CSS variables provide excellent performance
- **Accessibility**: Proper contrast ratios maintained in both themes
- **Browser Support**: Works in all modern browsers
- **Mobile Responsive**: Theme toggle works on all screen sizes
- **RTL Support**: Maintains RTL/LTR functionality

## 🎉 Benefits

- **User Experience**: Users can choose their preferred theme
- **Accessibility**: Better for users with light sensitivity
- **Modern Feel**: Contemporary dark mode implementation
- **Maintainable**: Easy to update and extend
- **Consistent**: Unified theming across the entire application

The dark mode implementation is now fully integrated and ready to use! 🌙✨
