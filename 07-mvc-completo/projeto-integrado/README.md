# Projeto Integrado - Sistema de Gestão

Sistema completo de gestão demonstrando todos os conceitos de desenvolvimento Java Back-end.

## 📋 Descrição

Sistema de gestão que integra:
- Gestão de Usuários
- Catálogo de Produtos
- Processamento de Pedidos
- Autenticação e Autorização

## 🎯 Conceitos Demonstrados

### 1. Java OO e Design Patterns
- **Factory Pattern**: Criação de objetos de pagamento
- **Builder Pattern**: Construção de DTOs complexos
- **Strategy Pattern**: Diferentes estratégias de desconto
- **Observer Pattern**: Notificações de eventos
- **Repository Pattern**: Abstração de acesso a dados

### 2. Controle de Fluxo
```java
// Validação complexa de pedido
public void validarPedido(Pedido pedido) {
    if (pedido == null) {
        throw new IllegalArgumentException("Pedido não pode ser nulo");
    }
    
    if (pedido.getItens().isEmpty()) {
        throw new ValidacaoException("Pedido deve ter ao menos um item");
    }
    
    for (Item item : pedido.getItens()) {
        if (item.getQuantidade() <= 0) {
            throw new ValidacaoException("Quantidade deve ser positiva");
        }
        if (item.getPreco().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidacaoException("Preço deve ser positivo");
        }
    }
    
    BigDecimal total = pedido.calcularTotal();
    if (total.compareTo(new BigDecimal("10000")) > 0) {
        // Pedidos acima de R$ 10.000 requerem aprovação
        pedido.setStatus(StatusPedido.AGUARDANDO_APROVACAO);
    }
}
```

### 3. Tratamento de Exceções
```java
// Hierarquia de exceções customizadas
public abstract class AplicacaoException extends RuntimeException {
    private final String codigo;
    private final LocalDateTime timestamp;
    
    public AplicacaoException(String mensagem, String codigo) {
        super(mensagem);
        this.codigo = codigo;
        this.timestamp = LocalDateTime.now();
    }
}

public class RecursoNaoEncontradoException extends AplicacaoException {
    public RecursoNaoEncontradoException(String recurso, Object id) {
        super(String.format("%s com ID %s não encontrado", recurso, id), "NOT_FOUND");
    }
}

// Tratamento global
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErroDTO> handleNotFound(RecursoNaoEncontradoException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErroDTO(ex.getCodigo(), ex.getMessage(), ex.getTimestamp()));
    }
}
```

### 4. Spring Boot - API REST
```java
@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {
    
    @Autowired
    private PedidoService service;
    
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<PedidoDTO> criar(@Valid @RequestBody PedidoDTO dto) {
        PedidoDTO criado = service.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PedidoDTO> buscar(@PathVariable Long id) {
        return service.buscarPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping
    public Page<PedidoDTO> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) StatusPedido status) {
        return service.listarPaginado(page, size, status);
    }
}
```

### 5. JPA/Hibernate
```java
@Entity
@Table(name = "pedidos")
public class Pedido {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Usuario cliente;
    
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Item> itens = new ArrayList<>();
    
    @Enumerated(EnumType.STRING)
    private StatusPedido status;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal valorTotal;
    
    @CreatedDate
    private LocalDateTime dataCriacao;
    
    public BigDecimal calcularTotal() {
        return itens.stream()
            .map(Item::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    public void adicionarItem(Item item) {
        itens.add(item);
        item.setPedido(this);
        recalcularTotal();
    }
}

// Repository com queries customizadas
@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    
    @Query("SELECT p FROM Pedido p JOIN FETCH p.cliente WHERE p.id = :id")
    Optional<Pedido> findByIdWithCliente(@Param("id") Long id);
    
    @Query("SELECT p FROM Pedido p WHERE p.cliente.id = :clienteId AND p.status = :status")
    List<Pedido> findByClienteAndStatus(
        @Param("clienteId") Long clienteId,
        @Param("status") StatusPedido status
    );
    
    @Query("SELECT p FROM Pedido p WHERE p.dataCriacao BETWEEN :inicio AND :fim")
    List<Pedido> findByPeriodo(
        @Param("inicio") LocalDateTime inicio,
        @Param("fim") LocalDateTime fim
    );
}
```

