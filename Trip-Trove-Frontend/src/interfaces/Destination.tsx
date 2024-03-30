export interface IDestination {
  ID: string;
  name: string;
  location: string;
  country: string;
  image_url: string;
  visitors_last_year: number;
  description?: string;
  is_private: boolean;
}

export interface IDestinationServer {
  name: string;
  location: string;
  country: string;
  image_url: string;
  visitors_last_year: number;
  description?: string;
  is_private: boolean;
}


export interface IDestinationCardProps {
  data: IDestination;
}
