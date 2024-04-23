export interface ILocation {
    ID: number,
    name: string,
    country?: string,
    description?: string,
}

export interface ILocationFromServer {
    ID: number,
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    name: string,
    country?: string,
    description?: string,
}