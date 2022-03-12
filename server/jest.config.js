module.exports = {
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  testPathIgnorePatterns: ['dist', 'node_modules'],
  testRegex: '/__tests__/.*\\.test.[jt]sx?$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  modulePathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/dist'],
}
