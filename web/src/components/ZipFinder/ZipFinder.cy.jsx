import React from 'react'
import ZipFinder from './ZipFinder'

describe('<ZipFinder />', () => {
  it('Should search for a zip code on coverage area', () => {

    const address = {
      street: 'Rua Joaquim Floriano',
      district: 'Itaim Bibi',
      city: 'São Paulo/SP',
      zip: '04534-011'
    }
    cy.mount(<ZipFinder />)
    cy.get('[data-cy=inputCep]').type(address.zip)
    cy.get('[data-cy=submitCep]').click()
    cy.get('[data-cy=street]').should('have.text', address.street)
    cy.get('[data-cy=district]').should('have.text', address.district)
    cy.get('[data-cy=city]').should('have.text', address.city)
    cy.get('[data-cy=zip]').should('have.text', address.zip)
  })
  it.only('Zip code should be a mandatory field', () => {
    cy.mount(<ZipFinder />)
    cy.get('[data-cy=submitCep]').click()
    cy.on('window:alert', (text) => {
      expect(text).to.equal('Preencha algum CEP')
    })
  })
})