import { MenuItem } from "./menu";

export interface MenuItemResponse extends MenuItem {
    _id: string;
    display: boolean;
    created: Date;
    __v: number;
}
