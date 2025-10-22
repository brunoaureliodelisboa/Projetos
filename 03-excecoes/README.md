# Tratamento de Exceções

Implementação de try-catch para criar código robusto e resiliente.

## 🎯 Objetivos

- Tratar erros de forma apropriada
- Criar exceções customizadas
- Implementar error handling robusto
- Garantir limpeza de recursos
- Registrar e rastrear erros

## 📚 Tipos de Exceções

### Checked Exceptions
Exceções verificadas em tempo de compilação.
- IOException
- SQLException
- ClassNotFoundException

### Unchecked Exceptions
Exceções de runtime (não obrigatórias de tratar).
- NullPointerException
- IllegalArgumentException
- ArrayIndexOutOfBoundsException

### Errors
Problemas sérios que não devem ser tratados.
- OutOfMemoryError
- StackOverflowError

## 💡 Estruturas Básicas

### Try-Catch
```java
try {
    // Código que pode lançar exceção
    int resultado = dividir(10, 0);
} catch (ArithmeticException e) {
    // Tratamento específico
    System.err.println("Erro: " + e.getMessage());
}
```

### Try-Catch-Finally
```java
try {
    // Código que pode falhar
    conectar();
} catch (Exception e) {
    // Tratamento
    System.err.println("Erro ao conectar");
} finally {
    // Sempre executado
    desconectar();
}
```

### Try-with-Resources
```java
try (BufferedReader br = new BufferedReader(new FileReader("file.txt"))) {
    String linha = br.readLine();
    // Arquivo fechado automaticamente
} catch (IOException e) {
    e.printStackTrace();
}
```

## 🏗️ Exceções Customizadas

```java
public class SaldoInsuficienteException extends Exception {
    private double saldoAtual;
    private double valorSolicitado;
    
    public SaldoInsuficienteException(double saldoAtual, double valorSolicitado) {
        super("Saldo insuficiente. Saldo: " + saldoAtual + ", Solicitado: " + valorSolicitado);
        this.saldoAtual = saldoAtual;
        this.valorSolicitado = valorSolicitado;
    }
    
    public double getSaldoAtual() {
        return saldoAtual;
    }
    
    public double getValorSolicitado() {
        return valorSolicitado;
    }
}
```

## 📋 Boas Práticas

1. **Ser específico**: Capturar exceções específicas antes das genéricas
2. **Não silenciar**: Sempre registrar ou tratar exceções
3. **Documentar**: Usar @throws no Javadoc
4. **Limpar recursos**: Usar try-with-resources ou finally
5. **Mensagens claras**: Fornecer contexto no getMessage()
6. **Não usar para controle de fluxo**: Exceções têm custo de performance

## 🎓 Níveis

- **Básico**: Try-catch simples, exceções padrão
- **Avançado**: Exceções customizadas, hierarquias, estratégias de retry
