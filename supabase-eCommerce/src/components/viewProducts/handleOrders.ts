import { supabase } from "../../supabase-client"

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