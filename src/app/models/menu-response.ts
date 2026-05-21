import { MenuItem } from "./menu";

export interface MenuItemResponse extends MenuItem {
    _id: number;
    display: boolean;
    created: Date;
    __v: number;
}
