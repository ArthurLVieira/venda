export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(value);
};

export const formatDate = (dataString: string): string => {
    return new Date(dataString).toLocaleDateString('pt-BT');
};

export const formatDateTime = (dataString: string): string => {
    return new Date(dataString).toLocaleString('pt-BR');
};

export const isValidCPF = (cpf: string): boolean => {
    const clean = cpf.replace(/\D/g, '');
    if (clean.length !== 11) return false;

    if (/^(\D)1+$/.test(clean)) return false;

    return true;
};