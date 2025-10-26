import { supabase } from "../../supabase-client"
import type Order from "../../types/order"

export const newOrder = async () => {
    const idUser:string | undefined = (await supabase.auth.getSession()).data.session?.user.id
    const {error} = await supabase.from("orders").insert({status:"Aberto", client: idUser})

    if(error){
        console.log(error.message)
        return
    }
}

export const fetchOrders = async() => {
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

    return data;
}

export const insertProductToOrder = async (id:number) => {
    const currentOrder:Order[] = await fetchOrders() || []

    const {error} = await supabase.from("order_has_products").insert({orderId: currentOrder[0].id,productId: id, quantity: 1})

    if(error){
        console.log(error.message)
        return
    }
}