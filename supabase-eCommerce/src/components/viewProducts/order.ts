export default interface Order{
    id: number
    status: OrderStatus,
    client: string | undefined
}

export type OrderStatus = "Aberto" | "Cancelado" | "Confirmado";