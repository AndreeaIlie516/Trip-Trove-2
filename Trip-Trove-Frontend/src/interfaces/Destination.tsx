export interface IDestination {
    id: number,
    name: string,
    location: string,
    country: string,
    image_url: string,
    description?: string,
    is_private: boolean
}

export interface IDestinationCardProps {
    data: IDestination;
}