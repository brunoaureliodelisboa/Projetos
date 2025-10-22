# Spring Boot

Desenvolvimento de aplicações Java com Spring Boot - o framework mais popular para aplicações empresariais.

## 🎯 Objetivos

- Criar APIs RESTful robustas
- Implementar injeção de dependências
- Configurar aplicações de forma eficiente
- Integrar com bancos de dados
- Implementar segurança e autenticação
- Desenvolver microsserviços

## 🚀 Principais Recursos

### Core Spring
- **Injeção de Dependências (DI)**: Gerenciamento automático de dependências
- **Inversão de Controle (IoC)**: Container Spring gerencia ciclo de vida
- **Spring Boot Auto-Configuration**: Configuração automática baseada em dependências
- **Spring Boot Starter**: Conjuntos prontos de dependências

### Spring Web (REST APIs)
- **@RestController**: Controllers para APIs REST
- **@RequestMapping**: Mapeamento de rotas
- **Request/Response handling**: DTOs, validação, serialização
- **Exception handling**: Tratamento global de erros

### Spring Data JPA
- **Repositories**: Abstração de acesso a dados
- **Query Methods**: Queries por nome de método
- **Custom Queries**: JPQL e SQL nativo
- **Paginação e Ordenação**: Suporte built-in

### Spring Security
- **Autenticação**: Login, JWT, OAuth2
- **Autorização**: Controle de acesso baseado em roles
- **CSRF Protection**: Proteção contra ataques
- **Password Encoding**: Criptografia de senhas

## 📚 Estrutura Típica

```
src/main/java/
├── config/          # Configurações
├── controller/      # Controllers REST
├── service/         # Lógica de negócio
├── repository/      # Acesso a dados
├── model/           # Entidades JPA
├── dto/             # Data Transfer Objects
├── exception/       # Exceções customizadas
└── security/        # Configurações de segurança

src/main/resources/
├── application.properties  # Configurações da aplicação
└── static/                 # Recursos estáticos
```

## 💡 Conceitos Principais

### Annotations Essenciais
- `@SpringBootApplication`: Marca classe principal
- `@RestController`: Define controller REST
- `@Service`: Marca classe de serviço
- `@Repository`: Marca classe de repositório
- `@Configuration`: Classe de configuração
- `@Component`: Componente genérico Spring
- `@Autowired`: Injeção de dependência
- `@Value`: Injeção de propriedades

### REST API
- `@GetMapping`: Requisições GET
- `@PostMapping`: Requisições POST
- `@PutMapping`: Requisições PUT
- `@DeleteMapping`: Requisições DELETE
- `@PathVariable`: Variáveis de path
- `@RequestParam`: Parâmetros de query
- `@RequestBody`: Corpo da requisição

## 🎓 Níveis de Complexidade

- **api-rest/**: APIs RESTful básicas e avançadas
- **security/**: Autenticação e autorização
