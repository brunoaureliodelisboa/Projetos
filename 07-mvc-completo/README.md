# Arquitetura MVC Completa

Implementação completa da arquitetura Model-View-Controller integrando todos os conceitos aprendidos.

## 🎯 Objetivos

- Aplicar arquitetura MVC de forma completa
- Integrar todos os conceitos anteriores
- Criar aplicação robusta e escalável
- Implementar boas práticas da indústria
- Demonstrar evolução técnica completa

## 🏗️ Arquitetura MVC

### Model (Modelo)
- **Entidades JPA**: Representação dos dados
- **Repositórios**: Acesso a dados
- **Validações**: Regras de negócio nos modelos

### View (Visão)
- **DTOs**: Objetos de transferência
- **JSON/XML**: Serialização de dados
- **Documentação**: Swagger/OpenAPI

### Controller (Controlador)
- **REST Controllers**: Endpoints HTTP
- **Validação de entrada**: Bean Validation
- **Exception Handlers**: Tratamento de erros

## 📊 Camadas da Aplicação

```
Aplicação MVC Completa
├── Camada de Apresentação (Controller)
│   ├── Controllers REST
│   ├── DTOs
│   └── Exception Handlers
│
├── Camada de Negócio (Service)
│   ├── Lógica de negócio
│   ├── Validações
│   └── Transações
│
├── Camada de Persistência (Repository)
│   ├── Repositórios JPA
│   ├── Entidades
│   └── Queries customizadas
│
└── Camada de Infraestrutura
    ├── Configurações
    ├── Security
    └── Utilitários
```

## 💡 Separação de Responsabilidades

### Controller
- Receber requisições HTTP
- Validar entrada
- Delegar para Service
- Retornar resposta apropriada

### Service
- Implementar lógica de negócio
- Coordenar operações
- Gerenciar transações
- Transformar dados (Entity ↔ DTO)

### Repository
- Acesso a dados
- Queries customizadas
- Abstração do banco de dados

## 🚀 Projeto Integrado

O projeto integrado demonstra:

### Java OO
- Design Patterns aplicados
- Princípios SOLID
- Herança e Polimorfismo
- Encapsulamento

### Controle de Fluxo
- Validações complexas
- Processamento condicional
- Iterações eficientes

### Exceções
- Hierarquia de exceções customizadas
- Tratamento global
- Logging e rastreamento
- Mensagens descritivas

### Spring Boot
- API RESTful completa
- Injeção de Dependências
- Auto-configuration
- Spring Security

### SQL/JPA
- Modelagem de dados
- Relacionamentos complexos
- Queries otimizadas
- Transações

### JUnit
- Testes unitários
- Testes de integração
- Alta cobertura
- Mocks apropriados

## 📚 Estrutura do Projeto Integrado

```
projeto-integrado/
├── src/main/java/
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── SwaggerConfig.java
│   │   └── DatabaseConfig.java
│   │
│   ├── controller/
│   │   ├── UsuarioController.java
│   │   ├── ProdutoController.java
│   │   └── PedidoController.java
│   │
│   ├── service/
│   │   ├── UsuarioService.java
│   │   ├── ProdutoService.java
│   │   └── PedidoService.java
│   │
│   ├── repository/
│   │   ├── UsuarioRepository.java
│   │   ├── ProdutoRepository.java
│   │   └── PedidoRepository.java
│   │
│   ├── model/
│   │   ├── Usuario.java
│   │   ├── Produto.java
│   │   ├── Pedido.java
│   │   └── Item.java
│   │
│   ├── dto/
│   │   ├── UsuarioDTO.java
│   │   ├── ProdutoDTO.java
│   │   └── PedidoDTO.java
│   │
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java
│   │   ├── RecursoNaoEncontradoException.java
│   │   └── ValidacaoException.java
│   │
│   └── util/
│       ├── Constantes.java
│       └── Validadores.java
│
├── src/main/resources/
│   ├── application.properties
│   ├── application-dev.properties
│   └── application-prod.properties
│
└── src/test/java/
    ├── controller/
    ├── service/
    └── repository/
```

## 🎯 Funcionalidades Implementadas

1. **CRUD Completo**
   - Criar, Ler, Atualizar, Deletar
   - Validações
   - Paginação e Ordenação

2. **Relacionamentos**
   - OneToOne, OneToMany, ManyToOne, ManyToMany
   - Cascade operations
   - Lazy/Eager loading

3. **Segurança**
   - Autenticação JWT
   - Autorização baseada em roles
   - Proteção de endpoints

4. **Tratamento de Erros**
   - Global exception handler
   - Mensagens customizadas
   - Status HTTP apropriados

5. **Validação**
   - Bean Validation
   - Validações de negócio
   - Mensagens descritivas

6. **Documentação**
   - Swagger/OpenAPI
   - README detalhado
   - Exemplos de uso

7. **Testes**
   - Cobertura > 80%
   - Testes unitários
   - Testes de integração

8. **Logging e Monitoramento**
   - Logs estruturados
   - Métricas de performance
   - Health checks

## 📈 Demonstração de Evolução

Este projeto integrado demonstra:

✅ Domínio de Java OO e Design Patterns
✅ Uso avançado de estruturas de controle
✅ Tratamento robusto de exceções
✅ Desenvolvimento de APIs RESTful com Spring Boot
✅ Persistência de dados com JPA/Hibernate
✅ Testes abrangentes com JUnit
✅ Arquitetura MVC bem estruturada
✅ Código limpo e manutenível
✅ Boas práticas da indústria

## 🚀 Como Executar

```bash
# Clonar repositório
git clone <url>

# Navegar até o projeto
cd 07-mvc-completo/projeto-integrado

# Executar com Maven
mvn spring-boot:run

# Ou com Gradle
gradle bootRun

# Acessar Swagger
http://localhost:8080/swagger-ui.html
```

## 📚 Recursos Adicionais

- Documentação completa no README do projeto
- Exemplos de requisições (Postman/Insomnia)
- Diagramas de arquitetura
- Guia de contribuição
