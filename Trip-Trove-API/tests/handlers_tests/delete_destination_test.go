package handlers

import (
	"Trip-Trove-API/domain/entities"
	"Trip-Trove-API/presentation/handlers"
	"Trip-Trove-API/routes"
	"Trip-Trove-API/tests/mocks"
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestDeleteDestination_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	mockService := &mocks.MockDestinationService{
		DeleteDestinationFunc: func(id string) (entities.Destination, error) {
			return entities.Destination{ID: 1, Name: "Deleted Destination"}, nil
		},
	}

	destinationHandler := &handlers.DestinationHandler{Service: mockService}
	routes.RegisterDestinationRoutes(router, destinationHandler)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/destinations/1", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestDeleteDestination_InvalidIDFormat(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	mockService := &mocks.MockDestinationService{
		DeleteDestinationFunc: func(id string) (entities.Destination, error) {
			return entities.Destination{}, errors.New("invalid ID format")
		},
	}

	destinationHandler := &handlers.DestinationHandler{Service: mockService}
	routes.RegisterDestinationRoutes(router, destinationHandler)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/destinations/abc", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code, "Expected HTTP status code 400 for invalid ID format")
}

func TestDeleteDestination_NotFound(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	mockService := &mocks.MockDestinationService{
		DeleteDestinationFunc: func(id string) (entities.Destination, error) {
			return entities.Destination{}, errors.New("destination not found")
		},
	}

	destinationHandler := &handlers.DestinationHandler{Service: mockService}
	routes.RegisterDestinationRoutes(router, destinationHandler)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/destinations/9999", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}
