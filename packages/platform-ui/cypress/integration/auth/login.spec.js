/// <reference types="cypress" />
import stubServices from '../../support/stub.services';
import { authLocators as auth } from './locators';
import { DOWNLOAD_PMM_LINK } from './constants';

context('Login', () => {

  beforeEach(() => {
    stubServices();
    cy.visit('/');
  });

  it('should be able to see the login form', () => {
    cy.get(auth.loginForm).should('be.visible');
    cy.get(auth.emailFieldLabel).should('contain', 'Email *');
    cy.get(auth.emailField).should('be.visible');
    cy.get(auth.passwordFieldLabel).should('contain', 'Password *');
    cy.get(auth.passwordField).should('be.visible');
    cy.get(auth.submitButton).should('be.visible').should('be.disabled');
    cy.get(auth.signUpLink).should('have.attr', 'href', '/signup');
  });

  it('should have validation for login input fields', () => {
    cy.get(auth.emailFieldLabel).click();
    cy.get(auth.passwordField).click();
    cy.get(auth.emailValidation).should('have.text', 'Required field');
    cy.get(auth.emailField).type('some email');
    cy.get(auth.passwordValidation).should('have.text', 'Required field');
    cy.get(auth.emailValidation).should('have.text', 'Invalid email address');
    cy.get(auth.passwordField).type('test');
    cy.get(auth.passwordValidation).should('have.text', 'Must contain at least 10 characters');
    cy.get(auth.passwordField).type('testqwerty');
    cy.get(auth.passwordValidation).should('have.text', 'Must include at least one number');
    cy.get(auth.passwordField).type('1');
    cy.get(auth.passwordValidation).should('have.text', 'Must include at least one uppercase letter');
    cy.get(auth.passwordField).type('P');
    cy.get(auth.passwordValidation).should('have.text', '');
    cy.get(auth.submitButton).should('be.visible').should('be.disabled');
  });

  it('should be able to open the signup page from the login', () => {
    cy.get(auth.signUpLink).click();
    cy.url().should('contain', '/signup');
  });

  it('should be able to login', () => {
    const email = 'valid@email.com';
    const password = 'Password123';
    cy.get(auth.submitButton).should('be.visible').should('be.disabled');
    cy.get(auth.emailField).clear().type(email);
    cy.get(auth.emailValidation).should('have.text', '');
    cy.get(auth.passwordField).type(password);
    cy.get(auth.passwordValidation).should('have.text', '');
    cy.get(auth.submitButton).should('be.visible').should('be.enabled').click();
    cy.popUpContains(`You are signed in as ${email}`);
    cy.contains(email);
    cy.get(auth.logoutButton).should('be.visible');
    cy.get('span').contains('Download PMM')
        .parent().parent().should('have.attr', 'href', DOWNLOAD_PMM_LINK);
  });
});
