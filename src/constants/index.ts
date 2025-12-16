export const APP_NAME = 'HumanUtils';
import { 
  Type, 
  ArrowRightLeft, 
  Calendar, 
  Lock, 
  Code, 
  Globe, 
  Calculator, 
  Palette 
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
