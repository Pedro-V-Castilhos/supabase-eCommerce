import { useEffect, useState } from "react"
import "./styles.css"
import type Order from "../../types/order";
import { deleteProductFromOrder, fetchOrders, getOrderProducts, updateOrderStatus, updateQuantity } from "../../handlers/handleOrders";
import type Product from "../../types/product";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { exportCSV } from "./generateCSV";

export default function ViewOrder(){
    // UseState do pedido aberto do usuário
    const [order, setOrder] = useState<{id: number, productId: number, orderId: number, quantity: number, products: Product}[]>()
    // Navigate para redirecionamento de página
    const redirect = useNavigate();
    
    // Carrega a ordem aberta do usuário
    useEffect(()=>{
        const loadOrders = async () => {
            const orders:Order[] | undefined = await fetchOrders();
            if(orders){
                setOrder(await getOrderProducts(orders[0].id))
            }
        }

        loadOrders();
    }, [])

    // Prepara a variável para calcular o valor total da compra
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
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody>
                    {order?.map((prod) => {
                        const total:number = prod.quantity * prod.products.unitPrice
                        totalValue[0] += total;
                        return(
                            <tr key={prod.id}>
                                <td>{prod.products.name}</td>
                                <td>
                                    <Button 
                                        variant=""
                                        onClick={async () => {
                                            await updateQuantity(prod.id, prod.quantity - 1)
                                            
                                            if((prod.quantity - 1) == 0){
                                                // Atualiza a página para excluir o item
                                                redirect(0)
                                            }else{
                                                // Atualiza o useState para renderizar a página novamente
                                                setOrder((prev) =>
                                                prev?.map((p) =>
                                                    p.id === prod.id ? { ...p, quantity: prod.quantity - 1 } : p
                                                )
                                                );
                                            }
                                        }}
                                    >
                                        -
                                    </Button>
                                    {prod.quantity}
                                    <Button 
                                        variant=""
                                        onClick={async () => {
                                            await updateQuantity(prod.id, prod.quantity + 1)
                                            
                                            // Atualiza o useState para renderizar a página novamente
                                            setOrder((prev) =>
                                            prev?.map((p) =>
                                                p.id === prod.id ? { ...p, quantity: prod.quantity + 1 } : p
                                            )
                                            );
                                        }}
                                    >
                                        +
                                    </Button>
                                </td>
                                <td>R${prod.products.unitPrice.toFixed(2)}</td>
                                <td>R${total.toFixed(2)}</td>
                                <td>
                                    <Button 
                                        variant="danger" 
                                        onClick={async () => {
                                            await deleteProductFromOrder(prod.orderId, prod.productId)
                                            // Atualiza a página para exluir item da visualização
                                            redirect(0);
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                                        </svg>
                                    </Button>
                                </td>
                            </tr>
                        )
                    })}
                    <tr><td className="total" colSpan={5}>Total: R${totalValue[0].toFixed(2)}</td></tr>
                </tbody>
            </table><br/>
            <Button 
                variant="primary"
                onClick={async () => {
                    // Confirma a compra
                    const orderId = (order ?? [])[0].orderId;

                    if(!order){
                        return 
                    }

                    await updateOrderStatus(orderId, "Confirmado")
                    await exportCSV(orderId)
                    redirect("/")
                }}
            >
                Confirmar
            </Button>
            <Button 
                variant="danger"
                onClick={async () => {
                    // Cancela a compra
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