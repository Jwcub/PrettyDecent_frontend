export type MessageStatus = 'new' | 'pending' | 'answered';

export interface Message {
    name: string;
    email: string;
    title: string;
    message: string;
    _id?: string;
    status?: MessageStatus;
    created?: Date;
    __v?: number;
}
