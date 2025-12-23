/**
 * Case Converter Metadata
 *
 * Educational metadata and guidance for the case conversion tool.
 *
 * @module tools/case-converter/metadata
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

export const CASE_CONVERTER_INFO = {
  title: 'About Case Conversion',
  description:
    'Case conversion transforms text between different naming conventions commonly used in programming, documentation, and data formatting.',
  useCases: [
    {
      title: 'Variable Naming',
      description: 'Convert between camelCase (JavaScript) and snake_case (Python, Ruby)',
    },
    {
      title: 'API Development',
      description: 'Transform data keys between frontend camelCase and backend snake_case',
    },
    {
      title: 'CSS Classes',
      description: 'Convert names to kebab-case for CSS class names and HTML attributes',
    },
    {
      title: 'Constants',
      description: 'Generate CONSTANT_CASE for environment variables and configuration',
    },
    {
      title: 'Database Columns',
      description: 'Convert field names to snake_case for database schema',
    },
  ],
  technicalDetails: {
    title: 'Case Types',
    points: [
      'camelCase: First word lowercase, subsequent words capitalized (myVariableName)',
      'PascalCase: All words capitalized, no separators (MyClassName)',
      'snake_case: All lowercase with underscores (my_variable_name)',
      'kebab-case: All lowercase with hyphens (my-css-class)',
      'CONSTANT_CASE: All uppercase with underscores (MY_CONSTANT)',
      'Title Case: First letter of each word capitalized (My Title)',
      'Sentence case: First letter capitalized, rest lowercase (My sentence)',
    ],
  },
};
