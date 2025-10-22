# Queries - JPQL e SQL Nativo

Queries customizadas, otimizações e técnicas avançadas.

## 📝 JPQL (Java Persistence Query Language)

### Queries Básicas
```java
@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    
    // JPQL básico
    @Query("SELECT p FROM Produto p WHERE p.preco > :preco")
    List<Produto> findProdutosCaros(@Param("preco") BigDecimal preco);
    
    // Com ordenação
    @Query("SELECT p FROM Produto p WHERE p.status = :status ORDER BY p.preco DESC")
    List<Produto> findByStatusOrdenado(@Param("status") Status status);
    
    // Com múltiplos parâmetros
    @Query("SELECT p FROM Produto p WHERE p.nome LIKE %:nome% AND p.preco BETWEEN :min AND :max")
    List<Produto> buscarPorNomeEFaixaPreco(
        @Param("nome") String nome,
        @Param("min") BigDecimal min,
        @Param("max") BigDecimal max
    );
}
```

### Joins
```java
// Inner Join
@Query("SELECT p FROM Pedido p JOIN p.cliente c WHERE c.nome = :nomeCliente")
List<Pedido> findPedidosPorCliente(@Param("nomeCliente") String nome);

// Left Join
@Query("SELECT d FROM Departamento d LEFT JOIN d.funcionarios f")
List<Departamento> findAllWithFuncionarios();

// Fetch Join (evita N+1)
@Query("SELECT p FROM Pedido p JOIN FETCH p.itens WHERE p.id = :id")
Optional<Pedido> findByIdWithItens(@Param("id") Long id);

// Múltiplos Fetch Joins
@Query("SELECT DISTINCT p FROM Pedido p " +
       "JOIN FETCH p.cliente " +
       "JOIN FETCH p.itens i " +
       "JOIN FETCH i.produto")
List<Pedido> findAllComplete();
```

### Agregações
```java
// Count
@Query("SELECT COUNT(p) FROM Produto p WHERE p.status = :status")
long countByStatus(@Param("status") Status status);

// Sum
@Query("SELECT SUM(p.preco) FROM Produto p WHERE p.categoria = :categoria")
BigDecimal somarPrecosPorCategoria(@Param("categoria") String categoria);

// Average
@Query("SELECT AVG(p.preco) FROM Produto p")
Double calcularPrecoMedio();

// Max/Min
@Query("SELECT MAX(p.preco) FROM Produto p")
BigDecimal encontrarPrecoMaximo();

// Group By
@Query("SELECT p.categoria, COUNT(p) FROM Produto p GROUP BY p.categoria")
List<Object[]> contarPorCategoria();
```

### Subconsultas
```java
// Subquery simples
@Query("SELECT p FROM Produto p WHERE p.preco > " +
       "(SELECT AVG(p2.preco) FROM Produto p2)")
List<Produto> findProdutosAcimaDaMedia();

// Subquery com IN
@Query("SELECT c FROM Cliente c WHERE c.id IN " +
       "(SELECT p.cliente.id FROM Pedido p WHERE p.valor > :valor)")
List<Cliente> findClientesComPedidosGrandes(@Param("valor") BigDecimal valor);
```

## 🔧 SQL Nativo

```java
@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    
    // SQL nativo básico
    @Query(value = "SELECT * FROM produtos WHERE preco > :preco", nativeQuery = true)
    List<Produto> findProdutosCarosNativo(@Param("preco") BigDecimal preco);
    
    // Com resultado customizado
    @Query(value = "SELECT id, nome, preco FROM produtos WHERE categoria = :categoria", 
           nativeQuery = true)
    List<Object[]> findProdutosPorCategoriaNativo(@Param("categoria") String categoria);
    
    // Com DTO Projection
    @Query(value = "SELECT p.id, p.nome, p.preco, c.nome as categoria_nome " +
                   "FROM produtos p JOIN categorias c ON p.categoria_id = c.id",
           nativeQuery = true)
    List<ProdutoProjection> findProdutosComCategoria();
}

// Interface para projeção
public interface ProdutoProjection {
    Long getId();
    String getNome();
    BigDecimal getPreco();
    String getCategoriaNome();
}
```

## 🔄 Queries de Modificação

