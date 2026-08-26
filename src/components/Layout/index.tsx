import type React from "react";
import Styles from './styles.module.css';
import Sidebar from "../common/Sidebar";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const menuItens = [
        {path: '/', label: 'Dashboard', icon: '📊'},
        { path: '/clientes', label: 'Clientes', icon: '👤' },
        { path: '/produtos', label: 'Produtos', icon: '📦' },
        { path: '/vendas', label: 'Vendas', icon: '🛒' },
        { path: '/caixa', label: 'Caixa', icon: '💰' },
    ];

    return(
        <div className={Styles.layout}>
            <Sidebar items={menuItens} />
            <main className={Styles.content} >
                {children}
            </main>
        </div>
    );
};

export default Layout;