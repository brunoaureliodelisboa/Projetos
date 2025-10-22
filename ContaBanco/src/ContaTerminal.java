import java.util.Locale;
import java.util.Scanner;

/**
 * <h2>Projeto Simulador de Conta Bancária</h2>
 * Este projeto simula a criação de uma conta bancária através de interação
 * com o usuário via terminal, coletando dados como número da conta, agência,
 * nome do cliente e saldo inicial.
 * <p>
 * <b>Note:</b> Leia atentamente a documentação desta classe
 * para desfrutar dos recursos oferecidos pelo autor
 *
 * @author  Bruno Lisboa
 * @version 1.0
 * @since   17/10/2025
 */

public class ContaTerminal {
    /**
     * Este método é responsável por coletar os dados da conta bancária
     * através da interação com o usuário via terminal.
     * @param args argumentos da linha de comando (não utilizados)
     * Os dados coletados incluem: número da conta, agência, nome do usuário e saldo inicial.
     */
    public static void main(String[] args) {
        //os argumentos começam com indice 0
        Scanner scanner = new Scanner(System.in).useLocale(Locale.US);

        System.out.print("Por favor digite o número da conta: ");
        int numeroConta = scanner.nextInt();

        System.out.print("Por favor digite o número da agência: ");
        String agencia = scanner.next();

        System.out.print("Digite seu nome: ");
        String nomeUsuario = scanner.next();

        System.out.print("Digite seu saldo: ");
        double saldo = scanner.nextDouble();
        
        System.out.println("Olá " + nomeUsuario + ", obrigado por criar uma conta em nosso banco, sua agência é " + agencia + ", conta " + numeroConta + " e seu saldo " + saldo + " já está disponível para saque.");
    }
}
