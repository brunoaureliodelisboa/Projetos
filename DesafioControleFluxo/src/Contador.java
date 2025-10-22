import java.util.Scanner;
import java.util.Locale;

public class Contador {
    public static void main(String[] args) throws Exception {
        int parametroUm = 0;
        int parametroDois = 0;
        int quantidade = 0;

        boolean parametrosValidos = false;

        Scanner scanner = new Scanner(System.in).useLocale(Locale.US);
        while (!parametrosValidos) {
            try {
                System.out.println("Parametro Um:");
                parametroUm = scanner.nextInt();
                System.out.println("Parametro Dois: ");
                parametroDois = scanner.nextInt();
                quantidade = Contar(parametroUm, parametroDois);                              
                parametrosValidos = true; 

            } catch (ParametrosInvalidosException e) {                
                System.err.println("Erro: " + e.getMessage());
            }
        }
        System.out.println("\nIniciando contagem:");
        for (int cont = 1; cont <= quantidade; cont++) {
            System.out.println("Imprimindo o número " + cont);
        }        
        scanner.close();        
    }

    static int Contar(int parametroUm, int parametroDois) throws ParametrosInvalidosException {           
    if( parametroUm > parametroDois ){
        throw new ParametrosInvalidosException("O segundo parâmetro deve ser maior que o primeiro"); 
    }
    
    int quantidadeDeInteracoes = parametroDois - parametroUm;
    return quantidadeDeInteracoes;
}
}
