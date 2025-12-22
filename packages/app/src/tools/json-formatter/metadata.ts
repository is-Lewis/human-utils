/**
 * JSON Formatter Metadata
 * 
 * @module tools/json-formatter/metadata
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

export const JSON_INFO = {
  title: 'JSON Formatter & Validator',
  description: 'JSON (JavaScript Object Notation) is a lightweight data interchange format that is easy for humans to read and write, and easy for machines to parse and generate. It is widely used for APIs, configuration files, and data storage.',
  
  useCases: [
    {
      title: 'API Development',
      description: 'Format and validate API responses and request payloads during development and debugging.'
    },
    {
      title: 'Configuration Files',
      description: 'Pretty-print configuration files for better readability and easier maintenance.'
    },
    {
      title: 'Data Validation',
      description: 'Validate JSON data before processing to catch syntax errors early.'
    },
    {
      title: 'Minification',
      description: 'Reduce file size by removing unnecessary whitespace for production deployments.'
    },
    {
      title: 'Data Transformation',
      description: 'Sort object keys alphabetically for consistent data structure and easier comparison.'
    }
  ],
  
  technicalDetails: {
    title: 'Technical Details',
    points: [
      'JSON supports primitive types: string, number, boolean, null',
      'Complex types include objects {} and arrays []',
      'Keys must be strings enclosed in double quotes',
      'Values can be nested to any depth',
      'Trailing commas are not allowed',
      'Comments are not supported in standard JSON',
      'Unicode characters are supported (\\uXXXX format)'
    ]
  }
};
