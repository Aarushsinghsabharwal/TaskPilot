import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['taskpilot-core.js', 'taskpilot.test.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'commonjs',
      globals: {
        module: 'readonly',
        require: 'readonly',
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
      },
    },
  },
];
