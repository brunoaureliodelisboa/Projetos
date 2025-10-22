# Relatório de Sucesso do Desafio: Contador de Parâmetros com Exceção 🏆

Este documento descreve o funcionamento e destaca os pontos fortes do código Java implementado para o desafio de Controle de Fluxo. O código não apenas atende aos requisitos de negócio, mas também adiciona uma camada de **robustez** ao tratamento de entrada do usuário.

---

## 1. Visão Geral e Sucesso da Implementação

Seu código implementa com sucesso o cenário proposto, focado em **Controle de Fluxo** e **Tratamento de Exceções**.

### Principais Conquistas:

* **Validação de Negócio Correta:** O método `Contar` lança a exceção personalizada (`ParametrosInvalidosException`) **exatamente** quando o primeiro parâmetro é maior que o segundo, cumprindo o requisito principal do desafio.
* **Controle de Entrada Robusto:** O uso de um *loop* **`while`** com um bloco **`try-catch`** no método `main` é uma **excelente prática**. Ele garante que o programa não falhará e **forçará** o usuário a digitar os parâmetros corretamente até que a regra de negócio seja satisfeita.
* **Criação de Exceção Customizada:** Você criou corretamente a classe `ParametrosInvalidosException`, que herda de `Exception`, tornando-a uma **Checked Exception** (exceção verificada) e obrigando o tratamento explícito no método `main`.

---

## 2. Detalhamento do Funcionamento do Código

O projeto está dividido em duas classes: `Contador` (lógica principal) e `ParametrosInvalidosException` (exceção de negócio).

### 2.1. Classe `Contador.java`

Esta é a classe principal que gerencia a interação e o fluxo do programa.

#### Bloco `main(String[] args)`:

* **Entrada em Loop:** O *loop* `while (!parametrosValidos)` garante a repetição da solicitação de entrada. O *flag* `parametrosValidos` só se torna `true` se o bloco `try` for executado sem lançar uma exceção.
* **Captura de Erro:** Dentro do `try`, após a leitura dos dois inteiros via `Scanner`, o programa tenta chamar o método `Contar`.
* **Tratamento de Exceção:** Se a exceção `ParametrosInvalidosException` for lançada (ou seja, se o primeiro parâmetro for maior que o segundo), o bloco `catch` exibe a mensagem de erro do desafio (`"O segundo parâmetro deve ser maior que o primeiro"`) e o *loop* se reinicia automaticamente, solicitando novos valores.
* **Execução da Contagem:** Após a validação bem-sucedida, o *loop* `for` final utiliza o valor de `quantidade` (calculado por $P2 - P1$) para imprimir sequencialmente os números, de 1 até o valor da diferença.

#### Método `Contar(int parametroUm, int parametroDois)`:

Este método contém a lógica de validação:

* **Validação:** Verifica se `parametroUm > parametroDois`.
* **Lançamento da Exceção:** Se a condição for verdadeira, a exceção `ParametrosInvalidosException` é **lançada**, interrompendo o fluxo do `try` no método `main`.
* **Cálculo:** Se a exceção **não for lançada**, o fluxo continua, calcula a diferença (`parametroDois - parametroUm`) e retorna o resultado para a variável `quantidade`.

### 2.2. Classe `ParametrosInvalidosException.java`

Esta classe é fundamental para o design orientado a objetos da solução:

* Ela estende a classe base `Exception`, o que a define como uma exceção específica da sua aplicação.
* O construtor que aceita uma `String` (`super(message)`) é o padrão para passar a mensagem de erro que será exibida ao usuário.

| Funcionalidade | Conceito Java Aplicado |
| :--- | :--- |
| **Forçar Repetição da Entrada** | `while` e `try-catch` |
| **Validação de Regra de Negócio** | `if` e `throw` |
| **Exceção de Negócio Específica** | Herança de `Exception` |
| **Contagem** | Estrutura de Repetição `for` |
| **Leitura de Dados** | Classe `Scanner` |