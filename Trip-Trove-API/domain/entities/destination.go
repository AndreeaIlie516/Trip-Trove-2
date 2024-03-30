package entities

import "gorm.io/gorm"

type Destination struct {
	gorm.Model
	Name             string `gorm:"column:name;not null" json:"name" validate:"required,min=3"`
	Location         string `gorm:"column:location;not null" json:"location" validate:"required,min=3"`
	Country          string `gorm:"column:country;not null" json:"country" validate:"required,min=3"`
	ImageUrl         string `gorm:"column:image_url" json:"image_url" validate:"max=100"`
	Description      string `gorm:"column:description" json:"description" validate:"max=256"`
	VisitorsLastYear int    `gorm:"column:visitors_last_year" json:"visitors_last_year"`
	IsPrivate        bool   `gorm:"column:is_private;not null" json:"is_private"`
}
