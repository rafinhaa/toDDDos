// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["prettier"],
  plugins: ["prettier", "unused-imports"],
  rules: {
    "prettier/prettier": "error",
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "error",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
  },
}
