import React, { useEffect } from 'react';
import Input from '../../common/Input';
import Button from '../../common/Button';
import { useForm } from '../../../hooks/useForm';
import Styles from './styles.module.css';
import type { Produto } from '../../../types/produto';

interface ProdutoFormProps {
  initialData?: Produto;
  onSave: (produto: Produto) => void;
  onCancel: () => void;
}

const ProdutoForm: React.FC<ProdutoFormProps> = ({ initialData, onSave, onCancel }) => {
  const { values, errors, handleChange, handleSubmit, reset, setValues } = useForm<Omit<Produto, 'id'>>(
    {
      descricao: '',
      preco: 0,
      quantidade: 0,
    },
    (values) => {
      const errors: Partial<Record<keyof Omit<Produto, 'id'>, string>> = {};
      if (!values.descricao.trim()) errors.descricao = 'Descrição é obrigatória';
      if (values.preco <= 0) errors.preco = 'Preço deve ser maior que zero';
      if (values.quantidade < 0) errors.quantidade = 'Quantidade não pode ser negativa';
      return errors;
    }
  );

  useEffect(() => {
    if (initialData) {
      setValues({
        descricao: initialData.descricao,
        preco: initialData.preco,
        quantidade: initialData.quantidade,
      });
    }
  }, [initialData, setValues]);

  const onSubmit = (formValues: Omit<Produto, 'id'>) => {
    const produto: Produto = {
      id: initialData?.id || '',
      ...formValues,
    };
    onSave(produto);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={Styles.form}>
      <Input
        label="Descrição"
        name="descricao"
        value={values.descricao}
        onChange={handleChange}
        error={errors.descricao}
        required
      />
      <Input
        label="Preço Unitário (R$)"
        name="preco"
        type="number"
        step="0.01"
        min="0.01"
        value={values.preco}
        onChange={handleChange}
        error={errors.preco}
        required
      />
      <Input
        label="Quantidade em Estoque"
        name="quantidade"
        type="number"
        step="1"
        min="0"
        value={values.quantidade}
        onChange={handleChange}
        error={errors.quantidade}
        required
      />
      <div className={Styles.actions}>
        <Button variant="secondary" onClick={onCancel} type="button">
          Cancelar
        </Button>
        <Button variant="primary" type="submit">
          {initialData ? 'Atualizar' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
};

export default ProdutoForm;