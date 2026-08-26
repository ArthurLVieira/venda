import type React from "react";
import type { Cliente } from "../../../types/cliente";
import type { Produto } from "../../../types/produto";
import type { ItemVenda, Venda } from "../../../types/venda";
import { useEffect, useState } from "react";
import { useForm } from "../../../hooks/useForm";
import { v4 as uuidv4 } from 'uuid';
import Styles from './styles.module.css';
import Select from "../../common/Select";
import Input from "../../common/Input";
import Button from "../../common/Button";

interface VendaFormProps {
    clientes: Cliente[];
    produtos: Produto[];
    onSave: (venda: Venda) => void;
    onCancel: () => void;
}

interface FormValues {
    clienteId: string;
    itens: ItemVenda[];
}

const VendaForm: React.FC<VendaFormProps> = ({ clientes, produtos, onSave, onCancel }) => {
    const [ valorTotal, setValorTotal ] = useState(0);

    const { values, errors, handleChange, setValues, handleSubmit } = useForm<FormValues>({
        clienteId: '',
        itens: [],
    });

    const addItem = () => {
        const novoItem: ItemVenda = {
            produtoId: '',
            produtoDescricao: '',
            precoVenda: 0,
            quantidade: 0,
            subtotal: 0,
        };
        setValues((prev) => ({
            ...prev,
            itens: [ ...prev.itens, novoItem ],
        }));
    };

    const updateItem = (index: number, field: keyof ItemVenda, value: any) => {
        setValues((prev) => {
            const newItens = [...prev.itens];
            const item = { ...newItens[index] };
            if(field === 'produtoId') {
                const produto = produtos.find((p) => p.id === value);
                if(produto) {
                    item.produtoId = produto.id;
                    item.produtoDescricao = produto.descricao;
                    item.precoVenda = produto.preco;
                } else {
                    item.produtoId = '';
                    item.produtoDescricao = '';
                    item.precoVenda = 0;
                }
                item.quantidade = 1;
            } else if(field === 'precoVenda' || field === 'quantidade') {
                item[field] = value;
            }
            item.subtotal = item.precoVenda * item.quantidade;
            newItens[index] = item;
            return { ...prev, itens: newItens };
        });
    };

    useEffect(() => {
        const total = values.itens.reduce((acc, item) => acc + (item.precoVenda * item.quantidade), 0);
        setValorTotal(total);
    }, values.itens);

    const validate = (formValues: FormValues) => {
        const errors: any = {};
        if(!formValues.clienteId) errors.clienteId = 'Selecione um cliente';
        if(formValues.itens.length === 0) errors.itens = 'Adicione pelo menos um item';
        formValues.itens.forEach((item, idx) => {
            if(!item.produtoId) errors[`item_${idx}_produto`] = 'Selecione um produto.';
            if(item.quantidade <= 0) errors[`item_${idx}_quantidade`] = 'Quantidade deve ser maior que zero';

            const produto = produtos.find((p) => p.id === item.produtoId);
            if(produto && item.quantidade > produto.quantidade)
                errors[`item_${idx}_estoque`] = `Estoque insuficionente (Disponível: ${produto.quantidade})`;
        });
        return errors;
    };

    const onSubmit = (formValues: FormValues) => {
        const venda: Venda = {
            id: uuidv4(),
            clienteId: formValues.clienteId,
            clienteNome: clientes.find((c) => c.id === formValues.clienteId)?.nomeCompleto || '',
            itens: formValues.itens,
            total: valorTotal,
            status: 'Faturada',
            data: new Date().toISOString(),
        };

        onSave(venda);
        setValues({clienteId: '', itens: []});
    };

  const clienteOptions = clientes.map((c) => ({ value: c.id, label: c.nomeCompleto }));
  const produtoOptions = produtos.map((p) => ({ value: p.id, label: `${p.descricao} (R$ ${p.preco.toFixed(2)})` }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={Styles.form}>
      <Select
        label="Cliente"
        options={clienteOptions}
        value={values.clienteId}
        onChange={(val) => handleChange({ target: { name: 'clienteId', value: val } } as any)}
        error={errors.clienteId}
        required
      />

      <div className={Styles.itensContainer}>
        <div className={Styles.itensHeader}>
          <span>Produto</span>
          <span>Preço Venda</span>
          <span>Qtd</span>
          <span>Subtotal</span>
          <span></span>
        </div>
        {values.itens.map((item, index) => {
          const produto = produtos.find((p) => p.id === item.produtoId);
          const errorProduto = errors[`item_${index}_produto`] || errors[`item_${index}_estoque`];
          return (
            <div key={index} className={Styles.itemRow}>
              <Select
                options={produtoOptions}
                value={item.produtoId}
                onChange={(val) => updateItem(index, 'produtoId', val)}
                error={errorProduto}
              />
              <Input
                type="number"
                step="0.01"
                value={item.precoVenda}
                onChange={(e) => updateItem(index, 'precoVenda', parseFloat(e.target.value) || 0)}
                min="0.01"
              />
              <Input
                type="number"
                step="1"
                value={item.quantidade}
                onChange={(e) => updateItem(index, 'quantidade', parseInt(e.target.value) || 0)}
                min="1"
                error={errors[`item_${index}_quantidade`]}
              />
              <span className={Styles.subtotal}>R$ {item.subtotal.toFixed(2)}</span>
              <Button variant="danger" size="small" onClick={() => removeItem(index)}>
                Remover
              </Button>
            </div>
          );
        })}
        <Button variant="secondary" onClick={addItem} type="button">
          + Adicionar Produto
        </Button>
        {errors.itens && <span className={Styles.errorMessage}>{errors.itens}</span>}
      </div>

      <div className={Styles.totalContainer}>
        <strong>Total da Venda: R$ {valorTotal.toFixed(2)}</strong>
      </div>

      <div className={Styles.actions}>
        <Button variant="secondary" onClick={onCancel} type="button">
          Cancelar
        </Button>
        <Button variant="success" type="submit">
          Finalizar Venda
        </Button>
      </div>
    </form>
  );
};

export default VendaForm;