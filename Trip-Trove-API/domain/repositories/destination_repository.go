package repositories

import "Trip-Trove-API/domain/entities"

type DestinationRepository interface {
	AllDestinations() ([]entities.Destination, error)
	DestinationByID(id uint) (*entities.Destination, error)
	CreateDestination(destination entities.Destination) (entities.Destination, error)
	UpdateDestination(id uint, updatedDestination entities.Destination) (entities.Destination, error)
	DeleteDestination(id uint) (entities.Destination, error)
}
