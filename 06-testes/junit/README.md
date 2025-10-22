# Testes Unitários com JUnit

Implementação de testes unitários usando JUnit 5 e Mockito.

## 🚀 Configuração

### Dependências Maven
```xml
<dependencies>
    <!-- JUnit 5 -->
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <scope>test</scope>
    </dependency>
    
    <!-- Mockito -->
    <dependency>
        <groupId>org.mockito</groupId>
        <artifactId>mockito-core</artifactId>
        <scope>test</scope>
    </dependency>
    
    <!-- AssertJ -->
    <dependency>
        <groupId>org.assertj</groupId>
        <artifactId>assertj-core</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

## 📝 Testes Básicos

```java
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

public class CalculadoraTest {
    
    private Calculadora calculadora;
    
    @BeforeAll
    static void setupAll() {
        // Executado uma vez antes de todos os testes
        System.out.println("Iniciando testes da Calculadora");
    }
    
    @BeforeEach
    void setup() {
        // Executado antes de cada teste
        calculadora = new Calculadora();
    }
    
    @Test
    @DisplayName("Deve somar dois números positivos")
    void deveSomarNumerosPositivos() {
        // Arrange
        int a = 5;
        int b = 3;
        
        // Act
        int resultado = calculadora.somar(a, b);
        
        // Assert
        assertEquals(8, resultado);
    }
    
    @Test
    void deveSubtrairNumeros() {
        assertEquals(2, calculadora.subtrair(5, 3));
    }
    
    @Test
    void deveMultiplicarNumeros() {
        assertEquals(15, calculadora.multiplicar(5, 3));
    }
    
    @Test
    void deveDividirNumeros() {
        assertEquals(2.5, calculadora.dividir(5, 2), 0.01);
    }
    
    @Test
    void deveLancarExcecaoAoDividirPorZero() {
        assertThrows(ArithmeticException.class, () -> {
            calculadora.dividir(10, 0);
        });
    }
    
    @AfterEach
    void cleanup() {
        // Executado após cada teste
        calculadora = null;
    }
    
    @AfterAll
    static void cleanupAll() {
        // Executado uma vez após todos os testes
        System.out.println("Finalizando testes da Calculadora");
    }
}
```

## 🎭 Mockito - Mocks e Stubs

### Criando Mocks
```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class UsuarioServiceTest {
    
    @Mock
    private UsuarioRepository repository;
    
    @InjectMocks
    private UsuarioService service;
    
    @Test
    void deveBuscarUsuarioPorId() {
        // Arrange
        Long id = 1L;
        Usuario usuario = new Usuario(id, "João", "joao@email.com");
        when(repository.findById(id)).thenReturn(Optional.of(usuario));
        
        // Act
        Optional<Usuario> resultado = service.buscarPorId(id);
        
        // Assert
        assertTrue(resultado.isPresent());
        assertEquals("João", resultado.get().getNome());
        verify(repository, times(1)).findById(id);
    }
    
    @Test
    void deveRetornarVazioQuandoUsuarioNaoExiste() {
        // Arrange
        Long id = 999L;
        when(repository.findById(id)).thenReturn(Optional.empty());
        
        // Act
        Optional<Usuario> resultado = service.buscarPorId(id);
        
        // Assert
        assertFalse(resultado.isPresent());
        verify(repository).findById(id);
    }
    
    @Test
    void deveCriarNovoUsuario() {
        // Arrange
        Usuario usuario = new Usuario(null, "Maria", "maria@email.com");
        Usuario usuarioSalvo = new Usuario(1L, "Maria", "maria@email.com");
        when(repository.save(any(Usuario.class))).thenReturn(usuarioSalvo);
        
        // Act
        Usuario resultado = service.criar(usuario);
        
        // Assert
        assertNotNull(resultado.getId());
        assertEquals("Maria", resultado.getNome());
        verify(repository).save(usuario);
    }
    
    @Test
    void deveLancarExcecaoAoCriarUsuarioComEmailDuplicado() {
        // Arrange
        Usuario usuario = new Usuario(null, "Pedro", "pedro@email.com");
        when(repository.existsByEmail(usuario.getEmail())).thenReturn(true);
        
        // Act & Assert
        assertThrows(EmailDuplicadoException.class, () -> {
            service.criar(usuario);
        });
        
        verify(repository, never()).save(any());
    }
}
```

## 🔍 AssertJ - Assertions Fluentes

```java
import static org.assertj.core.api.Assertions.*;

public class ProdutoTest {
    
