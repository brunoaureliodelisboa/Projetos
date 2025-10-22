# Estruturas de Repetição

Exemplos avançados de loops e iterações em Java.

## 🔁 For Loop

### For Tradicional
```java
// Iteração básica
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}

// For com múltiplas variáveis
for (int i = 0, j = 10; i < j; i++, j--) {
    System.out.println("i: " + i + ", j: " + j);
}

// For com step customizado
for (int i = 0; i < 100; i += 5) {
    System.out.println(i);
}
```

### Enhanced For (For-Each)
```java
List<String> nomes = Arrays.asList("Ana", "Bruno", "Carlos");

// Iteração simples
for (String nome : nomes) {
    System.out.println(nome);
}

// Com array
int[] numeros = {1, 2, 3, 4, 5};
for (int numero : numeros) {
    System.out.println(numero);
}
```

## 🔄 While Loop

### While
```java
int contador = 0;
while (contador < 10) {
    System.out.println(contador);
    contador++;
}

// Leitura até condição
Scanner scanner = new Scanner(System.in);
String input = "";
while (!input.equals("sair")) {
    System.out.print("Digite algo (ou 'sair'): ");
    input = scanner.nextLine();
    System.out.println("Você digitou: " + input);
}
```

### Do-While
```java
int numero;
do {
    numero = scanner.nextInt();
    System.out.println("Número: " + numero);
} while (numero != 0);
```

## 🎯 Controle de Fluxo

### Break
```java
// Sair do loop
for (int i = 0; i < 100; i++) {
    if (i == 50) {
        break; // Para na 50ª iteração
    }
    System.out.println(i);
}

// Break com label
outerLoop:
for (int i = 0; i < 5; i++) {
    for (int j = 0; j < 5; j++) {
        if (i * j > 6) {
            break outerLoop; // Sai dos dois loops
        }
        System.out.println(i + " * " + j + " = " + (i * j));
    }
}
```

### Continue
```java
// Pular iteração
for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) {
        continue; // Pula números pares
    }
    System.out.println(i);
}
```

## 🌊 Streams (Alternativa Moderna)

```java
// Filtrar e processar
List<Integer> numeros = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// Filtrar pares e multiplicar por 2
List<Integer> resultado = numeros.stream()
    .filter(n -> n % 2 == 0)
    .map(n -> n * 2)
    .collect(Collectors.toList());

// Somar valores
int soma = numeros.stream()
    .filter(n -> n > 5)
    .mapToInt(Integer::intValue)
    .sum();
```

## ⚡ Otimizações

### Evitar Cálculos Repetidos
```java
// ❌ Ruim
for (int i = 0; i < lista.size(); i++) {
    // lista.size() calculado a cada iteração
}

// ✅ Bom
int tamanho = lista.size();
for (int i = 0; i < tamanho; i++) {
    // Cálculo feito uma vez
}
```

### Iterator para Remoção Segura
```java
List<String> lista = new ArrayList<>(Arrays.asList("A", "B", "C", "D"));

// ❌ ConcurrentModificationException
for (String item : lista) {
    if (item.equals("B")) {
        lista.remove(item);
    }
}

// ✅ Correto
Iterator<String> iterator = lista.iterator();
while (iterator.hasNext()) {
    String item = iterator.next();
    if (item.equals("B")) {
        iterator.remove();
    }
}
```

## 📚 Casos de Uso

- Processamento de coleções
- Leitura de entrada do usuário
- Implementação de algoritmos
- Busca e filtragem
- Agregação de dados
