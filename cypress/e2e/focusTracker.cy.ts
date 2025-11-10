describe("FocusTracker App", () => {
  // Runs before all tests
  before(() => {
    // Visit your local dev server
    cy.visit("http://localhost:3000");
  });

  it("should display the landing page initially", () => {
    cy.contains("Start Focus Tracker").should("exist");
  });

  it("should start the app when clicking start", () => {
    cy.contains("Start Focus Tracker").click();
    cy.get(".main-content").should("exist"); // check if main content appears
  });

  it("should add a pending task", () => {
    cy.get("input[name='taskName']").type("Test Task");
    cy.get("select[name='priority']").select("High");
    cy.get("button").contains("Add Task").click();

    cy.contains("Test Task").should("exist");
    cy.contains("High").should("exist");
  });

  it("should start a task", () => {
    cy.contains("▶ Start").click();
    cy.get(".active-task").should("exist");
  });

  it("should remove a pending task", () => {
    cy.contains("✖").click();
    cy.contains("Are you sure you want to remove").should("exist");
    cy.contains("Yes").click();
    cy.contains("Test Task").should("not.exist");
  });
});
