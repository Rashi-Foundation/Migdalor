# Internationalization (i18n) Implementation

This project now supports multi-language functionality with English and Hebrew translations.

## Features

- ✅ **Dual Language Support**: English and Hebrew
- ✅ **Language Switcher**: Earth icon button in the top-right corner
- ✅ **RTL Support**: Automatic right-to-left layout for Hebrew
- ✅ **Persistent Language**: Language preference saved in localStorage
- ✅ **Component-based Translations**: Organized by component/file structure
- ✅ **Fallback Support**: Falls back to Hebrew if translation missing

## File Structure

```
src/i18n/
├── index.js              # i18n configuration
├── locales/
│   ├── en.json          # English translations
│   └── he.json          # Hebrew translations
└── README.md            # This file
```

## Translation Structure

Translations are organized by component/file name for easy maintenance:

```json
{
  "common": {
    "login": "Login",
    "logout": "Logout"
    // ... common terms
  },
  "navbar": {
    "home": "Home",
    "employees": "Employees"
    // ... navbar items
  },
  "loginPage": {
    "title": "Login",
    "usernameLabel": "Username"
    // ... login page specific
  }
  // ... other components
}
```

## Usage in Components

### Basic Usage

```jsx
import { useTranslation } from "react-i18next";

const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("common.title")}</h1>
      <p>{t("myComponent.description")}</p>
    </div>
  );
};
```

### With Interpolation

```jsx
// In translation file
{
  "validation": {
    "minLength": "Minimum length is {{count}} characters"
  }
}

// In component
<p>{t('validation.minLength', { count: 10 })}</p>
```

## Language Switcher

The language switcher component is automatically included in:

- Desktop: Top-right corner of navbar
- Mobile: In the mobile menu

### Features:

- Earth icon (🌍) with flag indicators
- Dropdown with current language highlighted
- Smooth transitions
- RTL/LTR direction switching

## RTL Support

The implementation includes comprehensive RTL support:

### CSS Classes

- `[dir="rtl"]` and `[dir="ltr"]` selectors
- Automatic margin adjustments for spacing
- Text alignment controls

### Automatic Direction Switching

- Document direction changes automatically
- Language attribute updates
- CSS classes applied dynamically

## Adding New Translations

### 1. Add to Translation Files

Add new keys to both `en.json` and `he.json`:

```json
// en.json
{
  "newComponent": {
    "title": "New Component",
    "description": "This is a new component"
  }
}

// he.json
{
  "newComponent": {
    "title": "רכיב חדש",
    "description": "זהו רכיב חדש"
  }
}
```

### 2. Use in Component

```jsx
import { useTranslation } from "react-i18next";

const NewComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("newComponent.title")}</h1>
      <p>{t("newComponent.description")}</p>
    </div>
  );
};
```

## Best Practices

### 1. Translation Key Naming

- Use component/file name as top-level key
- Use descriptive, hierarchical keys
- Keep keys consistent between languages

### 2. Text Organization

- Group related translations together
- Use common keys for repeated terms
- Keep translations contextually relevant

### 3. RTL Considerations

- Test both languages thoroughly
- Consider text length differences
- Ensure UI elements work in both directions

### 4. Performance

- Translations are loaded on demand
- Language switching is instant
- No page reload required

## Configuration

The i18n configuration is in `src/i18n/index.js`:

```javascript
// Language detection order
detection: {
  order: ['localStorage', 'navigator', 'htmlTag'],
  caches: ['localStorage'],
}

// Fallback language
fallbackLng: 'he' // Hebrew as default

// RTL languages
const rtlLanguages = ['he', 'ar', 'fa'];
```

## Troubleshooting

### Common Issues

1. **Translation not showing**: Check if key exists in both language files
2. **RTL not working**: Ensure `document.documentElement.dir` is set correctly
3. **Language not persisting**: Check localStorage for language preference
4. **Styling issues**: Verify RTL-specific CSS classes are applied

### Debug Mode

Enable debug mode in `src/i18n/index.js`:

```javascript
debug: true, // Set to true for debugging
```

This will log translation keys and missing translations to the console.

## Future Enhancements

- [ ] Add more languages (Arabic, French, etc.)
- [ ] Implement pluralization rules
- [ ] Add date/time localization
- [ ] Number formatting per locale
- [ ] Lazy loading of translation files
