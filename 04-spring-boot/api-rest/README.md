# Spring Boot - APIs REST

Desenvolvimento de APIs RESTful com Spring Boot.

## 🎯 Estrutura Básica

### Controller
```java
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    
    @Autowired
    private UsuarioService service;
    
    @GetMapping
    public List<UsuarioDTO> listarTodos() {
        return service.listarTodos();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<UsuarioDTO> criar(@Valid @RequestBody UsuarioDTO dto) {
        UsuarioDTO criado = service.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioDTO dto) {
        return service.atualizar(id, dto)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
```

### Service
```java
@Service
public class UsuarioService {
    
    @Autowired
    private UsuarioRepository repository;
    
    @Transactional(readOnly = true)
    public List<UsuarioDTO> listarTodos() {
        return repository.findAll().stream()
            .map(this::converterParaDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Optional<UsuarioDTO> buscarPorId(Long id) {
        return repository.findById(id)
            .map(this::converterParaDTO);
    }
    
    @Transactional
    public UsuarioDTO criar(UsuarioDTO dto) {
        Usuario usuario = converterParaEntidade(dto);
        usuario = repository.save(usuario);
        return converterParaDTO(usuario);
    }
    
    @Transactional
    public Optional<UsuarioDTO> atualizar(Long id, UsuarioDTO dto) {
        return repository.findById(id)
            .map(usuario -> {
                atualizarDados(usuario, dto);
                usuario = repository.save(usuario);
                return converterParaDTO(usuario);
            });
    }
    
    @Transactional
    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
```

### Repository
```java
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    List<Usuario> findByNomeContainingIgnoreCase(String nome);
    
    @Query("SELECT u FROM Usuario u WHERE u.ativo = true")
    List<Usuario> findAtivos();
}
```

## 📦 DTOs (Data Transfer Objects)

```java
public class UsuarioDTO {
    private Long id;
    
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 3, max = 100)
    private String nome;
    
    @Email(message = "Email inválido")
    @NotBlank(message = "Email é obrigatório")
    private String email;
    
    @Min(value = 18, message = "Idade mínima é 18 anos")
    private Integer idade;
    
    // Getters e Setters
}
```

## 🛡️ Tratamento de Exceções

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErroDTO> handleRecursoNaoEncontrado(
            RecursoNaoEncontradoException ex) {
        ErroDTO erro = new ErroDTO(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroValidacaoDTO> handleValidacao(
            MethodArgumentNotValidException ex) {
        List<String> erros = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .collect(Collectors.toList());
        
        ErroValidacaoDTO erro = new ErroValidacaoDTO(
            HttpStatus.BAD_REQUEST.value(),
            "Erro de validação",
            erros,
            LocalDateTime.now()
        );
        return ResponseEntity.badRequest().body(erro);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroDTO> handleException(Exception ex) {
        ErroDTO erro = new ErroDTO(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "Erro interno do servidor",
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(erro);
    }
}
```

## ⚙️ Configuração

### application.properties
```properties
# Server
server.port=8080
server.servlet.context-path=/api

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/meudb
spring.datasource.username=root
spring.datasource.password=senha

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Logging
logging.level.org.springframework=INFO
logging.level.com.projeto=DEBUG
```

## 📊 Paginação e Ordenação

```java
@GetMapping
public Page<UsuarioDTO> listar(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "id") String sortBy) {
    
    Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
    return service.listarPaginado(pageable);
}
```

## 🔍 Filtros e Busca

```java
@GetMapping("/buscar")
public List<UsuarioDTO> buscar(
        @RequestParam(required = false) String nome,
        @RequestParam(required = false) String email,
        @RequestParam(required = false) Boolean ativo) {
    return service.buscarComFiltros(nome, email, ativo);
}
```

## 📚 Boas Práticas

1. **Separação de camadas**: Controller → Service → Repository
2. **DTOs**: Nunca expor entidades diretamente
3. **Validação**: Usar Bean Validation
4. **Status HTTP apropriados**: 200, 201, 204, 400, 404, 500
5. **Tratamento de erros**: Global exception handler
6. **Documentação**: Usar Swagger/OpenAPI
7. **Versionamento**: /api/v1/...
8. **HATEOAS**: Links para recursos relacionados
