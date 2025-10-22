# 🕹️ Desafio: Escrevendo as Classes de Um Jogo

## 🎯 Sobre o Projeto

Este projeto foi desenvolvido por mim como parte do desafio **“Escrevendo as Classes de Um Jogo”** da plataforma **DIO (Digital Innovation One)**.  
O objetivo foi colocar em prática os conceitos de **Programação Orientada a Objetos em JavaScript**, criando uma classe que representa heróis de diferentes tipos, cada um com seu próprio estilo de ataque.

---

## 🧙‍♂️ O Que Eu Fiz

Implementei uma classe chamada `tiposdeHeroi`, contendo as propriedades:

- `nome`  
- `idade`  
- `tipo` (ex: guerreiro, mago, monge, ninja)

E um método chamado `atacar()`, que exibe uma mensagem personalizada de acordo com o tipo de herói e o ataque utilizado.

---

## ⚔️ Regras de Ataque

| Tipo de Herói | Ataque Utilizado        |
|----------------|--------------------------|
| mago           | usou magia              |
| guerreiro      | usou espada             |
| monge          | usou artes marciais     |
| ninja          | usou shuriken           |

---

## 💻 Código que Desenvolvi

```javascript
class tiposdeHeroi {
  constructor(nome, idade, tipo) {
    this.nome = nome
    this.idade = idade
    this.tipo = tipo
  }

  atacar(ataque) {
    this.ataque = ataque
    console.log(`O ${this.tipo} atacou ${this.ataque}.`)
  }
}

let heroi = new tiposdeHeroi("Bruno", "30", "Guerreiro")
heroi.atacar("usando espada")
