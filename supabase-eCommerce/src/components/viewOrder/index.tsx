import { useEffect, useState } from "react"
import "./styles.css"
import type Order from "../../types/order";
import { fetchOrders, getOrderProducts, updateOrderStatus } from "../../handlers/handleOrders";
import type Product from "../../types/product";
import { Button } from "react-bootstrap";
import { supabase } from "../../supabase-client";
import { useNavigate } from "react-router-dom";

export default function ViewOrder(){
    const [order, setOrder] = useState<{id: number, productId: number, orderId: number, quantity: number, products: Product}[]>()
    const redirect = useNavigate();
    
    useEffect(()=>{
        const loadOrders = async () => {
            const orders:Order[] | undefined = await fetchOrders();
            if(orders){
                setOrder(await getOrderProducts(orders[0].id))
            }
        }

        loadOrders();
    }, [])

    const exportCSV = async () => {
        const sessionResponse = await supabase.auth.getSession()
        const token = sessionResponse.data.session?.access_token

        const orderId = (order??[])[0].orderId
        if(!orderId){
            console.log("Erro: nenhum pedido carregado!")
            return
        }

        console.log(token)

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

        const blob = await data.blob(); 
        const url = URL.createObjectURL(blob); 

        const a = document.createElement("a");
        a.href = url;
        a.download = `pedido.csv`; 
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    const totalValue:number[] = [0] 

    return(
        <div className="orderDisplay">
        <h2>Meu carrinho</h2>
        <div className="viewOrder">
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Quantidade</th>
                        <th>Preço unitário</th>
                        <th>Preço total</th>
                    </tr>
                </thead>
                <tbody>
                    {order?.map((prod) => {
                        const total:number = prod.quantity * prod.products.unitPrice
                        totalValue[0] += total;
                        return(
                            <tr key={prod.id}>
                                <td>{prod.products.name}</td>
                                <td>{prod.quantity}</td>
                                <td>R${prod.products.unitPrice.toFixed(2)}</td>
                                <td>R${total.toFixed(2)}</td>
                            </tr>
                        )
                    })}
                    <tr><td className="total" colSpan={4}>Total: R${totalValue[0].toFixed(2)}</td></tr>
                </tbody>
            </table><br/>
            <Button 
                variant="primary"
                onClick={async () => {
                    const orderId = (order ?? [])[0].orderId;

                    if(!order){
                        return 
                    }

                    await updateOrderStatus(orderId, "Confirmado")
                    await exportCSV()
                    redirect("/")
                }}
            >
                Confirmar
            </Button>
            <Button 
                variant="danger"
                onClick={async () => {
                    const orderId = (order ?? [])[0].orderId;

                    if(!order){
                        return 
                    }

                    await updateOrderStatus(orderId,"Cancelado")
                    redirect("/")
                }}
            >
                Cancelar
            </Button>
        </div>
        </div>
    )
}