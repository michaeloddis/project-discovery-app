const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { m } = require('framer-motion');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    prefix: 'pd',
    extend: {
        colors: {
            critical: '#EF4444',
            high: '#D97706',
            medium: '#CA8A04',
            low: '#3F3F46',
            info: '#3F3F46',
            blue: {
                600: '#2563EB',
                900: '#1E3A8A',
            },
            gray: {
                700: '#3F3F46',
                800: '#27272A'
            },

            risk: {
                critical: 'rgba(220, 38, 38, 0.3)',
                high: 'rgba(217, 119, 6, 0.3)',
                medium: 'rgba(202, 138, 4, 0.3)',
                low: '#27272A',
                info: '#18181B'
            },
            status: {
                'jira-create': '#1E3A8A',
                'jira-open': '#27272A'
            }
        },
        fontFamily: {
            'brand': 'Inter, sans-serif'
        }
    },
  },
  plugins: [],
};
