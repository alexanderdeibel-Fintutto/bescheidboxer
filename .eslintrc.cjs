module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
  },
  overrides: [
    {
      // shadcn/ui-Komponenten exportieren Komponenten + Varianten im
      // selben File. Context-Provider exportieren Provider + Hook.
      // Beide Patterns sind by-design, kein Problem fuer Production-Builds.
      files: [
        'src/components/ui/badge.tsx',
        'src/components/ui/button.tsx',
        'src/contexts/AuthContext.tsx',
        'src/contexts/CreditsContext.tsx',
        'src/contexts/ThemeContext.tsx',
      ],
      rules: {
        'react-refresh/only-export-components': 'off',
      },
    },
  ],
}
