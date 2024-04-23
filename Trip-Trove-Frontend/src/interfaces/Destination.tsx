export interface IDestination {
  ID: number;
  name: string;
  location_id: number;
  image_url: string;
  description: string;
  visitors_last_year: number;
  is_private: boolean;
}

export interface IDestinationFromServer {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  name: string;
  location_id: number;
  image_url: string;
  description: string;
  visitors_last_year: number;
  is_private: boolean;
}


export interface IDestinationCardProps {
  data: IDestination;
}
