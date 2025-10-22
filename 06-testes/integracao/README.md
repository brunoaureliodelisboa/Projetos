# Testes de Integração

Testes de integração com Spring Boot Test, testando múltiplos componentes juntos.

## 🚀 Configuração

### Dependências
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>

<!-- H2 para testes -->
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>test</scope>
</dependency>
```

### application-test.properties
```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
```

## 🧪 Testes de Repository

```java
@DataJpaTest
@ActiveProfiles("test")
class UsuarioRepositoryTest {
    
    @Autowired
    private UsuarioRepository repository;
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Test
    void deveSalvarUsuario() {
        // Arrange
        Usuario usuario = new Usuario("João", "joao@email.com");
        
        // Act
        Usuario salvo = repository.save(usuario);
        
        // Assert
        assertThat(salvo.getId()).isNotNull();
        assertThat(salvo.getNome()).isEqualTo("João");
    }
    
    @Test
    void deveBuscarUsuarioPorEmail() {
        // Arrange
        Usuario usuario = new Usuario("Maria", "maria@email.com");
        entityManager.persist(usuario);
        entityManager.flush();
        
        // Act
        Optional<Usuario> encontrado = repository.findByEmail("maria@email.com");
        
        // Assert
        assertThat(encontrado).isPresent();
        assertThat(encontrado.get().getNome()).isEqualTo("Maria");
    }
    
    @Test
    void deveRetornarVazioQuandoEmailNaoExiste() {
        Optional<Usuario> resultado = repository.findByEmail("inexistente@email.com");
        assertThat(resultado).isEmpty();
    }
    
    @Test
    void deveListarUsuariosAtivos() {
        // Arrange
        entityManager.persist(new Usuario("Ana", "ana@email.com", true));
        entityManager.persist(new Usuario("Bruno", "bruno@email.com", false));
        entityManager.persist(new Usuario("Carlos", "carlos@email.com", true));
        
        // Act
        List<Usuario> ativos = repository.findByAtivoTrue();
        
        // Assert
        assertThat(ativos).hasSize(2);
        assertThat(ativos).extracting("nome").containsExactlyInAnyOrder("Ana", "Carlos");
    }
}
```

## 🌐 Testes de API REST

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class UsuarioControllerIntegrationTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Autowired
    private UsuarioRepository repository;
    
    @BeforeEach
    void setup() {
        repository.deleteAll();
    }
    
    @Test
    void deveCriarNovoUsuario() {
        // Arrange
        UsuarioDTO dto = new UsuarioDTO("João", "joao@email.com");
        
        // Act
        ResponseEntity<UsuarioDTO> response = restTemplate.postForEntity(
            "/api/usuarios",
            dto,
            UsuarioDTO.class
        );
        
        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getId()).isNotNull();
        assertThat(response.getBody().getNome()).isEqualTo("João");
    }
    
    @Test
    void deveBuscarUsuarioPorId() {
        // Arrange
        Usuario usuario = repository.save(new Usuario("Maria", "maria@email.com"));
        
        // Act
        ResponseEntity<UsuarioDTO> response = restTemplate.getForEntity(
            "/api/usuarios/" + usuario.getId(),
            UsuarioDTO.class
        );
        
        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().getNome()).isEqualTo("Maria");
    }
    
    @Test
    void deveRetornar404QuandoUsuarioNaoExiste() {
        ResponseEntity<UsuarioDTO> response = restTemplate.getForEntity(
            "/api/usuarios/999",
            UsuarioDTO.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
    
    @Test
    void deveAtualizarUsuario() {
        // Arrange
        Usuario usuario = repository.save(new Usuario("Pedro", "pedro@email.com"));
        UsuarioDTO atualizado = new UsuarioDTO("Pedro Silva", "pedro@email.com");
        
        // Act
        restTemplate.put("/api/usuarios/" + usuario.getId(), atualizado);
        
        // Assert
        Usuario resultado = repository.findById(usuario.getId()).get();
        assertThat(resultado.getNome()).isEqualTo("Pedro Silva");
    }
    
    @Test
    void deveDeletarUsuario() {
        // Arrange
        Usuario usuario = repository.save(new Usuario("Ana", "ana@email.com"));
        
        // Act
        restTemplate.delete("/api/usuarios/" + usuario.getId());
        
        // Assert
        assertThat(repository.findById(usuario.getId())).isEmpty();
    }
}
```

## 🎭 MockMvc - Testes de Controller

```java
@WebMvcTest(UsuarioController.class)
class UsuarioControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private UsuarioService service;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    void deveListarUsuarios() throws Exception {
        // Arrange
        List<UsuarioDTO> usuarios = Arrays.asList(
            new UsuarioDTO(1L, "João", "joao@email.com"),
            new UsuarioDTO(2L, "Maria", "maria@email.com")
        );
        when(service.listarTodos()).thenReturn(usuarios);
        
        // Act & Assert
        mockMvc.perform(get("/api/usuarios"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(2)))
            .andExpect(jsonPath("$[0].nome").value("João"))
            .andExpect(jsonPath("$[1].nome").value("Maria"));
    }
    
    @Test
    void deveCriarUsuario() throws Exception {
        // Arrange
        UsuarioDTO dto = new UsuarioDTO("Pedro", "pedro@email.com");
        UsuarioDTO salvo = new UsuarioDTO(1L, "Pedro", "pedro@email.com");
        when(service.criar(any(UsuarioDTO.class))).thenReturn(salvo);
        
        // Act & Assert
        mockMvc.perform(post("/api/usuarios")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.nome").value("Pedro"));
    }
    
    @Test
    void deveRetornar400QuandoDadosInvalidos() throws Exception {
        UsuarioDTO dto = new UsuarioDTO("", "email-invalido");
        
        mockMvc.perform(post("/api/usuarios")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isBadRequest());
    }
}
```

