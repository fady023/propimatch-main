import type { Config } from 'tailwindcss';
import { tailwindPreset } from '@propimatch/theme/src/index';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  presets: [tailwindPreset as unknown as Config],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
} satisfies Config;

