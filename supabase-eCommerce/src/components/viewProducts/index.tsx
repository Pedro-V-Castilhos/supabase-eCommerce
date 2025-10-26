import { useEffect, useState } from "react"
import "./styles.css"
import type Product from "../../types/product"
import ProductCard from "./card"
import { fetchProducts } from "../../handlers/handleProducts"

export default function ViewProducts(){
    const [products, setProducts] = useState<Product[] | undefined>()

    useEffect(() => {
        const loadData = async () => {
            setProducts(await fetchProducts())
        }

        loadData();
    }, []);

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