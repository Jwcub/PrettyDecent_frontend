import { Message } from "./message";

export type MessageStatus = 'new' | 'pending' | 'answered';

export interface MessageResponse extends Message {
    _id: number;
    status: MessageStatus;
    created: Date;
    __v: number;
}