## 🔐 Testes com Security

```java
@SpringBootTest
@AutoConfigureMockMvc
class SecureControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void adminDeveAcessarEndpointProtegido() throws Exception {
        mockMvc.perform(get("/api/admin/usuarios"))
            .andExpect(status().isOk());
    }
    
    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void usuarioNaoDeveAcessarEndpointAdmin() throws Exception {
        mockMvc.perform(get("/api/admin/usuarios"))
            .andExpect(status().isForbidden());
    }
    
    @Test
    void deveFalharSemAutenticacao() throws Exception {
        mockMvc.perform(get("/api/usuarios"))
            .andExpect(status().isUnauthorized());
    }
}
```

## 📊 Testes de Service com Transações

```java
@SpringBootTest
@Transactional
@ActiveProfiles("test")
class PedidoServiceIntegrationTest {
    
    @Autowired
    private PedidoService pedidoService;
    
    @Autowired
    private PedidoRepository pedidoRepository;
    
    @Autowired
    private ClienteRepository clienteRepository;
    
    @Test
    void deveCriarPedidoComItens() {
        // Arrange
        Cliente cliente = clienteRepository.save(new Cliente("João"));
        PedidoDTO dto = new PedidoDTO();
        dto.setClienteId(cliente.getId());
        dto.setItens(Arrays.asList(
            new ItemDTO("Produto A", new BigDecimal("10.00"), 2),
            new ItemDTO("Produto B", new BigDecimal("20.00"), 1)
        ));
        
        // Act
        PedidoDTO resultado = pedidoService.criar(dto);
        
        // Assert
        assertThat(resultado.getId()).isNotNull();
        assertThat(resultado.getItens()).hasSize(2);
        assertThat(resultado.getValorTotal()).isEqualByComparingTo("40.00");
        
        // Verificar no banco
        Pedido pedido = pedidoRepository.findById(resultado.getId()).get();
        assertThat(pedido.getItens()).hasSize(2);
    }
    
    @Test
    void deveRollbackQuandoErroOcorre() {
        // Arrange
        PedidoDTO dto = new PedidoDTO();
        dto.setClienteId(999L); // Cliente inexistente
        
        // Act & Assert
        assertThrows(RecursoNaoEncontradoException.class, () -> {
            pedidoService.criar(dto);
        });
        
        // Verificar que nada foi salvo
        assertThat(pedidoRepository.count()).isZero();
    }
}
```

## 🌍 Testes End-to-End

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class FluxoCompletoTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    private static Long usuarioId;
    
    @Test
    @Order(1)
    void deveCriarUsuario() {
        UsuarioDTO dto = new UsuarioDTO("João", "joao@email.com");
        ResponseEntity<UsuarioDTO> response = restTemplate.postForEntity(
            "/api/usuarios", dto, UsuarioDTO.class);
        
        usuarioId = response.getBody().getId();
        assertThat(usuarioId).isNotNull();
    }
    
    @Test
    @Order(2)
    void deveBuscarUsuarioCriado() {
        ResponseEntity<UsuarioDTO> response = restTemplate.getForEntity(
            "/api/usuarios/" + usuarioId, UsuarioDTO.class);
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().getNome()).isEqualTo("João");
    }
    
    @Test
    @Order(3)
    void deveAtualizarUsuario() {
        UsuarioDTO atualizado = new UsuarioDTO("João Silva", "joao@email.com");
        restTemplate.put("/api/usuarios/" + usuarioId, atualizado);
        
        ResponseEntity<UsuarioDTO> response = restTemplate.getForEntity(
            "/api/usuarios/" + usuarioId, UsuarioDTO.class);
        
        assertThat(response.getBody().getNome()).isEqualTo("João Silva");
    }
    
    @Test
    @Order(4)
    void deveDeletarUsuario() {
        restTemplate.delete("/api/usuarios/" + usuarioId);
        
        ResponseEntity<UsuarioDTO> response = restTemplate.getForEntity(
            "/api/usuarios/" + usuarioId, UsuarioDTO.class);
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}
```

## 🎓 Boas Práticas

1. **Usar banco em memória (H2)** para testes
2. **Limpar dados** entre testes (@BeforeEach)
3. **Profiles separados** (test, dev, prod)
4. **Testar cenários reais** e fluxos completos
5. **Verificar rollback** de transações
6. **Testar segurança** e autorização
7. **Usar @Transactional** para rollback automático
8. **TestContainers** para testes com banco real
9. **Cobertura de integração** complementa unitários
10. **CI/CD** - executar em pipeline
