# Testes com JUnit

Implementação de testes unitários e de integração para garantir qualidade do código.

## 🎯 Objetivos

- Escrever testes unitários eficazes
- Implementar testes de integração
- Alcançar boa cobertura de código
- Usar mocks e stubs apropriadamente
- Aplicar TDD (Test-Driven Development)
- Criar testes confiáveis e manuteníveis

## 📚 Tecnologias

### JUnit 5
Framework de testes mais popular para Java.

### Mockito
Framework para criar mocks e stubs.

### AssertJ
Biblioteca de assertions fluente.

### Spring Boot Test
Suporte para testes de integração Spring.

## 🏗️ Tipos de Testes

### Testes Unitários
- Testam unidades isoladas (métodos, classes)
- Rápidos e independentes
- Usam mocks para dependências

### Testes de Integração
- Testam integração entre componentes
- Testam com banco de dados real ou H2
- Testam APIs end-to-end

### Testes de Performance
- Verificam tempo de resposta
- Testam carga e stress

## 📊 Estrutura

```
06-testes/
├── junit/           # Testes unitários com JUnit e Mockito
└── integracao/      # Testes de integração com Spring Boot Test
```

## 💡 Conceitos Principais

### AAA Pattern
- **Arrange**: Preparar dados e mocks
- **Act**: Executar método sob teste
- **Assert**: Verificar resultado

### Mocks vs Stubs
- **Mock**: Objeto simulado para verificar comportamento
- **Stub**: Objeto com respostas pré-definidas

### Coverage
- **Line Coverage**: Linhas executadas
- **Branch Coverage**: Branches executadas
- **Method Coverage**: Métodos executados

## 🎓 Níveis

- **junit/**: Testes unitários básicos e avançados
- **integracao/**: Testes de integração com Spring Boot
