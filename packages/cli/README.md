# @human-utils/cli

Standalone command-line utilities for developers. Zero React Native dependencies.

## Installation

```bash
npm install -g @human-utils/cli
```

## Usage

```bash
# UUID Generation
hu uuid generate                    # Generate UUID v4
hu uuid generate -v v5 --namespace DNS --name example.com

# Base64 Encoding
hu base64 encode "Hello World"
hu base64 decode "SGVsbG8gV29ybGQ="

# JSON Formatting
hu json format input.json -o output.json
hu json minify large.json

# Lorem Ipsum
hu lorem words 50
hu lorem sentences 5 -s            # Start with "Lorem ipsum"
hu lorem paragraphs 3 --html       # Wrap in <p> tags
```

## Package Size

- **CLI only**: ~5MB (just `commander` + tool logic)
- **Full app**: ~300MB (includes React Native, Expo, etc.)

## Use as Library

```typescript
import { generateUUID, encodeBase64, formatJson, generateLorem } from '@human-utils/cli';

const uuid = generateUUID('v4');
const encoded = encodeBase64('Hello');
const formatted = formatJson('{"name":"John"}', { indent: 2 });
const text = generateLorem({ count: 50, unit: 'words' });
```

## Development

This is part of the HumanUtils monorepo. See the main README for development setup.
