package entities

type Destination struct {
	ID               uint   `json:"ID"`
	Name             string `json:"name" validate:"required,name"`
	Location         string `json:"location" validate:"required,location"`
	Country          string `json:"country" validate:"required,country"`
	ImageUrl         string `json:"image_url" validate:"required,url"`
	Description      string `json:"description" validate:"required,description"`
	VisitorsLastYear int    `json:"visitors_last_year" validate:"gte=0"`
	IsPrivate        bool   `json:"is_private"`
}
