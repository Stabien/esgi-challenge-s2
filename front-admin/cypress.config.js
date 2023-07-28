const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    experimentalRunAllSpecs: true,
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:4173'
  }
});