### 6. JUnit - Testes
```java
// Teste unitário com Mockito
@ExtendWith(MockitoExtension.class)
class PedidoServiceTest {
    
    @Mock
    private PedidoRepository repository;
    
    @Mock
    private UsuarioRepository usuarioRepository;
    
    @InjectMocks
    private PedidoService service;
    
    @Test
    void deveCriarPedidoComSucesso() {
        // Arrange
        Usuario cliente = new Usuario(1L, "João", "joao@email.com");
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(cliente));
        
        PedidoDTO dto = PedidoDTO.builder()
            .clienteId(1L)
            .itens(Arrays.asList(
                new ItemDTO("Produto A", new BigDecimal("10.00"), 2)
            ))
            .build();
        
        when(repository.save(any(Pedido.class))).thenAnswer(inv -> {
            Pedido p = inv.getArgument(0);
            p.setId(1L);
            return p;
        });
        
        // Act
        PedidoDTO resultado = service.criar(dto);
        
        // Assert
        assertThat(resultado.getId()).isNotNull();
        assertThat(resultado.getValorTotal()).isEqualByComparingTo("20.00");
        verify(repository).save(any(Pedido.class));
    }
}

// Teste de integração
@SpringBootTest
@Transactional
class PedidoIntegrationTest {
    
    @Autowired
    private PedidoService service;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Test
    void deveProcessarPedidoCompleto() {
        // Arrange
        Usuario cliente = usuarioRepository.save(
            new Usuario("Maria", "maria@email.com")
        );
        
        PedidoDTO dto = criarPedidoDTO(cliente.getId());
        
        // Act
        PedidoDTO criado = service.criar(dto);
        PedidoDTO buscado = service.buscarPorId(criado.getId()).get();
        
        // Assert
        assertThat(buscado).isNotNull();
        assertThat(buscado.getItens()).hasSize(2);
        assertThat(buscado.getStatus()).isEqualTo(StatusPedido.PENDENTE);
    }
}
```

### 7. Security
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

## 🗄️ Modelo de Dados

```
Usuario
├── id: Long
├── nome: String
├── email: String
├── senha: String (BCrypt)
├── roles: Set<Role>
└── pedidos: List<Pedido>

Produto
├── id: Long
├── nome: String
├── descricao: String
├── preco: BigDecimal
├── categoria: String
└── estoque: Integer

Pedido
├── id: Long
├── cliente: Usuario
├── itens: List<Item>
├── status: StatusPedido
├── valorTotal: BigDecimal
└── dataCriacao: LocalDateTime

Item
├── id: Long
├── pedido: Pedido
├── produto: Produto
├── quantidade: Integer
└── precoUnitario: BigDecimal
```

## 🚀 Tecnologias

- Java 17
- Spring Boot 3.x
- Spring Security (JWT)
- Spring Data JPA
- MySQL / PostgreSQL
- H2 (testes)
- JUnit 5
- Mockito
- Maven
- Swagger/OpenAPI

## 📦 Instalação e Execução

### Pré-requisitos
- Java 17+
- Maven 3.6+
- MySQL 8+ ou PostgreSQL

### Passos

1. **Clonar o repositório**
```bash
git clone <url>
cd 07-mvc-completo/projeto-integrado
```

2. **Configurar banco de dados**
```properties
# application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/gestao
spring.datasource.username=root
spring.datasource.password=senha
```

3. **Executar**
```bash
mvn clean install
mvn spring-boot:run
```

4. **Acessar**
- API: http://localhost:8080/api
- Swagger: http://localhost:8080/swagger-ui.html

## 📚 Endpoints

### Autenticação
- POST `/api/auth/login` - Login
- POST `/api/auth/registro` - Registro

### Usuários
- GET `/api/usuarios` - Listar
- GET `/api/usuarios/{id}` - Buscar
- POST `/api/usuarios` - Criar
- PUT `/api/usuarios/{id}` - Atualizar
- DELETE `/api/usuarios/{id}` - Deletar

### Produtos
- GET `/api/produtos` - Listar (paginado)
- GET `/api/produtos/{id}` - Buscar
- POST `/api/produtos` - Criar (ADMIN)
- PUT `/api/produtos/{id}` - Atualizar (ADMIN)
- DELETE `/api/produtos/{id}` - Deletar (ADMIN)

### Pedidos
- GET `/api/pedidos` - Listar (paginado)
- GET `/api/pedidos/{id}` - Buscar
- POST `/api/pedidos` - Criar
- PUT `/api/pedidos/{id}/status` - Atualizar status

## 🧪 Executar Testes

```bash
# Todos os testes
mvn test

# Apenas testes unitários
mvn test -Dtest=**/*Test

# Apenas testes de integração
mvn test -Dtest=**/*IntegrationTest

# Com cobertura
mvn test jacoco:report
```

## 📈 Métricas

- **Cobertura de Testes**: > 85%
- **Complexidade Ciclomática**: < 10
- **Linhas por Método**: < 30
- **Code Smells**: 0

## 🎯 Próximos Passos

- [ ] Implementar cache com Redis
- [ ] Adicionar mensageria (RabbitMQ/Kafka)
- [ ] Implementar circuit breaker
- [ ] Dockerizar aplicação
- [ ] CI/CD pipeline
- [ ] Monitoramento com Prometheus/Grafana

## 📝 Licença

Este projeto é parte do portfólio de evolução técnica.
