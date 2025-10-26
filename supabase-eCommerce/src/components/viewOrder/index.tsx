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
                        return(
                            <tr>
                                <td>{prod.products.name}</td>
                                <td>{prod.quantity}</td>
                                <td>{prod.products.unitPrice}</td>
                                <td>{prod.quantity * prod.products.unitPrice}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
        </div>
    )
}