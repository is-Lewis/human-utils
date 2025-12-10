# HumanUtils

> The web's swiss army knife of utility tools.

**One app. Countless tools. Zero friction.**

HumanUtils is a multi-platform developer toolkit designed to centralise everyday technical utilities without ads, tracking, or bloat. Fast, clean, and offline-capable — built for web, mobile, and desktop.

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

## 🛠️ Planned Tools

### Phase 1 (Core Utilities)
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

### Phase 2 (Advanced Tools)
- Password generator
- Diff/compare tool
- Markdown previewer
- Image compression (client-side)
- QR code generator/reader
- JWT debugger
- HTML/JS minifier
- CSV ↔ JSON converter
- IP/network utilities

---

## 🏗️ Architecture

```
/app                → Entry point (React Native + web)
/src
  /tools            → Each tool isolated as its own module
  /common           → Shared logic (validation, formatting, helpers)
  /ui               → Reusable interface components
  /theme            → Design tokens, colours, spacing, typography
```

Each tool is self-contained with:
- Pure TypeScript logic
- UI component/screen
- Typed interfaces
- Independent tests

---

## 🚀 Tech Stack

- **Framework:** React Native + Expo
- **Language:** TypeScript
- **Platforms:** Web, iOS, Android, Desktop
- **Tooling:** ESLint, Prettier
- **Testing:** Vitest + React Testing Library (planned)

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/is-Lewis/human-utils.git
cd human-utils

# Install dependencies
npm install

# Start development server
npm start
```

### Run on specific platforms

```bash
npm run web      # Web browser
npm run android  # Android emulator/device
npm run ios      # iOS simulator (macOS only)
```

---

## 🗺️ Roadmap

- [x] **Phase 0:** Project setup & Expo installation
- [ ] **Phase 1:** Foundation (project structure, design system, UI primitives)
- [ ] **Phase 2:** Core tool set (JSON, UUID, Base64, timestamps, etc.)
- [ ] **Phase 3:** Platform expansion (web deploy, desktop, mobile builds)
- [ ] **Phase 4:** Quality & polish (testing, performance, offline support)

---

## 🎨 Design Philosophy

- Clean, minimal, tech-forward aesthetic
- CLI-inspired monochrome palette
- No unnecessary visual clutter
- Typography and spacing via design tokens
- React Native-compatible primitives

---

## 🤝 Contributing

Contributions are welcome! This project follows a strict modular architecture — each tool should be:

1. Self-contained in `/src/tools/<tool-name>`
2. Fully typed with TypeScript
3. Tested independently
4. UI-agnostic (logic separate from presentation)

More contribution guidelines coming soon.

---

## 📄 License

[MIT License](LICENSE)

---

## 🔗 Links

- **Repository:** [github.com/is-Lewis/human-utils](https://github.com/is-Lewis/human-utils)
- **Website:** Coming soon (humanutils.io)

---

**Built with ❤️ by developers, for developers.**
