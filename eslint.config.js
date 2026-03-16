const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const angularPlugin = require("@angular-eslint/eslint-plugin");
const htmlParser = require("@html-eslint/parser");
const htmlPlugin = require("@html-eslint/eslint-plugin");

module.exports = [
  {
    ignores: [
      "node_modules",
      "dist",
      ".angular",
      "coverage",
      ".git",
      "*.spec.ts",
    ],
  },
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "tsconfig.app.json",
        createDefaultProgram: true,
        sourceType: "module",
        ecmaVersion: 2020,
      },
      globals: {
        document: "readonly",
        window: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        setInterval: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "@angular-eslint": angularPlugin,
    },
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["src/**/*.html"],
    languageOptions: {
      parser: htmlParser,
    },
    plugins: {
      "@html-eslint": htmlPlugin,
    },
    rules: {
      "@html-eslint/require-lang": "off",
      "@html-eslint/require-meta-charset": "off",
      "@html-eslint/no-inline-styles": "warn",
      "@html-eslint/indent": "off",
      "@html-eslint/no-duplicate-attrs": "error",
      "@html-eslint/require-button-type": "warn",
      "@html-eslint/require-closing-tags": [
        "error",
        {
          selfClosing: "never",
        },
      ],
    },
  },
];
