/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {
     let id
     var faker = require('faker');
     let nomeFaker = faker.name.firstName() + faker.name.lastName()
     let emailFaker = faker.internet.email(nomeFaker)

     it('Deve validar contrato de usuários', () => {
          cy.listarUsuarios().then(response => {
               return contrato.validateAsync(response.body)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.listarUsuarios('Guilherme Baptista', 'guilhermebaptista@qa.com.br', 'teste', 'true', 'v2OUnLTJSMYK2oMA')
          .then((response) => {
               expect(response.body.usuarios[0].nome).to.contains('Guilherme Baptista')
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('quantidade')
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          cy.cadastrarUsuario(nomeFaker, emailFaker, 'teste', 'true').then((response) => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
               expect(response.duration).to.be.lessThan(20)
               id = response.body._id
          })
     });

     it('Deve validar um usuário com email inválido', () => {
          cy.cadastrarUsuario('Guilherme', 'guilhermebaptista@qa.com.br', 'teste', 'true').then((response) => {
               expect(response.status).to.equal(400)
               expect(response.body.message).to.equal('Este email já está sendo usado')
               expect(response.duration).to.be.lessThan(20)
          })

          cy.cadastrarUsuario('Joana', 'teste.com', 'teste', 'true').then((response) => {
               expect(response.status).to.equal(400)
               expect(response.body.email).to.equal('email deve ser um email válido')
               expect(response.duration).to.be.lessThan(20)
          })
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          let senha = `${Math.floor(Math.random() * 10000)}`
          cy.editarUsuario(id, nomeFaker, emailFaker, senha, 'true').then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body.message).to.equal('Registro alterado com sucesso')
               expect(response.duration).to.be.lessThan(20)
          })
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          cy.deletarUsuario(id).then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body.message).to.equal('Registro excluído com sucesso')
               expect(response.duration).to.be.lessThan(30)
          })
     });
});