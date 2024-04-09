package dataaccess

import (
	"Trip-Trove-API/domain/entities"
	"errors"
	"sync"
)

type InMemoryDestinationRepository struct {
	destinations []entities.Destination
	mu           sync.RWMutex
}

func NewInMemoryDestinationRepository() *InMemoryDestinationRepository {
	return &InMemoryDestinationRepository{}
}

func (r *InMemoryDestinationRepository) AllDestinations() ([]entities.Destination, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.destinations, nil
}

func (r *InMemoryDestinationRepository) DestinationByID(id uint) (*entities.Destination, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for i, destination := range r.destinations {
		if destination.ID == id {
			return &r.destinations[i], nil
		}
	}

	return nil, errors.New("destination not found")
}

func (r *InMemoryDestinationRepository) CreateDestination(destination entities.Destination) (entities.Destination, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	destination.ID = uint(len(r.destinations) + 1)
	r.destinations = append(r.destinations, destination)
	return destination, nil
}

func (r *InMemoryDestinationRepository) DeleteDestination(id uint) (entities.Destination, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	for i, destination := range r.destinations {
		if destination.ID == id {
			r.destinations = append(r.destinations[:i], r.destinations[i+1:]...)
			return destination, nil
		}
	}
	return entities.Destination{}, errors.New("destination not found")
}

func (r *InMemoryDestinationRepository) UpdateDestination(id uint, updatedDestination entities.Destination) (entities.Destination, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	for i, destination := range r.destinations {
		if destination.ID == id {
			r.destinations[i] = updatedDestination
			r.destinations[i].ID = id
			return r.destinations[i], nil
		}
	}

	return entities.Destination{}, errors.New("destination not found")
}
