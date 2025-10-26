import { supabase } from "../supabase-client"
import type Order from "../types/order"
import type OrderHasProduct from "../types/orderHasProduct"

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
    const orderHasProuct:OrderHasProduct[] = await checkIfProductInOrder(id, currentOrder[0].id) || []

    if(orderHasProuct.length != 0){
        const {error} = await supabase.from("order_has_products").update({quantity: orderHasProuct[0].quantity + 1}).eq("id", orderHasProuct[0].id)
        if(error){
            console.log(error.message)
            return
        }
    }else{
        const {error} = await supabase.from("order_has_products").insert({orderId: currentOrder[0].id,productId: id, quantity: 1})
        if(error){
            console.log(error.message)
            return
        }
    }
}

export const checkIfProductInOrder = async (productId:number, orderId:number) => {
    const {error, data} = await supabase.from("order_has_products").select("*").eq("productId", productId).eq("orderId", orderId)
    
    if(error){
        console.log(error.message)
        return
    }

    return data
}

export const getOrderProducts = async (orderId: number) => {
    const {error, data} = await supabase.from("order_has_products").select("*, products (*)").eq("orderId", orderId) || [];

    if(error){
        console.log(error.message)
        return
    }

    return data
}

export const updateOrderStatus = async (orderId:number, newStatus:string) => {
    const {error} = await supabase.from("orders").update({status: newStatus}).eq("id", orderId)

    if(error){
        console.log(error.message)
        return
    }
}

export const deleteProductFromOrder = async (orderId: number, productId:number) => {
    const {error} = await supabase.from("order_has_products").delete().eq("orderId", orderId).eq("productId", productId)

    if(error){
        console.log(error.message)
        return
    }
}

export const updateQuantity = async (orderId: number, newQuantity: number) => {
    if(newQuantity < 0){
        return
    }

    if(newQuantity == 0){
        const {error} = await supabase.from("order_has_products").delete().eq("id", orderId)
        if(error){
            console.log(error.message)
            return
        }
    }else{
        const {error} = await supabase.from("order_has_products").update({quantity: newQuantity}).eq("id", orderId)
        if(error){
            console.log(error.message)
            return
        }
    }
}