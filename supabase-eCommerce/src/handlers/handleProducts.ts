import { supabase } from "../supabase-client";

// SELECT * FROM PRODUCTS
export const fetchProducts = async () => {
    const {error, data} = await supabase.from("products").select("*")

    if(error){
        console.log(error.message)
        return
    }

    return data;
}

// SELECT PRODUCT FROM PRODUCTS
export const getProduct = async (id:number) => {
    const {error, data} = await supabase.from("products").select("*").eq("id", id)

    if(error){
        console.log(error.message)
        return
    }

    return data;
}