import type React from "react"
import Styles from './styles.module.css'
import { NavLink } from 'react-router-dom'

export interface SidebarItem {
    path: string;
    label: string;
    icon?: React.ReactNode;
}

interface SidebarProps {
    items: SidebarItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
    return(
        <aside className={Styles.sidebar}>
            <div className={Styles.logo}>
                <span className={Styles.logoText}>Sistema de Vendas</span>
            </div>

            <nav className={Styles.nav}>
                {items.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `${Styles.navLink} ${isActive ? Styles.active : ''}`}
                    >
                        {item.icon && <span className={Styles.icon}>{item.icon}</span>}
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}

export default Sidebar;