    @Test
    void deveValidarProduto() {
        Produto produto = new Produto(1L, "Notebook", new BigDecimal("2500.00"));
        
        assertThat(produto)
            .isNotNull()
            .extracting("id", "nome", "preco")
            .containsExactly(1L, "Notebook", new BigDecimal("2500.00"));
    }
    
    @Test
    void deveValidarLista() {
        List<String> nomes = Arrays.asList("Ana", "Bruno", "Carlos");
        
        assertThat(nomes)
            .hasSize(3)
            .contains("Ana", "Carlos")
            .doesNotContain("David")
            .startsWith("Ana")
            .endsWith("Carlos");
    }
    
    @Test
    void deveValidarExcecao() {
        assertThatThrownBy(() -> {
            throw new IllegalArgumentException("Erro");
        })
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("Erro")
            .hasNoCause();
    }
}
```

## 🎯 Testes Parametrizados

```java
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.*;

public class ValidadorTest {
    
    @ParameterizedTest
    @ValueSource(strings = {"", "  ", "\t", "\n"})
    void deveRejeitarStringsVazias(String input) {
        assertFalse(Validador.isValido(input));
    }
    
    @ParameterizedTest
    @CsvSource({
        "1, 2, 3",
        "10, 20, 30",
        "100, 200, 300"
    })
    void deveSomarNumeros(int a, int b, int esperado) {
        assertEquals(esperado, a + b);
    }
    
    @ParameterizedTest
    @MethodSource("provideEmails")
    void deveValidarEmails(String email, boolean esperado) {
        assertEquals(esperado, Validador.isEmailValido(email));
    }
    
    static Stream<Arguments> provideEmails() {
        return Stream.of(
            Arguments.of("teste@email.com", true),
            Arguments.of("invalido", false),
            Arguments.of("teste@", false),
            Arguments.of("@email.com", false)
        );
    }
}
```

## ⏱️ Testes de Timeout

```java
@Test
@Timeout(value = 100, unit = TimeUnit.MILLISECONDS)
void deveExecutarRapido() {
    service.operacaoRapida();
}

@Test
void deveCompletar() {
    assertTimeout(Duration.ofSeconds(1), () -> {
        service.operacao();
    });
}
```

## 🔄 Testes Condicionais

```java
@Test
@EnabledOnOs(OS.LINUX)
void testeApenasLinux() {
    // Só executa no Linux
}

@Test
@DisabledOnOs(OS.WINDOWS)
void testeExcetoWindows() {
    // Executa em tudo menos Windows
}

@Test
@EnabledIfEnvironmentVariable(named = "ENV", matches = "production")
void testeApenasProducao() {
    // Só executa se ENV=production
}
```

## 📊 Testes Aninhados

```java
@DisplayName("Testes de Pedido")
class PedidoTest {
    
    @Nested
    @DisplayName("Quando criar novo pedido")
    class QuandoCriar {
        
        @Test
        void deveIniciarComStatusPendente() {
            Pedido pedido = new Pedido();
            assertEquals(Status.PENDENTE, pedido.getStatus());
        }
        
        @Test
        void deveIniciarComListaItensVazia() {
            Pedido pedido = new Pedido();
            assertTrue(pedido.getItens().isEmpty());
        }
    }
    
    @Nested
    @DisplayName("Quando adicionar item")
    class QuandoAdicionarItem {
        
        private Pedido pedido;
        
        @BeforeEach
        void setup() {
            pedido = new Pedido();
        }
        
        @Test
        void deveIncrementarQuantidadeItens() {
            pedido.adicionarItem(new Item());
            assertEquals(1, pedido.getItens().size());
        }
        
        @Test
        void deveCalcularValorTotal() {
            pedido.adicionarItem(new Item("Produto", new BigDecimal("10.00")));
            pedido.adicionarItem(new Item("Produto2", new BigDecimal("20.00")));
            assertEquals(new BigDecimal("30.00"), pedido.getValorTotal());
        }
    }
}
```

## 🎓 Boas Práticas

1. **Testes independentes**: Cada teste deve ser independente
2. **Nomenclatura clara**: Use nomes descritivos
3. **AAA Pattern**: Arrange, Act, Assert
4. **Um assert por teste**: Foco em um comportamento
5. **Evitar lógica**: Testes devem ser simples
6. **Mock apenas dependências externas**
7. **Cobertura > 80%**: Buscar alta cobertura
8. **Testes rápidos**: Testes unitários devem ser instantâneos
9. **Não testar código de terceiros**: Foque no seu código
10. **Manutenível**: Testes fáceis de entender e modificar
