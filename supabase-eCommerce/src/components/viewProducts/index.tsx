import { useEffect, useState } from "react"
import "./styles.css"
import type Product from "../../types/product"
import type Order from "../../types/order"
import ProductCard from "./card"
import { fetchOrders } from "./handleOrders"
import { fetchProducts } from "./handleProducts"

export default function ViewProducts(){
    const [products, setProducts] = useState<Product[] | undefined>([])
    const [orders, setOrders] = useState<Order[] | undefined>()

    useEffect(() => {
        const loadData = async () => {
            setProducts(await fetchProducts())
            setOrders(await fetchOrders())
        }

        loadData();
    }, []);

    console.log(orders)

    return(
        <div className="productsDisplay">
        <h2>Produtos</h2>
        <div className="viewProducts">
            {products?.map((product) => {
                return(
                    <ProductCard item={product} />
                )
            })}
        </div>
        </div>
    )
}