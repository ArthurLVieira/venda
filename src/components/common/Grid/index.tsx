import type React from 'react';
import type { ButtonVariant } from '../Button';
import Styles from './styles.module.css';
import Button from '../Button';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

export interface Action<T> {
  label: string;
  onClick: (item: T) => void;
  variant?: ButtonVariant;
  condition?: (item: T) => boolean;
}

interface GridProps<T> {
  columns: Column<T>[];
  data: T[];
  actions?: Action<T>[];
  emptyMessage?: string;
}

function Grid<T extends { id: string | number }>({
  columns,
  data,
  actions = [],
  emptyMessage = 'Nenhum registro encontrado.',
}: GridProps<T>) {
  if (data.length === 0) {
    return <div className={Styles.emptyMessage}>{emptyMessage}</div>;
  }

  return (
    <div className={Styles.gridWrapper}>
      <table className={Styles.grid}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={String(col.key)} className={Styles.th}>
                {col.label}
              </th>
            ))}
            {actions.length > 0 && <th className={Styles.thActions}>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id} className={Styles.tr}>
              {columns.map(col => (
                <td key={String(col.key)} className={Styles.td}>
                  {col.render ? col.render(item) : (item as any)[col.key]}
                </td>
              ))}
              {actions.length > 0 && (
                <td className={Styles.tdActions}>
                  <div className={Styles.actionButtons}>
                    {actions.map((action, index) => {
                      if (action.condition && !action.condition(item)) {
                        return null;
                      }
                      return (
                        <Button
                          key={index}
                          variant={action.variant || 'primary'}
                          size='small'
                          onClick={() => action.onClick(item)}
                        >
                          {action.label}
                        </Button>
                      );
                    })}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Grid;