```java
@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    
    @Modifying
    @Query("UPDATE Produto p SET p.preco = p.preco * :fator WHERE p.categoria = :categoria")
    int atualizarPrecosPorCategoria(
        @Param("categoria") String categoria,
        @Param("fator") BigDecimal fator
    );
    
    @Modifying
    @Query("DELETE FROM Produto p WHERE p.status = :status")
    int deletarPorStatus(@Param("status") Status status);
    
    // Bulk insert (SQL nativo)
    @Modifying
    @Query(value = "INSERT INTO produtos (nome, preco, categoria) VALUES (:nome, :preco, :categoria)",
           nativeQuery = true)
    void inserirProduto(
        @Param("nome") String nome,
        @Param("preco") BigDecimal preco,
        @Param("categoria") String categoria
    );
}
```

## 📊 Projeções

### Interface Projection
```java
public interface ProdutoResumo {
    String getNome();
    BigDecimal getPreco();
}

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    List<ProdutoResumo> findByCategoria(String categoria);
}
```

### Class Projection (DTO)
```java
public class ProdutoDTO {
    private String nome;
    private BigDecimal preco;
    
    public ProdutoDTO(String nome, BigDecimal preco) {
        this.nome = nome;
        this.preco = preco;
    }
    // Getters
}

@Query("SELECT new com.projeto.dto.ProdutoDTO(p.nome, p.preco) " +
       "FROM Produto p WHERE p.categoria = :categoria")
List<ProdutoDTO> findDTOsByCategoria(@Param("categoria") String categoria);
```

## 🔍 Specifications (Criteria API)

```java
public class ProdutoSpecifications {
    
    public static Specification<Produto> nomeContem(String nome) {
        return (root, query, cb) -> 
            nome == null ? null : cb.like(cb.lower(root.get("nome")), "%" + nome.toLowerCase() + "%");
    }
    
    public static Specification<Produto> precoEntre(BigDecimal min, BigDecimal max) {
        return (root, query, cb) -> {
            if (min == null && max == null) return null;
            if (min == null) return cb.lessThanOrEqualTo(root.get("preco"), max);
            if (max == null) return cb.greaterThanOrEqualTo(root.get("preco"), min);
            return cb.between(root.get("preco"), min, max);
        };
    }
    
    public static Specification<Produto> comStatus(Status status) {
        return (root, query, cb) -> 
            status == null ? null : cb.equal(root.get("status"), status);
    }
}

// Uso
@Service
public class ProdutoService {
    
    @Autowired
    private ProdutoRepository repository;
    
    public List<Produto> buscarComFiltros(String nome, BigDecimal min, BigDecimal max, Status status) {
        Specification<Produto> spec = Specification
            .where(ProdutoSpecifications.nomeContem(nome))
            .and(ProdutoSpecifications.precoEntre(min, max))
            .and(ProdutoSpecifications.comStatus(status));
        
        return repository.findAll(spec);
    }
}
```

## 📈 Paginação e Ordenação

```java
@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    
    // Paginação com query method
    Page<Produto> findByCategoria(String categoria, Pageable pageable);
    
    // Paginação com JPQL
    @Query("SELECT p FROM Produto p WHERE p.preco > :preco")
    Page<Produto> findProdutosCaros(@Param("preco") BigDecimal preco, Pageable pageable);
}

// Uso
@Service
public class ProdutoService {
    
    public Page<Produto> listarPaginado(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("DESC") 
            ? Sort.by(sortBy).descending() 
            : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        return repository.findAll(pageable);
    }
}
```

## ⚡ Otimizações

### Evitar N+1 Problem
```java
// ❌ Problema N+1
List<Pedido> pedidos = pedidoRepository.findAll();
for (Pedido pedido : pedidos) {
    pedido.getItens().size(); // Query adicional para cada pedido
}

// ✅ Solução: Fetch Join
@Query("SELECT DISTINCT p FROM Pedido p LEFT JOIN FETCH p.itens")
List<Pedido> findAllWithItens();
```

### Batch Fetching
```java
@Entity
public class Pedido {
    @OneToMany(mappedBy = "pedido")
    @BatchSize(size = 10)
    private List<Item> itens;
}
```

### Query Hints
```java
@QueryHints({
    @QueryHint(name = "org.hibernate.cacheable", value = "true"),
    @QueryHint(name = "org.hibernate.fetchSize", value = "50")
})
@Query("SELECT p FROM Produto p WHERE p.categoria = :categoria")
List<Produto> findByCategoria(@Param("categoria") String categoria);
```

## 🎓 Boas Práticas

1. **Usar JPQL** quando possível (portabilidade)
2. **Fetch Joins** para evitar N+1
3. **Projeções** para queries somente leitura
4. **Paginação** para grandes volumes
5. **Índices** em colunas frequentemente consultadas
6. **Batch Size** para otimizar lazy loading
7. **@Transactional(readOnly = true)** para queries de leitura
8. **Evitar SELECT \*** - selecione apenas campos necessários
