# Meu Resumo de Aprendizado - Desafio Classificador de Nível de Herói

## Escopo Inicial
O desafio pedia que eu:

- Criasse variáveis para armazenar:
  - Nome do herói
  - Nível de XP
- Usasse **estruturas de decisão** (`if`) para definir medalhas com base no XP
- Exibisse a mensagem final:
  
  `"O Herói de nome {nome} está no nível de {nivel}"`

## O Que Eu Aprendi a Mais

Além do que o desafio propunha, eu explorei:

### 1. Funções
- Criei funções para organizar meu código:
  - `calcularMedalhaIF(nivelXp)`
  - `calcularMedalhaWhile(nivelXp)`
  - `calcularMedalhaFor(nivelXp)`
  - `mostrarMedalha(nomeHeroi, nivelXp, medalha)`
- Aprendi a **retornar valores de funções** e a **reutilizá-las**, evitando repetir código.

### 2. Diferentes Estruturas de Laços
- Testei **while** e **for** para controlar a lógica de decisão, mesmo que o `if` fosse suficiente.
- Entendi a **diferença de sintaxe e comportamento** entre `if`, `while` e `for`.

### 3. Entrada de Dados do Usuário
- Usei `process.stdin.once("data", ...)` para capturar informações do usuário.
- Consegui **converter dados de string para número** usando `parseInt`.
- Implementei **validação simples** para garantir que só usasse os valores quando estavam definidos.

### 4. Promises e Async/Await
- Criei a função `opcoes` que retorna uma **Promise** para lidar com a entrada do usuário de forma assíncrona.
- Usei **async/await** para esperar a escolha do usuário antes de continuar.
- Isso me deu noções iniciais de **programação assíncrona** em Node.js.

### 5. Modularização do Código
- Separei responsabilidades:
  - Cálculo da medalha
  - Exibição de mensagem
  - Entrada de dados e opções
- Isso me mostrou como organizar o código de forma mais profissional e facilitar futuras manutenções.

### 6. Boas Práticas que Adotei
- Usei `console.log` para exibir mensagens informativas.
- Declarei variáveis no início para melhor legibilidade.
- Controlei o fluxo do programa com `process.stdin.pause()`.

## Observações
- Mesmo sem alterar a lógica principal, experimentei **múltiplos estilos de laço** e **programação assíncrona**, ampliando muito o que o desafio inicialmente pedia.
- Esse aprendizado é essencial para **Node.js**, projetos interativos e **preparação para projetos maiores no GitHub**.

---

**Resumo rápido:**  
Eu saí de apenas usar variáveis, operadores e `if` para aprender **funções, laços, entrada de dados, async/await, Promises e modularização de código**, consolidando fundamentos importantes para projetos reais em JavaScript/Node.js.
