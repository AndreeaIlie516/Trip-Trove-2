package handlers

import (
	"Trip-Trove-API/domain/entities"
	"Trip-Trove-API/presentation/handlers"
	"Trip-Trove-API/routes"
	"Trip-Trove-API/tests/mocks"
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCreateDestination_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	mockService := &mocks.MockDestinationService{
		CreateDestinationFunc: func(destination entities.Destination) (entities.Destination, error) {
			destination.ID = 1
			return destination, nil
		},
	}

	destinationHandler := &handlers.DestinationHandler{Service: mockService}
	routes.RegisterDestinationRoutes(router, destinationHandler)

	newDestination := entities.Destination{
		Name:             "Lake Retreat",
		Location:         "Finnish Lapland",
		Country:          "Finland",
		ImageUrl:         "https://aventurescu.ro/wp-content/uploads/2021/10/madeira-8-1078x516.jpg",
		Description:      "A serene lake retreat.",
		VisitorsLastYear: 5000,
		IsPrivate:        false,
	}
	requestBody, _ := json.Marshal(newDestination)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/destinations/", bytes.NewBuffer(requestBody))
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	var returnedDestination entities.Destination
	err := json.Unmarshal(w.Body.Bytes(), &returnedDestination)
	assert.NoError(t, err)
	assert.Equal(t, newDestination.Name, returnedDestination.Name)
}

func TestCreateDestination_NameTooShort(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	mockService := &mocks.MockDestinationService{
		CreateDestinationFunc: func(destination entities.Destination) (entities.Destination, error) {
			destination.ID = 1
			return destination, nil
		},
	}

	destinationHandler := &handlers.DestinationHandler{Service: mockService}
	routes.RegisterDestinationRoutes(router, destinationHandler)

	newDestination := entities.Destination{
		Name:             "L",
		Location:         "Finnish Lapland",
		Country:          "Finland",
		ImageUrl:         "https://aventurescu.ro/wp-content/uploads/2021/10/madeira-8-1078x516.jpg",
		Description:      "A serene lake retreat.",
		VisitorsLastYear: 5000,
		IsPrivate:        false,
	}
	requestBody, _ := json.Marshal(newDestination)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/destinations/", bytes.NewBuffer(requestBody))
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code, fmt.Sprintf("Field %s validation failed", "name"))
}

func TestCreateDestination_NameInvalidChars(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	mockService := &mocks.MockDestinationService{
		CreateDestinationFunc: func(destination entities.Destination) (entities.Destination, error) {
			destination.ID = 1
			return destination, nil
		},
	}

	destinationHandler := &handlers.DestinationHandler{Service: mockService}
	routes.RegisterDestinationRoutes(router, destinationHandler)

	newDestination := entities.Destination{
		Name:             "Lapland ^&%",
		Location:         "Finnish Lapland",
		Country:          "Finland",
		ImageUrl:         "https://aventurescu.ro/wp-content/uploads/2021/10/madeira-8-1078x516.jpg",
		Description:      "A serene lake retreat.",
		VisitorsLastYear: 5000,
		IsPrivate:        false,
	}
	requestBody, _ := json.Marshal(newDestination)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/destinations/", bytes.NewBuffer(requestBody))
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code, fmt.Sprintf("Field %s validation failed", "name"))
}

func TestCreateDestination_DescriptionTooShort(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	mockService := &mocks.MockDestinationService{
		CreateDestinationFunc: func(destination entities.Destination) (entities.Destination, error) {
			destination.ID = 1
			return destination, nil
		},
	}

	destinationHandler := &handlers.DestinationHandler{Service: mockService}
	routes.RegisterDestinationRoutes(router, destinationHandler)

	newDestination := entities.Destination{
		Name:             "Lapland ^&%",
		Location:         "Finnish Lapland",
		Country:          "Finland",
		ImageUrl:         "https://aventurescu.ro/wp-content/uploads/2021/10/madeira-8-1078x516.jpg",
		Description:      "Short",
		VisitorsLastYear: 5000,
		IsPrivate:        false,
	}
	requestBody, _ := json.Marshal(newDestination)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/destinations/", bytes.NewBuffer(requestBody))
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code, fmt.Sprintf("Field %s validation failed", "description"))
}

func TestCreateDestination_VisitorsLastYearNegative(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	mockService := &mocks.MockDestinationService{
		CreateDestinationFunc: func(destination entities.Destination) (entities.Destination, error) {
			destination.ID = 1
			return destination, nil
		},
	}

	destinationHandler := &handlers.DestinationHandler{Service: mockService}
	routes.RegisterDestinationRoutes(router, destinationHandler)

	newDestination := entities.Destination{
		Name:             "Lapland ^&%",
		Location:         "Finnish Lapland",
		Country:          "Finland",
		ImageUrl:         "https://aventurescu.ro/wp-content/uploads/2021/10/madeira-8-1078x516.jpg",
		Description:      "Short",
		VisitorsLastYear: -1,
		IsPrivate:        false,
	}
	requestBody, _ := json.Marshal(newDestination)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/destinations/", bytes.NewBuffer(requestBody))
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code, fmt.Sprintf("Field %s validation failed", "visitorsLastYear"))
}

func TestCreateDestination_InvalidImageUrl(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	mockService := &mocks.MockDestinationService{
		CreateDestinationFunc: func(destination entities.Destination) (entities.Destination, error) {
			destination.ID = 1
			return destination, nil
		},
	}

	destinationHandler := &handlers.DestinationHandler{Service: mockService}
	routes.RegisterDestinationRoutes(router, destinationHandler)

	newDestination := entities.Destination{
		Name:             "Lapland ^&%",
		Location:         "Finnish Lapland",
		Country:          "Finland",
		ImageUrl:         "aaaa",
		Description:      "Short",
		VisitorsLastYear: 5000,
		IsPrivate:        false,
	}
	requestBody, _ := json.Marshal(newDestination)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/destinations/", bytes.NewBuffer(requestBody))
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code, fmt.Sprintf("Field %s validation failed", "imageUrl"))
}
