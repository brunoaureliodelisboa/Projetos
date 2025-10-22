# Exceções - Nível Avançado

Técnicas avançadas de tratamento de exceções e error handling.

## 🏗️ Exceções Customizadas

### Hierarquia de Exceções
```java
// Exceção base da aplicação
public class AplicacaoException extends Exception {
    private String codigo;
    private LocalDateTime timestamp;
    
    public AplicacaoException(String mensagem, String codigo) {
        super(mensagem);
        this.codigo = codigo;
        this.timestamp = LocalDateTime.now();
    }
    
    public String getCodigo() {
        return codigo;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}

// Exceções específicas
public class ValidacaoException extends AplicacaoException {
    private List<String> erros;
    
    public ValidacaoException(String mensagem, List<String> erros) {
        super(mensagem, "VALIDACAO_ERROR");
        this.erros = erros;
    }
    
    public List<String> getErros() {
        return erros;
    }
}

public class RecursoNaoEncontradoException extends AplicacaoException {
    private String recurso;
    private Object id;
    
    public RecursoNaoEncontradoException(String recurso, Object id) {
        super(String.format("%s não encontrado: %s", recurso, id), "NOT_FOUND");
        this.recurso = recurso;
        this.id = id;
    }
}
```

## 🎯 Padrões de Error Handling

### Chain of Responsibility
```java
public interface ExceptionHandler {
    void setNext(ExceptionHandler next);
    void handle(Exception e);
}

public class ValidationExceptionHandler implements ExceptionHandler {
    private ExceptionHandler next;
    
    @Override
    public void setNext(ExceptionHandler next) {
        this.next = next;
    }
    
    @Override
    public void handle(Exception e) {
        if (e instanceof ValidacaoException) {
            // Tratar validação
            System.err.println("Erro de validação: " + e.getMessage());
        } else if (next != null) {
            next.handle(e);
        }
    }
}
```

### Retry Pattern
```java
public class RetryHandler {
    public <T> T executarComRetry(Callable<T> operacao, int maxTentativas) 
            throws Exception {
        int tentativa = 0;
        Exception ultimaExcecao = null;
        
        while (tentativa < maxTentativas) {
            try {
                return operacao.call();
            } catch (Exception e) {
                ultimaExcecao = e;
                tentativa++;
                
                if (tentativa < maxTentativas) {
                    System.out.println("Tentativa " + tentativa + " falhou. Tentando novamente...");
                    Thread.sleep(1000 * tentativa); // Backoff exponencial
                }
            }
        }
        
        throw new Exception("Falhou após " + maxTentativas + " tentativas", ultimaExcecao);
    }
}
```

### Circuit Breaker
```java
public class CircuitBreaker {
    private enum State { CLOSED, OPEN, HALF_OPEN }
    
    private State state = State.CLOSED;
    private int failureCount = 0;
    private int failureThreshold = 5;
    private long timeout = 60000; // 1 minuto
    private long lastFailureTime = 0;
    
    public <T> T execute(Callable<T> operation) throws Exception {
        if (state == State.OPEN) {
            if (System.currentTimeMillis() - lastFailureTime > timeout) {
                state = State.HALF_OPEN;
            } else {
                throw new Exception("Circuit breaker está OPEN");
            }
        }
        
        try {
            T result = operation.call();
            reset();
            return result;
        } catch (Exception e) {
            recordFailure();
            throw e;
        }
    }
    
    private void recordFailure() {
        failureCount++;
        lastFailureTime = System.currentTimeMillis();
        
        if (failureCount >= failureThreshold) {
            state = State.OPEN;
        }
    }
    
    private void reset() {
        failureCount = 0;
        state = State.CLOSED;
    }
}
```

## 📝 Logging Avançado

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ServicoComLog {
    private static final Logger logger = LoggerFactory.getLogger(ServicoComLog.class);
    
    public void processar(Pedido pedido) {
        try {
            logger.info("Processando pedido ID: {}", pedido.getId());
            
            validar(pedido);
            executar(pedido);
            
            logger.info("Pedido {} processado com sucesso", pedido.getId());
            
        } catch (ValidacaoException e) {
            logger.warn("Validação falhou para pedido {}: {}", 
                       pedido.getId(), e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Erro ao processar pedido " + pedido.getId(), e);
            throw new ProcessamentoException("Erro no processamento", e);
        }
    }
}
```

## 🔍 Rastreamento de Contexto

```java
public class ExceptionComContexto extends RuntimeException {
    private Map<String, Object> contexto = new HashMap<>();
    
    public ExceptionComContexto(String mensagem) {
        super(mensagem);
    }
    
    public ExceptionComContexto adicionarContexto(String chave, Object valor) {
        contexto.put(chave, valor);
        return this;
    }
    
    @Override
    public String getMessage() {
        StringBuilder sb = new StringBuilder(super.getMessage());
        sb.append("\nContexto:\n");
        contexto.forEach((k, v) -> sb.append("  ").append(k).append(": ").append(v).append("\n"));
        return sb.toString();
    }
}

// Uso
throw new ExceptionComContexto("Erro ao processar transação")
    .adicionarContexto("usuario", usuario.getId())
    .adicionarContexto("valor", transacao.getValor())
    .adicionarContexto("timestamp", LocalDateTime.now());
```

## 🛡️ Exception Wrapping

```java
public class DAOException extends RuntimeException {
    public DAOException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}

public class UsuarioDAO {
    public Usuario buscar(Long id) {
        try {
            // Código JDBC
            return usuario;
        } catch (SQLException e) {
            throw new DAOException(
                "Erro ao buscar usuário com ID: " + id, e);
        }
    }
}
```

## 📊 Métricas e Monitoramento

```java
public class ExceptionMetrics {
    private Map<String, AtomicInteger> contadores = new ConcurrentHashMap<>();
    
    public void registrar(Exception e) {
        String tipo = e.getClass().getSimpleName();
        contadores.computeIfAbsent(tipo, k -> new AtomicInteger(0))
                  .incrementAndGet();
    }
    
    public Map<String, Integer> obterEstatisticas() {
        return contadores.entrySet().stream()
            .collect(Collectors.toMap(
                Map.Entry::getKey,
                e -> e.getValue().get()
            ));
    }
}
```

## 🎓 Boas Práticas Avançadas

1. **Fail Fast**: Falhe cedo e com mensagens claras
2. **Exception Translation**: Traduza exceções de baixo nível
3. **Context Enrichment**: Adicione contexto relevante
4. **Structured Logging**: Use logging estruturado
5. **Metrics**: Monitore exceções em produção
6. **Documentation**: Documente exceções possíveis com @throws
