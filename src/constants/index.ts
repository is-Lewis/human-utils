export const APP_NAME = 'HumanUtils';
import { 
  Type, 
  ArrowRightLeft, 
  Calendar, 
  Lock, 
  Code, 
  Globe, 
  Calculator, 
  Palette,
  Hash,
  Binary,
  Braces
} from 'lucide-react-native';


export const TOOL_CATEGORIES = [
    { id: 'text', title: 'Text Tools', icon: Type },
    { id: 'converters', title: 'Formatters & Converters', icon: ArrowRightLeft },
    { id: 'date', title: 'Date & Time', icon: Calendar },
    { id: 'crypto', title: 'Security & Crypto', icon: Lock },
    { id: 'dev', title: 'Dev & Code', icon: Code },
    { id: 'network', title: 'Network & Web', icon: Globe },
    { id: 'math', title: 'Math & Numbers', icon: Calculator },
    { id: 'colors', title: 'Colors & Images', icon: Palette },
];

export const TOOLS = [
    {
        id: 'uuid-generator',
        title: 'UUID Generator & Validator',
        description: 'Generate universally unique identifiers (v1, v4, v5, v7)',
        categories: ['dev'],
        icon: Hash,
        route: 'UuidGenerator' as const
    },
    {
        id: 'base64-encoder',
        title: 'Base64 Encoder/Decoder',
        description: 'Encode and decode text using Base64 encoding',
        categories: ['dev', 'converters'],
        icon: Binary,
        route: 'Base64Encoder' as const
    },
    {
        id: 'json-formatter',
        title: 'JSON Formatter & Validator',
        description: 'Format, minify, and validate JSON with error detection',
        categories: ['dev', 'converters'],
        icon: Braces,
        route: 'JsonFormatter' as const
    }
];
