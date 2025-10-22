
//Variaveis Inicio
let nomeHeroi;
let nivelXp; 
let medalha = "sem medalha"
let opcao = 0;
//Variaveis Fim

// Funções Inicio
function calcularMedalhaIF(nivelXp) {
  if (nivelXp >= 1 && nivelXp <= 1000) return "Ferro";
  if (nivelXp >= 1001 && nivelXp <= 2000) return "Bronze";
  if (nivelXp >= 2001 && nivelXp <= 5000) return "Prata";
  if (nivelXp >= 5001 && nivelXp <= 7000) return "Ouro";
  if (nivelXp >= 7001 && nivelXp <= 8000) return "Platina";
  if (nivelXp >= 8001 && nivelXp <= 9000) return "Ascendente";
  if (nivelXp >= 9001 && nivelXp <= 10000) return "Imortal";
  if (nivelXp >= 10001 && nivelXp <= 99000) return "Radiante";
  return "Sem medalha";
}
function calcularMedalhaWhile(nivelXp) {
  while (nivelXp >= 1 && nivelXp <= 1000) return "Ferro";
  while (nivelXp >= 1001 && nivelXp <= 2000) return "Bronze";
  while (nivelXp >= 2001 && nivelXp <= 5000) return "Prata";
  while (nivelXp >= 5001 && nivelXp <= 7000) return "Ouro";
  while (nivelXp >= 7001 && nivelXp <= 8000) return "Platina";
  while (nivelXp >= 8001 && nivelXp <= 9000) return "Ascendente";
  while (nivelXp >= 9001 && nivelXp <= 10000) return "Imortal";
  while (nivelXp >= 10001 && nivelXp <= 99000) return "Radiante";
  return "Sem medalha";
}
function calcularMedalhaFor(nivelXp) {
  for (; nivelXp >= 1 && nivelXp <= 1000; ) return "Ferro";
  for (; nivelXp >= 1001 && nivelXp <= 2000; ) return "Bronze";
  for (; nivelXp >= 2001 && nivelXp <= 5000; ) return "Prata";
  for (; nivelXp >= 5001 && nivelXp <= 7000; ) return "Ouro";
  for (;nivelXp >= 7001 && nivelXp <= 8000; ) return "Platina";
  for (;nivelXp >= 8001 && nivelXp <= 9000; ) return "Ascendente";
  for (;nivelXp >= 9001 && nivelXp <= 10000; ) return "Imortal";
  for (;nivelXp >= 10001 && nivelXp <= 99000; ) return "Radiante";
  for (;!nivelXp; ) return "Sem medalha";
}
function mostrarMedalha(nomeHeroi, nivelXp, medalha) {
  console.log(`O Herói de nome: ${nomeHeroi}, está no nível: ${nivelXp} e a sua medalha é: ${medalha}`);
}
// Funções Fim

console.log("            Sejam Bem-vindos ao Desafio Nivel do Heroi \n Nesse desafio vou configurar uma mensagem para mostrar na tela \n qual é a medalha correspondente a cada nivel do Herói.");
console.log(" ");

if ((!nomeHeroi && !nivelXp)) {
  process.stdout.write(` Digite o nome do Herói: `);
  process.stdin.once("data", (data) => {
  nomeHeroi = data.toString().trim();
      
  process.stdout.write("Digite o Nivel do Heroi: ");
  process.stdin.once("data", (data) => {
  nivelXp = parseInt(data.toString());
 
  console.log(` Olá, ${nomeHeroi}!`);
  console.log(` Nome Digitando ${nomeHeroi}`);
  console.log(` Nivel de XP do Heroi ${nivelXp}`);

  process.stdin.pause(); // pausa, mas o código continua
 

  if(nomeHeroi && nivelXp){
    const readline = require("readline"); // Aqui nós estamos importando o módulo chamado readline, que já vem instalado junto com o Node.js. Esse módulo permite que o programa faça perguntas e receba respostas digitadas pelo usuário no terminal.
    function opcoes(escolhaOPCAO) { // Criamos uma função chamada escolhaOPCAO. Ela recebe um texto (a escolhaOPCAO que queremos mostrar para o usuário).
      const rl1 = readline.createInterface({ // Aqui criamos um objeto chamado rl que representa a interface de comunicação com o terminal. input: process.stdin significa que o programa vai ler o que o usuário digita no teclado. output: process.stdout significa que o programa vai escrever mensagens na tela.
        input: process.stdin,
        output: process.stdout
      });

      return new Promise((resolve) => { // Essa linha indica que a função vai devolver uma promessa. A promessa serve para dizer: "Espere até o usuário responder e só então continue o código".
        rl1.question(escolhaOPCAO, (opcaoEscolhida) => { // Aqui o programa realmente faz a escolhaOPCAO para o usuário. Quando o usuário digita a resposta e aperta Enter, o valor digitado aparece no parâmetro chamado resposta. 
          rl1.close(); // Essa linha fecha a comunicação com o terminal, porque já recebemos a resposta.
          resolve(opcaoEscolhida); // Essa linha devolve a resposta para quem chamou a função escolhaOPCAO.
        });
      });
    }

    (async () => { 
      opcao = parseFloat(await opcoes(" Qual opção você deseja executar? \n\n Primeira Opção 1ª: Executa todo o laço Através do IF \n Segunda  Opção 2ª: Através do laço While \n Terceira Opção 3ª: Através do For \n Digite aqui: "));
          

        if(opcao === 1){
          if(nomeHeroi && nivelXp){
          const medalha = calcularMedalhaIF(nivelXp);
          mostrarMedalha(nomeHeroi, nivelXp, medalha);
          }else{
            console.log("Ranking sem medalha provisório")}           
        }else if(opcao === 2){
          while (nomeHeroi && nivelXp) {
            const medalha = calcularMedalhaWhile(nivelXp);
            mostrarMedalha(nomeHeroi, nivelXp, medalha);
            break;
          }          
        }else if(opcao === 3){
          for (; nomeHeroi && nivelXp;) {
            const medalha = calcularMedalhaFor(nivelXp);
            mostrarMedalha(nomeHeroi, nivelXp, medalha);
            break;
          }

        }else{
          console.log(" Opção inválida, por favor escolha uma opção entre 1, 2 ou 3.");
        }
    })(); // 👈 função assíncrona chamada imediatamente
}
});
});}
