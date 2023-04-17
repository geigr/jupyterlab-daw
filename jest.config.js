var tsConfig = require('./tsconfig.json');

var tsOptions = tsConfig['compilerOptions'];
// Need as the __mocks__ folder is not visible from the src folder
tsOptions['rootDir'] = null;
tsOptions['inlineSourceMap'] = true;

const jestJupyterLab = require('@jupyterlab/testutils/lib/jest-config');

const esModules = [
  '@jupyterlab/',
  '@jupyter/ydoc',
  'lib0',
  'y\\-protocols',
  'y\\-websocket',
  'yjs'
].join('|');

const jlabConfig = jestJupyterLab(__dirname);

const {
  moduleFileExtensions,
  moduleNameMapper,
  preset,
  setupFilesAfterEnv,
  setupFiles,
  testPathIgnorePatterns,
  transform
} = jlabConfig;

module.exports = {
  moduleFileExtensions,
  moduleNameMapper,
  preset,
  setupFilesAfterEnv,
  setupFiles: [...setupFiles, '<rootDir>/testutils/jest-setup-files.js'],
  testPathIgnorePatterns,
  modulePathIgnorePatterns: ['<rootDir>/build', '<rootDir>/jupyterlab_daw'],
  transform,
  unmockedModulePathPatterns: ['<rootDir/node_modules/tone'],
  automock: false,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/.ipynb_checkpoints/*'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text'],
  globals: {
    'ts-jest': {
      tsconfig: tsOptions
    }
  },
  testRegex: 'src/.*/.*.spec.ts[x]?$',
  transformIgnorePatterns: [`/node_modules/(?!${esModules}).+`]
};
