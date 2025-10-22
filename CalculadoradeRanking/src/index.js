// Variáveis Início
let usuarioLogin;
let vitorias; 
let derrotas;
let medalha = "sem medalha";
let opcao = 0;
// Variáveis Fim

// Funções Início
function calcularVitorias(vitorias, derrotas) {
    if (vitorias - derrotas === 10) return "Ferro";
    if (vitorias - derrotas >= 11 && vitorias - derrotas <= 20) return "Bronze";
    if (vitorias - derrotas >= 21 && vitorias - derrotas <= 50) return "Prata";
    if (vitorias - derrotas >= 51 && vitorias - derrotas <= 80) return "Ouro";
    if (vitorias - derrotas >= 81 && vitorias - derrotas <= 90) return "Diamante";
    if (vitorias - derrotas >= 91 && vitorias - derrotas <= 100) return "Lendário";
    if (vitorias - derrotas >= 101) return "Imortal";
}

function mostrarRanking(usuarioLogin, ranking, medalha) {
    console.log(`O char do usuario: ${usuarioLogin}, está no ranking: ${ranking}`);
}
// Funções Fim

console.log("Sejam Bem-vindos à Calculadora de Ranking\nNesse desafio vou mostrar na tela o ranking correspondente ao cálculo vitórias - derrotas.\n");

if (!usuarioLogin || !vitorias || !derrotas) {
    process.stdout.write(`Digite Login do Usuário: `);

    process.stdin.once("data", (data) => {
        usuarioLogin = data.toString().trim();

        process.stdout.write("Digite a Quantidade de Vitorias: ");
        process.stdin.once("data", (data) => {
            vitorias = parseInt(data.toString());

            process.stdout.write("Digite a Quantidade de Derrotas: ");
            process.stdin.once("data", (data) => {
                derrotas = parseInt(data.toString());

                console.log(` `);
                console.log(`Login Digitado: ${usuarioLogin}`);
                console.log(`Quantidade de Vitórias: ${vitorias}`);
                console.log(`Quantidade de Derrotas: ${derrotas} \n`);
                process.stdin.pause();

                if (usuarioLogin && vitorias && derrotas) {
                    const readline = require("readline");

                    function opcoes(escolhaOPCAO) {
                        const rl1 = readline.createInterface({
                            input: process.stdin,
                            output: process.stdout
                        });

                        return new Promise((resolve) => {
                            rl1.question(escolhaOPCAO, (opcaoEscolhida) => {
                                rl1.close();
                                resolve(opcaoEscolhida);
                            });
                        });
                   }

                    (async () => {
                        opcao = parseInt(await opcoes(
                            "Qual opção você deseja executar?\n1: Para Calcular a Medalha\nDigite aqui: "
                        ));

                        if (opcao === 1) {
                            const ranking = calcularVitorias(vitorias, derrotas);
                            mostrarRanking(usuarioLogin, ranking);
                        } else {
                            console.log("Opção inválida.");
                        }
                    })(); // função assíncrona
                }
            }); // fecha derrotas
        }); // fecha vitórias
    }); // fecha login
}
