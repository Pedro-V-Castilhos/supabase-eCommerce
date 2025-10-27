import { Button } from "react-bootstrap";
import type Product from "../../../types/product";
import "./styles.css"
import { insertProductToOrder } from "../../../handlers/handleOrders";
import { useState } from "react";

export default function ProductCard(props:{item:Product}){
    // Reposta ao usuário de que o botão foi clicado
    const [isDisabled, setIsDisabled] = useState<boolean>(false)
    
    // Desabilita o botão por um breve momento para dar a resposta visual de que o produto foi adicionado
    const handleAdd = async (item:Product) => {
        setIsDisabled(true)
        insertProductToOrder(item.id)
        setTimeout(() => setIsDisabled(false), 500)
    };

    // Renderiza o cartão
    return(
        <div className="card" key={props.item.id}>
            <h3>{props.item.name}</h3>
            <img src={props.item.imgUrl}></img>
            <p>Preço: R${props.item.unitPrice.toFixed(2)}</p>
            <Button 
                variant="primary" 
                onClick={() =>{
                    handleAdd(props.item)
                }}
                disabled={isDisabled}
            >Adicionar</Button>
        </div>
    )
}