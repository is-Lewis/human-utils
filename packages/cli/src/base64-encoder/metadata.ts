/**
 * Base64 Encoder/Decoder Metadata
 *
 * Educational metadata and guidance for the Base64 encoding/decoding tool.
 *
 * @module tools/base64-encoder/metadata
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

export const BASE64_INFO = {
  title: 'About Base64',
  description:
    "Base64 is a binary-to-text encoding scheme that represents binary data in ASCII string format. It's commonly used for encoding data in emails, URLs, and data URIs.",
  useCases: [
    {
      title: 'Data URIs',
      description: 'Embed images or files directly in HTML/CSS using data:image/png;base64,...',
    },
    {
      title: 'API Authentication',
      description: 'Basic authentication headers often use Base64 encoding',
    },
    {
      title: 'Email Attachments',
      description: 'MIME email attachments are encoded in Base64',
    },
    {
      title: 'Safe Data Transfer',
      description: 'Encode binary data for safe transmission over text-based protocols',
    },
  ],
  technicalDetails: {
    title: 'How It Works',
    points: [
      'Converts every 3 bytes (24 bits) into 4 Base64 characters',
      'Uses 64 characters: A-Z, a-z, 0-9, +, /',
      'Padding character "=" is added when needed',
      'Output is approximately 33% larger than input',
    ],
  },
};
