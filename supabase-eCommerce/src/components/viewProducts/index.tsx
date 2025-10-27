import { useEffect, useState } from "react"
import "./styles.css"
import type Product from "../../types/product"
import ProductCard from "./card"
import { fetchProducts } from "../../handlers/handleProducts"

export default function ViewProducts(){
    // UseState da lista de produtos do BD
    const [products, setProducts] = useState<Product[] | undefined>()

    // Carrega os produtos do banco de dados
    useEffect(() => {
        const loadData = async () => {
            setProducts(await fetchProducts())
        }

        loadData();
    }, []);

    // Renderiza os componentes
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