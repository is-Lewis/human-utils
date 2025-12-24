/**
 * URL Encoder/Decoder Metadata
 *
 * Information about the URL encoding/decoding tool including description,
 * use cases, and examples.
 *
 * @module tools/url-encoder/metadata
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

export const URL_ENCODER_INFO = {
  title: 'URL Encoder/Decoder',
  description:
    'Encode or decode URLs and URL components for safe transmission over the internet. URL encoding converts special characters into percent-encoded format (%XX) that can be safely transmitted in URLs.',
  useCases: [
    {
      title: 'Query Parameters',
      description:
        'Encode values before adding them to URL query strings. Example: "hello world" becomes "hello%20world"',
    },
    {
      title: 'Path Components',
      description:
        'Safely encode file names, folder names, or other path segments that contain special characters.',
    },
    {
      title: 'Form Data',
      description:
        'Encode form data for application/x-www-form-urlencoded content type in HTTP requests.',
    },
    {
      title: 'API Integration',
      description:
        'Prepare user input or dynamic data for use in API endpoints and URL-based routing.',
    },
  ],
  technicalDetails: {
    title: 'Technical Details',
    points: [
      'Uses encodeURIComponent for component mode (default) - encodes all special characters except: A-Z a-z 0-9 - _ . ! ~ * \' ( )',
      'Uses encodeURI for full URL mode - preserves URL structure characters like :, /, ?, &, =',
      'Decoding automatically detects and handles malformed percent sequences',
      'Spaces are encoded as %20 (not + which is for form encoding)',
      'Component mode is recommended for query parameters and path segments',
    ],
  },
  examples: [
    {
      operation: 'encode' as const,
      input: 'Hello World!',
      output: 'Hello%20World%21',
    },
    {
      operation: 'encode' as const,
      input: 'user@example.com',
      output: 'user%40example.com',
    },
    {
      operation: 'decode' as const,
      input: 'Hello%20World%21',
      output: 'Hello World!',
    },
    {
      operation: 'encode' as const,
      input: 'key=value&foo=bar',
      output: 'key%3Dvalue%26foo%3Dbar',
    },
  ],
};
