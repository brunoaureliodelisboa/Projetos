# JPA e Hibernate

Mapeamento objeto-relacional com JPA e Hibernate.

## 🏗️ Entidades Básicas

### Entidade Simples
```java
@Entity
@Table(name = "produtos")
public class Produto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String nome;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal preco;
    
    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;
    
    @Enumerated(EnumType.STRING)
    private Status status;
    
    @Transient // Não persiste no banco
    private Double desconto;
    
    // Getters e Setters
}
```

## 🔗 Relacionamentos

### OneToOne (1:1)
```java
@Entity
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nome;
    
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "endereco_id", referencedColumnName = "id")
    private Endereco endereco;
}

@Entity
public class Endereco {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String rua;
    private String cidade;
    
    @OneToOne(mappedBy = "endereco")
    private Usuario usuario;
}
```

### OneToMany / ManyToOne (1:N)
```java
@Entity
public class Departamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nome;
    
    @OneToMany(mappedBy = "departamento", cascade = CascadeType.ALL)
    private List<Funcionario> funcionarios = new ArrayList<>();
    
    // Método helper
    public void adicionarFuncionario(Funcionario funcionario) {
        funcionarios.add(funcionario);
        funcionario.setDepartamento(this);
    }
}

@Entity
public class Funcionario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nome;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departamento_id")
    private Departamento departamento;
}
```

### ManyToMany (N:N)
```java
@Entity
public class Estudante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nome;
    
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "estudante_curso",
        joinColumns = @JoinColumn(name = "estudante_id"),
        inverseJoinColumns = @JoinColumn(name = "curso_id")
    )
    private Set<Curso> cursos = new HashSet<>();
}

@Entity
public class Curso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nome;
    
    @ManyToMany(mappedBy = "cursos")
    private Set<Estudante> estudantes = new HashSet<>();
}
```

## 📦 Cascade Types

```java
// Propaga todas operações
@OneToMany(cascade = CascadeType.ALL)
private List<Item> itens;

// Propaga apenas persist
@OneToMany(cascade = CascadeType.PERSIST)
private List<Item> itens;

// Múltiplos cascades
@OneToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
private List<Item> itens;
```

## 🔄 Fetch Types

```java
// LAZY: Carrega sob demanda (padrão para coleções)
@OneToMany(fetch = FetchType.LAZY)
private List<Pedido> pedidos;

// EAGER: Carrega imediatamente (padrão para *ToOne)
@ManyToOne(fetch = FetchType.EAGER)
private Cliente cliente;
```

## 🎯 Estratégias de Geração de ID

```java
// Auto incremento (MySQL, PostgreSQL)
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

// Sequence (PostgreSQL, Oracle)
@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_produto")
@SequenceGenerator(name = "seq_produto", sequenceName = "produto_seq")
private Long id;

// UUID
@GeneratedValue(strategy = GenerationType.UUID)
private UUID id;
```

## 🗓️ Auditoria Automática

```java
@EntityListeners(AuditingEntityListener.class)
@MappedSuperclass
public abstract class EntidadeAuditavel {
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime dataCriacao;
    
    @LastModifiedDate
    private LocalDateTime dataModificacao;
    
    @CreatedBy
    private String criadoPor;
    
    @LastModifiedBy
    private String modificadoPor;
}

// Habilitar auditoria
@Configuration
@EnableJpaAuditing
public class JpaAuditingConfig {
    
    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> Optional.ofNullable(SecurityContextHolder.getContext())
            .map(SecurityContext::getAuthentication)
            .filter(Authentication::isAuthenticated)
            .map(Authentication::getName);
    }
}
```

## 🔍 Repositórios

```java
@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    
    // Query methods (Spring Data gera implementação automaticamente)
    List<Produto> findByNome(String nome);
    List<Produto> findByPrecoLessThan(BigDecimal preco);
    List<Produto> findByNomeContainingIgnoreCase(String nome);
    List<Produto> findByStatusAndPrecoGreaterThan(Status status, BigDecimal preco);
    
    // Com ordenação
    List<Produto> findByStatusOrderByPrecoDesc(Status status);
    
    // Com paginação
    Page<Produto> findByStatus(Status status, Pageable pageable);
    
    // Contagem
    long countByStatus(Status status);
    
    // Verificação de existência
    boolean existsByNome(String nome);
    
    // Deleção
    void deleteByStatus(Status status);
}
```

## 💾 Operações CRUD

```java
@Service
public class ProdutoService {
    
    @Autowired
    private ProdutoRepository repository;
    
    // Create
    @Transactional
    public Produto salvar(Produto produto) {
        return repository.save(produto);
    }
    
    // Read
    @Transactional(readOnly = true)
    public Optional<Produto> buscarPorId(Long id) {
        return repository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public List<Produto> listarTodos() {
        return repository.findAll();
    }
    
    // Update
    @Transactional
    public Produto atualizar(Long id, Produto produtoAtualizado) {
        Produto produto = repository.findById(id)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Produto", id));
        
        produto.setNome(produtoAtualizado.getNome());
        produto.setPreco(produtoAtualizado.getPreco());
        
        return repository.save(produto);
    }
    
    // Delete
    @Transactional
    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
```

## 📊 Herança

### Single Table
```java
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "tipo")
public abstract class Pagamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private BigDecimal valor;
}

@Entity
@DiscriminatorValue("CARTAO")
public class PagamentoCartao extends Pagamento {
    private String numeroCartao;
}

@Entity
@DiscriminatorValue("BOLETO")
public class PagamentoBoleto extends Pagamento {
    private String codigoBarras;
}
```

## 🎓 Boas Práticas

1. **Usar FetchType.LAZY** para coleções
2. **Implementar equals/hashCode** baseado em ID ou business key
3. **Usar @Transactional** apropriadamente
4. **Evitar N+1 queries** (usar fetch joins)
5. **Validar entidades** com Bean Validation
6. **Usar DTOs** para transferência de dados
7. **Configurar pool de conexões** adequadamente
8. **Implementar auditoria** para rastreabilidade
