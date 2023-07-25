moduleDirectories: ['node_modules', 'src']

const config = {
  verbose: true,
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    // https://jestjs.io/docs/webpack#mocking-css-modules
    // "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    // Handle image imports
    // https://jestjs.io/docs/webpack#handling-static-assets
    '^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$': `<rootDir>/fileTransform.js`,

    // Aliases
    '^@/(.*)$': '<rootDir>/$1',
    '^@/events/(.*)$': '<rootDir>/utils/events/$1',
  },
  // testPathIgnorePatterns: [
  //   '<rootDir>/node_modules/',
  //   '<rootDir>/.next/',
  //   '<rootDir>/cypress/',
  //   '<rootDir>/archives/',
  //   '<rootDir>/pages/',
  // ],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  // testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$",
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  // transform: {
  //   '^.+\\.(t|j)sx?$': 'ts-jest',
  // },
  // globalSetup: '<rootDir>/__tests__/readEnvVar.js',
  // setupFiles: ['<rootDir>/__tests__/localStorage.js'],
}

export default config
