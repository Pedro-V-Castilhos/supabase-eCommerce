import { supabase } from "../../supabase-client";

export const fetchProducts = async () => {
    const {error, data} = await supabase.from("products").select("*")

    if(error){
        console.log(error.message)
        return
    }

    return data;
}

export const selectProduct = async (id:number) => {
    const {error, data} = await supabase.from("products").select("*").eq("id", id)

    if(error){
        console.log(error.message)
        return
    }

    return data;
}