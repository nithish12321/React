import { FileText, Table2, Layers, Compass, BarChart3, Zap, Wrench } from 'lucide-react';

export const SHOWCASE_SECTIONS = [
  { id: 'section-a', letter: 'A', name: 'Forms', icon: FileText, live: true },
  { id: 'section-b', letter: 'B', name: 'Data Table', icon: Table2, live: true },
  { id: 'section-c', letter: 'C', name: 'Overlays & Feedback', icon: Layers, live: true },
  { id: 'section-d', letter: 'D', name: 'Navigation', icon: Compass, live: true },
  { id: 'section-e', letter: 'E', name: 'Data Display & Charts', icon: BarChart3, live: false },
  { id: 'section-f', letter: 'F', name: 'Redux & API', icon: Zap, live: true },
  { id: 'section-g', letter: 'G', name: 'Utilities', icon: Wrench, live: false },
] as const;
