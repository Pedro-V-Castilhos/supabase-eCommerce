import { useEffect, useState } from "react"
import "./styles.css"
import type Order from "../../types/order";
import { fetchOrders, getOrderProducts } from "../../handlers/handleOrders";
import type Product from "../../types/product";

export default function ViewOrder(){
    const [order, setOrder] = useState<{id: number, productId: number, orderId: number, quantity: number, products: Product}[]>()

    useEffect(()=>{
        const loadOrders = async () => {
            const orders:Order[] | undefined = await fetchOrders();
            if(orders){
                setOrder(await getOrderProducts(orders[0].id))
            }
        }

        loadOrders();
    }, [])

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
            </table>
        </div>
        </div>
    )
}