import coreWebVitals from "eslint-config-next/core-web-vitals"
import typescript from "eslint-config-next/typescript"

export default [
  {
    ignores: [
      "services/ingestion/dist/**",
      "services/ingestion/build/**",
      ".next/**",
      "out/**",
      "dist/**",
    ],
  },
  ...coreWebVitals,
  ...typescript,
]
