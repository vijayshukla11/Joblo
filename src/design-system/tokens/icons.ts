import { 
  Briefcase, 
  Building, 
  Landmark, 
  BookOpen, 
  Sparkles, 
  HelpCircle, 
  IndianRupee, 
  ShieldCheck, 
  Settings, 
  Cpu, 
  ArrowRight,
  MapPin,
  Calendar,
  FileText,
  UserCheck
} from 'lucide-react';

/**
 * Semantic Icon registry to enforce typography and design consistency across pages.
 * By mapping icons semantically, we can switch design libraries without rewriting page modules.
 */
export const icons = {
  job: Briefcase,
  company: Building,
  government: Landmark,
  learning: BookOpen,
  ai: Sparkles,
  interview: HelpCircle,
  salary: IndianRupee,
  security: ShieldCheck,
  admin: Settings,
  system: Cpu,
  arrowRight: ArrowRight,
  location: MapPin,
  calendar: Calendar,
  file: FileText,
  verified: UserCheck
};
