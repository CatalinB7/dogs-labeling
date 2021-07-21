export interface IResponse {
    links: string[];
    id?: number;
    status: number;
}

export interface IFetchParams {
    id: number;
    category?: string;
    oldCategory?: string;
    newCategory?: string;
    link?: string
    name: string
}