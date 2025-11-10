import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "7oc7d1", // your Cypress Cloud project ID

  e2e: {
    // end-to-end test options
    setupNodeEvents(on, config) {
      // implement node event listeners here if needed
    },
    baseUrl: "http://localhost:3000", // adjust to your dev server
    specPattern: "cypress/e2e/**/*.cy.{js,ts,jsx,tsx}",
  },

  // component: {
  //   // component testing options
  //   devServer: {
  //     framework: "react",
  //     bundler: "webpack",
  //   },
  //   specPattern: "cypress/component/**/*.cy.{js,ts,jsx,tsx}",
  // },
});
