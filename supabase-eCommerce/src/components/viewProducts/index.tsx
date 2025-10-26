import { useEffect, useState } from "react"
import "./styles.css"
import { supabase } from "../../supabase-client"
import type Product from "./product"
import type Order from "./order"
import ProductCard from "./productCard"

export default function ViewProducts(){
    const [products, setProducts] = useState<Product[]>([])
    const [orders, setOrders] = useState<Order[]>([])

    const newOrder = async () => {
        const idUser:string | undefined = (await supabase.auth.getSession()).data.session?.user.id

        const {error} = await supabase.from("orders").insert({status:"Aberto", client: idUser})
        if(error){
            console.log(error.message)
            return
        }
    }

    const fetchOrders = async() => {
        const {error, data} = await supabase.from("orders").select("*").eq("status", "Aberto");

        if(data?.length == 0){
            newOrder();
            fetchOrders();
            return
        }

        if(error){
            console.log(error.message)
            return
        }

        setOrders(data)
    }

    const fetchProducts = async () => {
        const {error, data} = await supabase.from("products").select("*");

        if(error){
            console.log(error.message)
            return
        }

        setProducts(data)
    }

    useEffect(() => {
        fetchProducts();
        fetchOrders();
    }, []);

    console.log(orders)

    return(
        <div className="productsDisplay">
        <h2>Produtos</h2>
        <div className="viewProducts">
            {products.map((product) => {
                return(
                    <ProductCard item={product} />
                )
            })}
        </div>
        </div>
    )
}