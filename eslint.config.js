import eslintPluginTs from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

export default eslintPluginTs.config(
  { ignores: ["node_modules/**", ".next/**", "dist/**"] },
  ...eslintPluginTs.configs.recommended,
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  }
);

