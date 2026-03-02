export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: [
    "@testing-library/jest-dom",
    "<rootDir>/src/setupTests.ts",
  ],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          isolatedModules: true,
        },
      },
    ],
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/main.tsx",
    "!src/index.tsx",
    "!src/**/*.d.ts",
    "!src/**/types.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
