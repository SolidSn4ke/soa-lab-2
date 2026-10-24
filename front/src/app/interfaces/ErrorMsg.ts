export interface ErrorMsg {
    msg: string;
    timestamp: string;
    details: {
        detail: string | string[];
    };
}