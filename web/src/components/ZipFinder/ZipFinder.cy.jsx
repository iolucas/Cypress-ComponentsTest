import React from 'react'
import ZipFinder from './ZipFinder'

describe('<ZipFinder />', () => {
  beforeEach(() => {
    cy.mount(<ZipFinder />)
    cy.viewport(1280, 621)
    // cy.viewport(1280, 768)
    cy.get('[data-cy=inputCep]').as('inputCep')
    cy.get('[data-cy=submitCep]').as('submitCep')
  })
  it('Should search for a zip code on coverage area', () => {
    const address = {
      street: 'Rua Joaquim Floriano',
      district: 'Itaim Bibi',
      city: 'São Paulo/SP',
      zipcode: '04534-011'
    }
    cy.zipFinder(address, true)
    cy.get('[data-cy=street]').should('have.text', address.street)
    cy.get('[data-cy=district]').should('have.text', address.district)
    cy.get('[data-cy=city]').should('have.text', address.city)
    cy.get('[data-cy=zip]').should('have.text', address.zipcode)
  })
  it('Zip code should be a mandatory field', () => {
    cy.get('@submitCep').click()
    cy.get('#swal2-title').should('have.text', 'Preencha algum CEP')
    cy.get('.swal2-confirm').click()
  })
  it('Zip code is invalid', () => {
    const address = { zipcode: '1234567' }
    cy.zipFinder(address)
    cy.get('[data-cy="notice"]')
      .should('be.visible')
      .should('have.text', 'CEP no formato inválido.')
  })
  it('Zip code is not in the coverage area', () => {
    const zipcode = '12345678'
    cy.get('@inputCep').type(zipcode)
    cy.get('@submitCep').click()
    cy.get('[data-cy="notice"]')
      .should('be.visible')
      .should('have.text', 'No momento não atendemos essa região.')
  })
})

Cypress.Commands.add('zipFinder', (address, mock = false) => {
  if (mock) {
    cy.intercept('GET', '/zipcode/*', {
      statusCode: 200,
      body: {
        cep: address.zipcode,
        logradouro: address.street,
        bairro: address.district,
        cidade_uf: address.city
      }
    }).as('zipRequest')
  }
  cy.get('@inputCep').type(address.zipcode)
  cy.get('@submitCep').click()
  if (mock) {
    cy.wait('@zipRequest')
  }
})