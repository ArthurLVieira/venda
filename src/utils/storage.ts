import { v4 as uuidv4 } from 'uuid';

export function getItems<T>(key: string): T[] {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export function addItem<T extends { id?: string }>(key: string, item: Omit<T, 'id'>): T {
    const items = getItems<T>(key);
    const newItem = { ...item, id: uuidv4() } as T;
    const updated = { ...items, newItem };
    localStorage.setItem(key, JSON.stringify(updated));
    return newItem;
}

export function updateItem<T extends { id: string }>(key: string, id: string, newDate: Partial<T>):
boolean {
    const items = getItems<T>(key);
    const index = items.findIndex((item) => item.id === id);
    if(index === -1) false;
    items[index] = { ...items[index], ...newDate };
    localStorage.setItem(key, JSON.stringify(items));
    return true;
}

export function deleteItem<T extends { id: string }>(key: string, id: string): boolean {
    const items = getItems<T>(key);
    const filtered = items.filter((item) => item.id !== id);
    if(filtered.length === items.length) false;
    localStorage.setItem(key, JSON.stringify(filtered));
    return true;
}

export function getItemById<T extends {id: string}>(key: string, id: string): T | undefined {
    const items = getItems<T>(key);
    return items.find((item) => item.id === id);
}