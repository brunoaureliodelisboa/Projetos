# Design Patterns (Padrões de Projeto)

Implementações dos principais padrões de projeto em Java.

## 🏗️ Padrões Criacionais

### Singleton
Garante uma única instância de uma classe.

```java
public class DatabaseConnection {
    private static DatabaseConnection instance;
    
    private DatabaseConnection() {}
    
    public static synchronized DatabaseConnection getInstance() {
        if (instance == null) {
            instance = new DatabaseConnection();
        }
        return instance;
    }
}
```

### Factory Method
Cria objetos sem especificar a classe exata.

```java
public interface Produto {
    void criar();
}

public class ProdutoFactory {
    public static Produto criarProduto(String tipo) {
        if (tipo.equals("A")) {
            return new ProdutoA();
        } else if (tipo.equals("B")) {
            return new ProdutoB();
        }
        throw new IllegalArgumentException("Tipo inválido");
    }
}
```

### Builder
Constrói objetos complexos passo a passo.

```java
public class Usuario {
    private String nome;
    private String email;
    private int idade;
    
    private Usuario(Builder builder) {
        this.nome = builder.nome;
        this.email = builder.email;
        this.idade = builder.idade;
    }
    
    public static class Builder {
        private String nome;
        private String email;
        private int idade;
        
        public Builder comNome(String nome) {
            this.nome = nome;
            return this;
        }
        
        public Builder comEmail(String email) {
            this.email = email;
            return this;
        }
        
        public Builder comIdade(int idade) {
            this.idade = idade;
            return this;
        }
        
        public Usuario build() {
            return new Usuario(this);
        }
    }
}
```

## 🔧 Padrões Estruturais

### Adapter
Adapta interfaces incompatíveis.

### Decorator
Adiciona funcionalidades dinamicamente.

### Facade
Simplifica interface complexa.

## 🎭 Padrões Comportamentais

### Strategy
Define família de algoritmos intercambiáveis.

```java
public interface EstrategiaDesconto {
    double aplicarDesconto(double valor);
}

public class DescontoNatal implements EstrategiaDesconto {
    public double aplicarDesconto(double valor) {
        return valor * 0.9; // 10% de desconto
    }
}
```

### Observer
Notifica mudanças a observadores.

### Template Method
Define esqueleto de algoritmo.

## 📚 Quando Usar

- Singleton: Recursos compartilhados (conexões, configurações)
- Factory: Criação de objetos baseada em lógica
- Builder: Objetos com muitos parâmetros opcionais
- Strategy: Múltiplas formas de realizar mesma tarefa
- Observer: Sistema de eventos e notificações
