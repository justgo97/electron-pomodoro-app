module.exports = {
  env: { browser: true, es2020: true, node: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:import/electron",
    "plugin:import/typescript",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  rules: {
    "import/no-unresolved": [
      "error",
      {
        ignore: ["^/"],
      },
    ],
  },
  settings: {
    "import/resolver": {
      alias: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        map: [["@", "./src/react"]],
      },
    },
  },
};
