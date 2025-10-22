class tiposdeHeroi{
  constructor(nome, idade, tipo){
    this.nome = nome
    this.idade = idade
	  this.tipo = tipo
  } 
  atacar(ataque){
    this.ataque = ataque
    console.log(`O ${this.tipo} atacou ${this.ataque}.`)      
  }
}
let heroi = new tiposdeHeroi("Bruno", "30", "Guerreiro")
heroi.atacar("usando espada")
