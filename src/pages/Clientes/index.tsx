import type React from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Cliente } from "../../types/cliente";
import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { useNotification } from "../../contexts/NotificationContext";
import type { Action } from "../../components/common/Grid";
import Styles from "./styles.module.css";
import Button from "../../components/common/Button";
import Search from "../../components/common/Search";
import Grid from "../../components/common/Grid";
import Modal from "../../components/common/Modal";

const ClientesPage: React.FC = () => {
    const [ clientes, setClientes ] = useLocalStorage<Cliente[]>('clientes', []);
    const [ filtro, setFiltro ] = useState('');
    const [ clienteEditando, setClienteEditando ] = useState<Cliente | null>(null);
    const { isOpen, open, close } = useModal();
    const { addNotification } = useNotification();

    const clientesFiltrados = clientes.filter((c) => {
        c.nomeCompleto.toLowerCase().includes(filtro.toLowerCase()) ||
        c.cpf.includes(filtro)
    });

    const handleDelete = (cliente: Cliente) => {
        if(window.confirm(`Deseja excluir o cliente ${cliente.nomeCompleto}`)) {
            const updated = clientes.filter((c) => c.id !== cliente.id);
            setClientes(updated);
            addNotification(`Cliente ${cliente.nomeCompleto} excluído com secesso.`, 'success');
        }
    };

    const handleEdit = (cliente: Cliente) => {
        setClienteEditando(cliente);
        open();
    };

    const handleNew = () => {
        setClienteEditando(null);
        open();
    };

    const handleSave = (cliente: Cliente) => {
        if(clienteEditando) {
            const updated = clientes.map((c) => (c.id === cliente.id ? cliente : c));
            setClientes(updated);
            addNotification(`Cliente ${cliente.nomeCompleto} atualizado.`, 'success');
        } else {
            setClientes([ ...clientes, cliente ]);
            addNotification(`Cliente ${cliente.nomeCompleto} cadastrado.`, 'success');
        }
        close();
    };

    const actions: Action<Cliente>[] = [
        { label: 'editar', onClick: handleEdit, variant: 'secondary' },
        { label: 'excluir', onClick: handleDelete, variant: 'danger' }
    ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Clientes</h1>
        <Button variant="primary" onClick={handleNew}>
          + Novo Cliente
        </Button>
      </div>
      <Search value={filtro} onSearch={setFiltro} placeholder="Filtrar por nome ou CPF..." />
      <Grid columns={columns} data={clientesFiltrados} actions={actions} />

      <Modal isOpen={isOpen} onClose={close} title={clienteEditando ? 'Editar Cliente' : 'Novo Cliente'}>
        <ClienteForm
          initialData={clienteEditando || undefined}
          onSave={handleSave}
          onCancel={close}
          existingClientes={clientes}
        />
      </Modal>
    </div>
  );
}

export default ClientesPage;