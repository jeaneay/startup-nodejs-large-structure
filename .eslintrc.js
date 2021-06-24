module.exports = {
    root: true,
    "env": {
        "browser": true,
        "commonjs": true,
        "node": true,
        "es2021": true,
        "mocha": true,
        "shelljs": true,
    },
    parserOptions: {
        "ecmaVersion": 2021,
        "sourceType": "module",
        "ecmaFeatures": {
            "impliedStrict": true
        }
    },
    parser: '@typescript-eslint/parser',  // Allows ESLint to lint TypeScript.
    plugins: [
      '@typescript-eslint',
      "import",
      "mocha",
      "promise",
      "chai-friendly",
      "lodash",
      "security",
      "json",
      "array-func"
    ],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',  // A plugin that contains a bunch of ESLint rules that are TypeScript specific.
      'prettier',
      'prettier/@typescript-eslint',   // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
      "plugin:prettier/recommended",
      "plugin:import/errors",
      "plugin:import/warnings",
      "plugin:import/typescript",
      "plugin:mocha/recommended",
      "plugin:node/recommended",
      "plugin:promise/recommended",
      "plugin:chai-friendly/recommended",
      "plugin:lodash/recommended",
      "plugin:eslint-comments/recommended",
      "plugin:security/recommended",
      "plugin:json/recommended",
      "plugin:array-func/recommended"
    ],
    "rules": {
        "import/named": 2,
        "import/default": 2,
        "import/export": 2,
        "import/namespace": 2,
        "node/no-extraneous-require": "error",
        "node/no-missing-import": "error",
        "node/no-missing-require": "error",
        "node/exports-style": ["error", "module.exports"],
        "node/prefer-global/buffer": ["error", "always"],
        "node/prefer-global/console": ["error", "always"],
        "node/prefer-global/process": ["error", "always"],
        "node/prefer-global/url-search-params": ["error", "always"],
        "node/prefer-global/url": ["error", "always"],
        "node/prefer-promises/dns": "error",
        "node/prefer-promises/fs": "error",
        "node/no-unsupported-features/es-syntax":  ["error", { "ignores": ["modules"] }],
    }
};
