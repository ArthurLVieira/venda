export interface ItemVenda {
    produtoId: string;
    produtoDescricao: string;
    precoVenda: number;
    quantidade: number;
    subtotal: number;
}

export interface Venda {
    id: string;
    clienteId: string;
    clienteNome: string;
    itens: ItemVenda[];
    total: number;
    status: 'Faturada' | 'Cancelada' | 'Aberta';
    data: string;
}