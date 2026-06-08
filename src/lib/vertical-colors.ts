export const VERTICAL_COLORS: Record<string, Record<string, string>> = {
  'real-estate': {
    '--v-fa':     '#1A1A2E',
    '--v-fb':     '#0A0F1A',
    '--v-accent': '#0D5C45',
    '--v-signal': '#C89B3C',
    '--v-muted':  '#D1D5DB',
  },
  'healthcare': {
    '--v-fa':     '#0A1120',
    '--v-fb':     '#111827',
    '--v-accent': '#185FA5',
    '--v-signal': '#7AB3D6',
    '--v-muted':  '#CBD5E1',
  },
  'agribusiness': {
    '--v-fa':     '#1C1208',
    '--v-fb':     '#251A09',
    '--v-accent': '#BA7517',
    '--v-signal': '#EF9F27',
    '--v-muted':  '#D6C4A8',
  },
}

export const DEFAULT_COLORS: Record<string, string> = {
  '--v-fa':     '#0A0F1A',
  '--v-fb':     '#111827',
  '--v-accent': '#0F6E56',
  '--v-signal': '#1D9E75',
  '--v-muted':  '#9CA3AF',
}

export const VALID_VERTICALS = ['real-estate', 'healthcare', 'agribusiness']

export function getVerticalColors(pathname: string): Record<string, string> {
  const segment = pathname.split('/')[1]
  return VERTICAL_COLORS[segment] ?? DEFAULT_COLORS
}
