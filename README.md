# HumanUtils Monorepo

Developer utilities available as both a mobile/web app and standalone CLI.

## Packages

### [@human-utils/cli](./packages/cli)
Standalone CLI tool and Node.js library. **Zero React Native dependencies.**

- Install globally: `npm install -g @human-utils/cli`
- Package size: ~5MB
- Use in scripts, CI/CD, or as a library

### [@human-utils/app](./packages/app)
React Native + Expo mobile and web application.

- Full UI with copy/paste, file operations
- Cross-platform (iOS, Android, Web)
- Uses @human-utils/cli for all tool logic

## Why Monorepo?

**Problem**: Users installing the CLI were downloading 300MB of React Native dependencies they didn't need.

**Solution**: 
- CLI package is standalone (minimal dependencies)
- App package imports from CLI package (DRY)
- Shared tool logic in one place

## Development

```bash
# Install all dependencies
npm install

# Run CLI
npm run cli uuid generate

# Run app
npm run app:start      # Expo dev server
npm run app:web        # Web version
npm run app:android    # Android
npm run app:ios        # iOS
```

## Tools Included

- **UUID Generator**: v1, v4, v5, v7 with validation
- **Base64 Encoder**: Standard and URL-safe encoding/decoding
- **JSON Formatter**: Format, minify, validate with error locations
- **Lorem Ipsum**: Words, sentences, paragraphs generation

## Publishing

```bash
# Publish CLI only (no RN dependencies)
cd packages/cli
npm publish

# App stays private (not published to npm)
```

## License

MIT
