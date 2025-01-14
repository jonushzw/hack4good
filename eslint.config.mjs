import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: true, // Ensure recommendedConfig is passed
});

const eslintConfig = [
  ...compat.extends("eslint:recommended", "plugin:react/recommended", "plugin:@typescript-eslint/recommended"),
  {
    files: ["**/*.ts", "**/*.tsx"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: ["react", "@typescript-eslint"],
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },
];

export default eslintConfig;