import { supabase } from "../../supabase-client"

export const exportCSV = async (orderId: number) => {
    // Pega o Token da sessão atual no sistema
    const sessionResponse = await supabase.auth.getSession()
    const token = sessionResponse.data.session?.access_token

    // Pega o CSV pela Edge Funcion configurada no SupaBase
    const data = await fetch(`https://vexkajdtdhffxefkyydx.supabase.co/functions/v1/exportOrderCSV/${orderId}`,
    {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if(!data.ok){
        console.log("Erro ao gerar o arquivo csv!")
        return
    }

    // Gera o blob do arquivo
    const blob = await data.blob(); 
    const url = URL.createObjectURL(blob); 

    // Faz a instalação automática do arquivo csv, por meio de um link virtual
    const a = document.createElement("a");
    a.href = url;
    a.download = `pedido.csv`; 
    document.body.appendChild(a);
    a.click();
    a.remove();
}