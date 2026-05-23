export type MenuItemType = 'food' | 'drink' | null;

export interface MenuItem {
    name: string;
    description: string;
    type: MenuItemType;
    category: string;
    price: number;
}
