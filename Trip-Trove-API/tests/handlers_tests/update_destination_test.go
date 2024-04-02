package handlers

import (
	"Trip-Trove-API/domain/entities"
	"Trip-Trove-API/presentation/handlers"
	"Trip-Trove-API/routes"
	"Trip-Trove-API/tests/mocks"
	"bytes"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestUpdateDestination_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	mockService := &mocks.MockDestinationService{
		UpdateDestinationFunc: func(id string, destination entities.Destination) (entities.Destination, error) {
			return destination, nil
		},
	}

	destinationHandler := &handlers.DestinationHandler{Service: mockService}
	routes.RegisterDestinationRoutes(router, destinationHandler)

	updatedDestination := entities.Destination{
		Name:             "Updated Lake Retreat",
		Location:         "Updated Finnish Lapland",
		Country:          "Finland",
		ImageUrl:         "https://example.com/updated-image.jpg",
		Description:      "An updated serene lake retreat.",
		VisitorsLastYear: 6000,
		IsPrivate:        true,
	}
	requestBody, _ := json.Marshal(updatedDestination)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/destinations/1", bytes.NewBuffer(requestBody))
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestUpdateDestination_NameTooShort(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	mockService := &mocks.MockDestinationService{
		UpdateDestinationFunc: func(id string, destination entities.Destination) (entities.Destination, error) {
			return destination, nil
		},
	}

	destinationHandler := &handlers.DestinationHandler{Service: mockService}
	routes.RegisterDestinationRoutes(router, destinationHandler)

	updatedDestination := entities.Destination{
		Name:             "U",
		Location:         "Updated Finnish Lapland",
		Country:          "Finland",
		ImageUrl:         "https://example.com/updated-image.jpg",
		Description:      "An updated serene lake retreat.",
		VisitorsLastYear: 6000,
		IsPrivate:        true,
	}

	requestBody, _ := json.Marshal(updatedDestination)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/destinations/1", bytes.NewBuffer(requestBody))
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code, "Field name validation failed")
}

func TestUpdateDestination_InvalidImageUrl(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	mockService := &mocks.MockDestinationService{
		UpdateDestinationFunc: func(id string, destination entities.Destination) (entities.Destination, error) {
			return destination, nil
		},
	}

	destinationHandler := &handlers.DestinationHandler{Service: mockService}
	routes.RegisterDestinationRoutes(router, destinationHandler)

	updatedDestination := entities.Destination{
		Name:             "Updated Lake Retreat",
		Location:         "Updated Finnish Lapland",
		Country:          "Finland",
		ImageUrl:         "aaa",
		Description:      "An updated serene lake retreat.",
		VisitorsLastYear: 6000,
		IsPrivate:        true,
	}

	requestBody, _ := json.Marshal(updatedDestination)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/destinations/1", bytes.NewBuffer(requestBody))
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code, "Field imageUrl validation failed")
}
