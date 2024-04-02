package services

import (
	"Trip-Trove-API/domain/entities"
	"Trip-Trove-API/domain/repositories"
	"errors"
	"fmt"
)

type IDestinationService interface {
	AllDestinations() ([]entities.Destination, error)
	DestinationByID(idStr string) (*entities.Destination, error)
	CreateDestination(destination entities.Destination) (entities.Destination, error)
	UpdateDestination(idStr string, updatedDestination entities.Destination) (entities.Destination, error)
	DeleteDestination(idStr string) (entities.Destination, error)
}

type DestinationService struct {
	Repo repositories.DestinationRepository
}

var _ IDestinationService = &DestinationService{}

func (service *DestinationService) AllDestinations() ([]entities.Destination, error) {
	destinations, err := service.Repo.AllDestinations()
	if err != nil {
		return nil, err
	}
	return destinations, nil
}

func (service *DestinationService) DestinationByID(idStr string) (*entities.Destination, error) {
	var id uint
	if _, err := fmt.Sscanf(idStr, "%d", &id); err != nil {
		return nil, errors.New("invalid ID format")
	}

	destination, err := service.Repo.DestinationByID(id)
	if err != nil {
		return nil, err
	}

	return destination, nil
}

func (service *DestinationService) CreateDestination(destination entities.Destination) (entities.Destination, error) {
	destination, err := service.Repo.CreateDestination(destination)
	if err != nil {
		return entities.Destination{}, err
	}
	return destination, nil
}

func (service *DestinationService) DeleteDestination(idStr string) (entities.Destination, error) {
	var id uint
	if _, err := fmt.Sscanf(idStr, "%d", &id); err != nil {
		return entities.Destination{}, errors.New("invalid ID format")
	}

	destination, err := service.Repo.DeleteDestination(id)
	if err != nil {
		return entities.Destination{}, err
	}
	return destination, nil
}

func (service *DestinationService) UpdateDestination(idStr string, destination entities.Destination) (entities.Destination, error) {
	var id uint
	if _, err := fmt.Sscanf(idStr, "%d", &id); err != nil {
		return entities.Destination{}, errors.New("invalid ID format")
	}

	destination, err := service.Repo.UpdateDestination(id, destination)
	if err != nil {
		return entities.Destination{}, err
	}
	return destination, nil
}
