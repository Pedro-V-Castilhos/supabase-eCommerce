import { supabase } from "../../supabase-client";

export const fetchProducts = async () => {
    const {error, data} = await supabase.from("products").select("*");

    if(error){
        console.log(error.message)
        return
    }

    return data;
}