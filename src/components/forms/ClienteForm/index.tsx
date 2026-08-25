import React, { useEffect } from 'react';
import Input from '../../common/Input';
import Button from '../../common/Button';
import { useForm } from '../../../hooks/useForm';
import Styles from './styles.module.css';
import type { Cliente } from '../../../types/cliente';

interface ClienteFormProps {
  initialData?: Cliente;
  onSave: (cliente: Cliente) => void;
  onCancel: () => void;
  existingClientes: Cliente[]; // para verificar CPF duplicado
}

const ClienteForm: React.FC<ClienteFormProps> = ({
  initialData,
  onSave,
  onCancel,
  existingClientes,
}) => {
  const { values, errors, handleChange, handleSubmit, reset, setValues } = useForm<Omit<Cliente, 'id'>>(
    {
      nomeCompleto: '',
      cpf: '',
      dataNascimento: '',
    },
    (values) => {
      const errors: Partial<Record<keyof Omit<Cliente, 'id'>, string>> = {};
      if (!values.nomeCompleto.trim()) errors.nomeCompleto = 'Nome é obrigatório';
      if (!values.cpf.trim()) errors.cpf = 'CPF é obrigatório';
      // Verifica se CPF já existe (excluindo o próprio em edição)
      const cpfExists = existingClientes.some(
        (c) => c.cpf === values.cpf && c.id !== initialData?.id
      );
      if (cpfExists) errors.cpf = 'CPF já cadastrado';
      if (!values.dataNascimento) errors.dataNascimento = 'Data de nascimento é obrigatória';
      return errors;
    }
  );

  // Preencher formulário em modo edição
  useEffect(() => {
    if (initialData) {
      setValues({
        nomeCompleto: initialData.nomeCompleto,
        cpf: initialData.cpf,
        dataNascimento: initialData.dataNascimento,
      });
    }
  }, [initialData, setValues]);

  const onSubmit = (formValues: Omit<Cliente, 'id'>) => {
    const cliente: Cliente = {
      id: initialData?.id || '', // será gerado no storage
      ...formValues,
    };
    onSave(cliente);
    reset(); // limpa após salvar
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={Styles.form}>
      <Input
        label="Nome Completo"
        name="nomeCompleto"
        value={values.nomeCompleto}
        onChange={handleChange}
        error={errors.nomeCompleto}
        required
      />
      <Input
        label="CPF"
        name="cpf"
        value={values.cpf}
        onChange={handleChange}
        error={errors.cpf}
        placeholder="000.000.000-00"
        required
      />
      <Input
        label="Data de Nascimento"
        name="dataNascimento"
        type="date"
        value={values.dataNascimento}
        onChange={handleChange}
        error={errors.dataNascimento}
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

export default ClienteForm;