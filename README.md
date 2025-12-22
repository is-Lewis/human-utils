# HumanUtils

Everyday utilities for everyone. Available as a command-line tool and mobile/web app.

Whether you're a developer generating UUIDs, a writer needing placeholder text, or anyone working with data formats - HumanUtils has the tools you need.

## 🚀 Quick Start

### CLI Installation

```bash
npm install -g @human-utils/cli
```

### Usage

```bash
# Generate UUIDs
hu uuid generate                              # UUID v4
hu uuid generate -v v7                        # Timestamp-based
hu uuid generate -v v5 --namespace DNS --name example.com

# Base64 encoding
hu base64 encode "Hello World"
hu base64 decode "SGVsbG8gV29ybGQ="

# JSON formatting
hu json format input.json -o formatted.json
hu json minify large.json --output compressed.json

# Lorem Ipsum generation
hu lorem words 50
hu lorem sentences 5 --start-with-lorem
hu lorem paragraphs 3 --html
```

## 🛠 Tools

### UUID Generator
Generate and validate unique identifiers for databases, APIs, and tracking:
- **v1**: Time-based (includes timestamp and MAC address)
- **v4**: Random (cryptographically secure)
- **v5**: Name-based (deterministic, same input = same UUID)
- **v7**: Timestamp-sortable (ideal for database keys)

### Base64 Encoder/Decoder
Encode and decode text for safe data transfer:
- Standard Base64 encoding
- URL-safe variant support
- Automatic format detection
- File encoding support

### JSON Formatter
Format, minify, and validate JSON data with detailed error reporting:
- Pretty print with configurable indentation
- Minification for storage optimization
- Validation with line/column error locations
- Key sorting option

### Lorem Ipsum Generator
Generate placeholder text for designs, mockups, and content layouts:
- Words, sentences, or paragraphs
- Option to start with "Lorem ipsum dolor sit amet"
- HTML paragraph wrapping
- Configurable output length

## 📦 Use as Library

```typescript
import { generateUUID, encodeBase64, formatJson, generateLorem } from '@human-utils/cli';

const uuid = generateUUID('v4');
const encoded = encodeBase64('Hello');
const formatted = formatJson('{"name":"John"}', { indent: 2 });
const text = generateLorem({ count: 50, unit: 'words' });
```

## 🌐 Mobile & Web App

Cross-platform application with full UI for all tools:
- Copy/paste functionality
- File import/export
- History tracking
- Dark mode support

Coming soon to iOS, Android, and Web.

## 📄 License

MIT © Lewis Goodwin
