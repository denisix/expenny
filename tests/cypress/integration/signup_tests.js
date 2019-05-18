describe('Test signup', function () {

  beforeEach(function () {
       cy.visit('http://localhost:3000')
  })

  it('.should() - assert that signup panel has every input field needed', function () {

    cy.get('form').within(function () {

      // Some assertions using a custom helper

      isEnabledAndVisible('input#login')
      isEnabledAndVisible('input#pw')
      isEnabledAndVisible('input#reg')
      isEnabledAndVisible('[data-cy=submit]')

      // Enter some data

      cy.get('input#login').type("my@test.com")
      cy.get('input#pw').type("lj21lh32")
      //cy.get('input#reg').check()

      // Click the button

      cy.get('[data-cy=submit]').click()

      // Validate the new url

      //cy.url().should('eq', 'http://localhost:3000/')

    })

  })

})

// Helpers
function isEnabledAndVisible(element) {
  cy.get(element).should('exist').and('be.visible').and('be.enabled')
}
