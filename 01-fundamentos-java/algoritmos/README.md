# Algoritmos

Exemplos de algoritmos fundamentais e estruturas de dados em Java.

## 📂 Estrutura

- **Ordenação**: Implementações de algoritmos de ordenação
- **Busca**: Algoritmos de busca em coleções
- **Estruturas**: Implementações de estruturas de dados
- **Recursão**: Exemplos de algoritmos recursivos

## 🎯 Conceitos Principais

- Análise de complexidade (Big O)
- Trade-offs entre tempo e espaço
- Escolha do algoritmo adequado
- Otimização de performance

## 💡 Exemplos Práticos

```java
// Exemplo: Busca Binária
public class BinarySearch {
    public static int binarySearch(int[] array, int target) {
        int left = 0;
        int right = array.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (array[mid] == target) {
                return mid;
            }
            
            if (array[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return -1; // Não encontrado
    }
}
```

## 📚 Recursos de Estudo

- Complexidade de tempo e espaço
- Análise assintótica
- Casos médio, melhor e pior
- Algoritmos in-place vs com memória auxiliar
