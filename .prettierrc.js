module.exports = {
  proseWrap: 'always',
  singleQuote: true,
  trailingComma: 'all',
  semi: false,
  overrides: [
    {
      files: 'packages/@JSIMg/angular/**',
      options: {
        semi: true,
      },
    },
  ],
}
