# Estruturas Condicionais

Exemplos avançados de estruturas condicionais em Java.

## 🔀 If/Else

### Básico
```java
public String avaliarNota(int nota) {
    if (nota >= 90) {
        return "Excelente";
    } else if (nota >= 70) {
        return "Bom";
    } else if (nota >= 50) {
        return "Regular";
    } else {
        return "Insuficiente";
    }
}
```

### Com Guard Clauses
```java
public void processarPedido(Pedido pedido) {
    if (pedido == null) {
        throw new IllegalArgumentException("Pedido não pode ser nulo");
    }
    
    if (!pedido.isValido()) {
        throw new IllegalStateException("Pedido inválido");
    }
    
    if (pedido.getValor() <= 0) {
        throw new IllegalArgumentException("Valor deve ser positivo");
    }
    
    // Lógica principal
    processar(pedido);
}
```

## 🔄 Switch

### Switch Tradicional
```java
public String getDiaSemana(int dia) {
    switch (dia) {
        case 1:
            return "Domingo";
        case 2:
            return "Segunda-feira";
        case 3:
            return "Terça-feira";
        case 4:
            return "Quarta-feira";
        case 5:
            return "Quinta-feira";
        case 6:
            return "Sexta-feira";
        case 7:
            return "Sábado";
        default:
            throw new IllegalArgumentException("Dia inválido");
    }
}
```

### Switch Expression (Java 14+)
```java
public String getDiaSemana(int dia) {
    return switch (dia) {
        case 1 -> "Domingo";
        case 2 -> "Segunda-feira";
        case 3 -> "Terça-feira";
        case 4 -> "Quarta-feira";
        case 5 -> "Quinta-feira";
        case 6 -> "Sexta-feira";
        case 7 -> "Sábado";
        default -> throw new IllegalArgumentException("Dia inválido");
    };
}
```

### Switch com Múltiplos Cases
```java
public String getTipoDia(int dia) {
    return switch (dia) {
        case 1, 7 -> "Fim de semana";
        case 2, 3, 4, 5, 6 -> "Dia útil";
        default -> throw new IllegalArgumentException("Dia inválido");
    };
}
```

## ❓ Operador Ternário

```java
// Simples
String status = idade >= 18 ? "Maior" : "Menor";

// Aninhado (evitar se possível)
String categoria = idade < 13 ? "Criança" 
                 : idade < 18 ? "Adolescente" 
                 : idade < 60 ? "Adulto" 
                 : "Idoso";
```

## 🎯 Pattern Matching (Java 17+)

```java
public String descreverObjeto(Object obj) {
    if (obj instanceof String s) {
        return "String com " + s.length() + " caracteres";
    } else if (obj instanceof Integer i) {
        return "Número: " + i;
    } else if (obj instanceof List<?> list) {
        return "Lista com " + list.size() + " elementos";
    } else {
        return "Tipo desconhecido";
    }
}
```

## 📚 Casos de Uso

- Validação de entrada
- Fluxo de negócio condicional
- Classificação e categorização
- Tratamento de diferentes estados
- Seleção de estratégias
