import type Product from "../../types/product";

export default function ProductCard(props:{item:Product}){
    return(
        <div className="card" key={props.item.id}>
            <h3>{props.item.name}</h3>
            <img src={props.item.imgUrl}></img>
            <p>Preço: R${props.item.unitPrice.toFixed(2)}</p>
        </div>
    )
}