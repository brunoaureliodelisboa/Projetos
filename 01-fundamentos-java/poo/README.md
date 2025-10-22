# Programação Orientada a Objetos

Exemplos práticos dos pilares da POO em Java.

## 🏛️ Pilares da POO

### 1. Encapsulamento
Proteção e controle de acesso aos dados.

```java
public class ContaBancaria {
    private double saldo;
    
    public double getSaldo() {
        return saldo;
    }
    
    public void depositar(double valor) {
        if (valor > 0) {
            this.saldo += valor;
        }
    }
}
```

### 2. Herança
Reutilização de código através de hierarquia.

```java
public class Animal {
    protected String nome;
    
    public void emitirSom() {
        System.out.println("Som genérico");
    }
}

public class Cachorro extends Animal {
    @Override
    public void emitirSom() {
        System.out.println("Au au!");
    }
}
```

### 3. Polimorfismo
Mesma interface, comportamentos diferentes.

```java
public interface Pagamento {
    void processar(double valor);
}

public class PagamentoCartao implements Pagamento {
    public void processar(double valor) {
        // Lógica específica para cartão
    }
}

public class PagamentoBoleto implements Pagamento {
    public void processar(double valor) {
        // Lógica específica para boleto
    }
}
```

### 4. Abstração
Simplificação de complexidade.

```java
public abstract class FormaGeometrica {
    protected String cor;
    
    public abstract double calcularArea();
    public abstract double calcularPerimetro();
}
```

## 🎯 Princípios SOLID

- **S**ingle Responsibility Principle
- **O**pen/Closed Principle
- **L**iskov Substitution Principle
- **I**nterface Segregation Principle
- **D**ependency Inversion Principle

## 📖 Boas Práticas

- Favorecer composição sobre herança
- Programar para interfaces, não implementações
- Minimizar acoplamento
- Maximizar coesão
- Seguir convenções de nomenclatura
