# HumanUtils

> The web's swiss army knife of utility tools.

**One app. Countless tools. Zero friction.**

HumanUtils is a multi-platform developer toolkit designed to centralise everyday utilities without ads, tracking, or bloat. Fast, clean, and offline-capable — built for web, mobile, desktop and even your CLI.

---

## 🎯 Purpose

Most developer tool websites are slow, cluttered, and riddled with ads. HumanUtils fixes that by providing:

- ⚡ **Instant results** — even with large inputs
- 🚫 **No analytics, no ads, no BS**
- 📦 **Self-contained & predictable**
- 🧩 **Modular architecture** — every tool is independent
- 🌐 **Multi-platform** — web, Android, iOS, desktop
- 🔓 **Open-source & transparent**

---

## 🏗️ Architecture

```
/App.tsx            → Application entry point
/index.ts           → Root index
/src
  /components       → Reusable UI components (Container, SearchBar, CategoryCard)
  /constants        → Static data (tool categories, app config)
  /navigation       → React Navigation setup (RootNavigator)
  /screens          → Screen wrappers (HomeScreen, tool screens)
  /theme            → Design system (colors, typography, spacing, ThemeContext)
  /tools            → Self-contained tool modules
    /json-formatter
      logic.ts      → Pure business logic (platform-agnostic)
      screen.tsx    → React Native UI wrapper
      types.ts      → Tool-specific types
    /uuid-generator
    /base64-encoder
    ...
  /utils            → Shared utilities (used by multiple tools)
    /formatters     → String, number, date formatting
    /validators     → Input validation logic
    /converters     → Base64, color, unit conversions
    /crypto         → Hashing functions
    /clipboard      → Copy/paste utilities
    /storage        → Local storage wrappers
```

**Design Principles:**
- Each tool is self-contained with pure logic layer (UI-agnostic)
- Shared utilities organized by function type for maximum reusability
- Component-driven architecture with React Navigation
- Custom theme system with Light/Dark mode support
- SaaS-inspired layout with max-width containers

---

## 🚀 Tech Stack

- **Framework:** React Native + Expo
- **Language:** TypeScript
- **Platforms:** 
  - Web (Phase 1)
  - CLI (Phase 1)
  - Mobile - iOS & Android (planned, later phase)
  - Desktop (planned, Phase 3)
- **Tooling:** ESLint, Prettier
- **Testing:** Vitest + React Testing Library (planned)

---

## 📦 Using HumanUtils

**Initial Release (Phase 1):**
- **Web:** Visit [humanutils.io](https://humanutils.io) (coming soon)
- **CLI:** `npm install -g human-utils` (coming soon)

**Future Releases:**
- **Mobile:** iOS & Android apps (planned for later phase)
- **Desktop:** Standalone desktop application (Phase 3)

Most tools run entirely client-side in your browser or on your device. Optional features like account sync require authentication but do not track or sell your data.

---

## 🗺️ Development Roadmap

### Phase 0: Foundation ✅
- [x] Project setup & Expo installation
- [x] Design system (theme, colors, typography, spacing)
- [x] Navigation architecture
- [x] Home screen with tool categories

### Phase 1: Core Utilities (In Progress)
**Goal:** Build essential developer tools with full platform support

**Tools:**
- JSON formatter & validator
- UUID generator
- Base64 encoder/decoder
- Timestamp ↔ Date converter
- Regex tester
- Hashing functions (SHA, MD5, etc.)
- Colour converters (RGB ↔ HEX ↔ HSL)
- Text utilities (slugify, case converter, lorem ipsum)
- URL encoder/decoder
- Number + unit converters

**Strategy:**
- Each tool built with pure logic layer (UI-agnostic)
- CLI framework established alongside GUI development
- Core logic shared between all platforms
- Testing for both GUI and CLI interfaces

**Deliverables:**
- Web app deployment (humanutils.io)
- CLI tool with Phase 1 utilities
- Mobile apps moved to later phase due to distribution costs

### Phase 2: Advanced Tools
**Goal:** Expand toolkit with more complex utilities

**Tools:**
- Password generator
- Diff/compare tool
- Markdown previewer
- Image compression (client-side)
- QR code generator/reader
- JWT debugger
- HTML/JS minifier
- CSV ↔ JSON converter
- IP/network utilities

**Strategy:**
- Continue CLI-first architecture pattern
- Add advanced features to existing tools
- Introduce optional cloud features (sync, history)

### Phase 3: Polish & Expansion
- Desktop builds (Electron or similar)
- Performance optimization
- Offline support & PWA features
- Comprehensive testing suite
- Advanced CLI features (piping, chaining tools)
- User accounts & sync (optional)

---

## 🎨 Design Philosophy

- Clean, minimal, tech-forward aesthetic
- CLI-inspired monochrome palette
- No unnecessary visual clutter
- Typography and spacing via design tokens
- React Native-compatible primitives

---

## 📄 License

[MIT License](LICENSE)

---

## 🔗 Links

- **Repository:** [github.com/is-Lewis/human-utils](https://github.com/is-Lewis/human-utils)
- **Website:** Coming soon (humanutils.io)

---

**Built with ❤️ by developers, for developers.**
