# Exceções - Nível Básico

Fundamentos do tratamento de exceções em Java.

## 🎯 Conceitos Básicos

### Try-Catch Simples
```java
public class CalculadoraBasica {
    public int dividir(int a, int b) {
        try {
            return a / b;
        } catch (ArithmeticException e) {
            System.err.println("Erro: Divisão por zero!");
            return 0;
        }
    }
}
```

### Múltiplos Catches
```java
public void processarArquivo(String caminho) {
    try {
        FileReader file = new FileReader(caminho);
        BufferedReader reader = new BufferedReader(file);
        String linha = reader.readLine();
        int numero = Integer.parseInt(linha);
        
    } catch (FileNotFoundException e) {
        System.err.println("Arquivo não encontrado: " + caminho);
    } catch (IOException e) {
        System.err.println("Erro ao ler arquivo: " + e.getMessage());
    } catch (NumberFormatException e) {
        System.err.println("Formato de número inválido");
    }
}
```

### Multi-Catch (Java 7+)
```java
public void processar() {
    try {
        // código que pode lançar exceções
    } catch (IOException | SQLException e) {
        System.err.println("Erro: " + e.getMessage());
        e.printStackTrace();
    }
}
```

## 🔄 Finally

```java
public void acessarRecurso() {
    Connection conn = null;
    try {
        conn = obterConexao();
        // usar conexão
    } catch (SQLException e) {
        System.err.println("Erro SQL: " + e.getMessage());
    } finally {
        // Sempre executado
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException e) {
                System.err.println("Erro ao fechar conexão");
            }
        }
    }
}
```

## 📦 Try-with-Resources

```java
// Múltiplos recursos
public void copiarArquivo(String origem, String destino) {
    try (
        FileInputStream in = new FileInputStream(origem);
        FileOutputStream out = new FileOutputStream(destino)
    ) {
        byte[] buffer = new byte[1024];
        int bytesRead;
        while ((bytesRead = in.read(buffer)) != -1) {
            out.write(buffer, 0, bytesRead);
        }
    } catch (IOException e) {
        System.err.println("Erro ao copiar arquivo: " + e.getMessage());
    }
}
```

## 🚀 Lançando Exceções

```java
public void validarIdade(int idade) {
    if (idade < 0) {
        throw new IllegalArgumentException("Idade não pode ser negativa");
    }
    if (idade > 150) {
        throw new IllegalArgumentException("Idade inválida");
    }
}

public void processarPedido(Pedido pedido) throws PedidoInvalidoException {
    if (pedido == null) {
        throw new PedidoInvalidoException("Pedido não pode ser nulo");
    }
    // processar...
}
```

## 📊 Exemplos Práticos

### Validação de Entrada
```java
public class ValidadorEmail {
    public void validar(String email) {
        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("Email não pode ser vazio");
        }
        
        if (!email.contains("@")) {
            throw new IllegalArgumentException("Email inválido");
        }
    }
}
```

### Conversão Segura
```java
public class ConversorSeguro {
    public Integer converterParaInteiro(String texto) {
        try {
            return Integer.parseInt(texto);
        } catch (NumberFormatException e) {
            System.err.println("Não foi possível converter: " + texto);
            return null;
        }
    }
    
    public Integer converterComValorPadrao(String texto, int padrao) {
        try {
            return Integer.parseInt(texto);
        } catch (NumberFormatException e) {
            return padrao;
        }
    }
}
```

### Acesso a Array Seguro
```java
public class ArraySeguro {
    public Integer obterElemento(int[] array, int indice) {
        try {
            return array[indice];
        } catch (ArrayIndexOutOfBoundsException e) {
            System.err.println("Índice fora dos limites: " + indice);
            return null;
        }
    }
}
```

## 📚 Exceções Comuns

- **NullPointerException**: Acesso a objeto null
- **ArrayIndexOutOfBoundsException**: Índice inválido
- **NumberFormatException**: Conversão de string para número falhou
- **IllegalArgumentException**: Argumento inválido
- **IOException**: Erro de entrada/saída
- **SQLException**: Erro de banco de dados
