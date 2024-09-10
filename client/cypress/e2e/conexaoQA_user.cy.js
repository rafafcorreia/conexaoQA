import { register, login } from '../../src/actions/auth'
import { createProfile } from '../../src/actions/profile'

describe("Cadastro Usuário", () => {

    let name = 'Fulano'
    let email = 'fulano@teste.com'
    let password = '123456'

    beforeEach(() => {
        cy.visit('/')

        // chamando App Action de registro
        cy.window()
            .its('store')
            .invoke('dispatch', register({ name: name, email: email, password: password }))
    
        // chamando App Action de criar Perfil
        cy.window()
            .its('store')
            .invoke('dispatch', createProfile({ status: 'Especialista em QA', skills: 'Cypress, Automação' }))
    });

    afterEach(() => {
        // garantir que esteja no Dashboard
        cy.get('[data-test="navbar-dashboard"]')
            .click()

        // excluir perfil
        cy.get('[data-test="dashboard-deleteProfile"]')
            .click()
    });

    it("valida cadastro com êxito", () => {

        cy.get('[data-test="dashboard-welcome"]')
            .should('contain.text', name)
    });

    it("valida login com êxito", () => {

        // fazer logout
        cy.get('[data-test="navbar-logout"]').click()

        // chamando App Action de Login
        cy.window()
            .its('store')
            .invoke('dispatch', login(email, password ))

        cy.url().should('eq', 'http://localhost:3000/dashboard')

        cy.get('[data-test="dashboard-welcome"]')
            .should('contain.text', name)
    });
});
