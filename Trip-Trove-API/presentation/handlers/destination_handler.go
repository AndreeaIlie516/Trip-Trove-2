package handlers

import (
	"Trip-Trove-API/domain/entities"
	"Trip-Trove-API/domain/services"
	"Trip-Trove-API/utils"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"net/http"
)

type DestinationHandler struct {
	Service services.IDestinationService
}

func (handler *DestinationHandler) AllDestinations(c *gin.Context) {
	destinations, err := handler.Service.AllDestinations()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch destinations"})
		return
	}
	c.JSON(http.StatusOK, destinations)
}

func (handler *DestinationHandler) DestinationByID(c *gin.Context) {
	id := c.Param("id")
	destination, err := handler.Service.DestinationByID(id)
	if err != nil {
		if err.Error() == "invalid ID format" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid ID format"})
		} else {
			c.JSON(http.StatusNotFound, gin.H{"error": "destination not found"})
		}
		return
	}
	c.JSON(http.StatusOK, destination)
}

func (handler *DestinationHandler) CreateDestination(c *gin.Context) {
	var newDestination entities.Destination

	if err := c.BindJSON(&newDestination); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	validate := validator.New()

	err := validate.RegisterValidation("name", utils.NameValidator)
	if err != nil {
		return
	}
	err = validate.RegisterValidation("location", utils.LocationValidator)
	if err != nil {
		return
	}
	err = validate.RegisterValidation("country", utils.CountryValidator)
	if err != nil {
		return
	}
	err = validate.RegisterValidation("description", utils.DescriptionValidator)
	if err != nil {
		return
	}

	if err := validate.Struct(newDestination); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	destination, err := handler.Service.CreateDestination(newDestination)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create destination"})
		return
	}

	c.JSON(http.StatusCreated, destination)
}

func (handler *DestinationHandler) DeleteDestination(c *gin.Context) {
	id := c.Param("id")

	destination, err := handler.Service.DeleteDestination(id)

	if err != nil {
		if err.Error() == "invalid ID format" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid ID format"})
		} else {
			c.JSON(http.StatusNotFound, gin.H{"error": "destination not found"})
		}
		return
	}

	c.JSON(http.StatusOK, destination)
}

func (handler *DestinationHandler) UpdateDestination(c *gin.Context) {
	id := c.Param("id")

	var updatedDestination entities.Destination

	if err := c.BindJSON(&updatedDestination); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	validate := validator.New()

	err := validate.RegisterValidation("name", utils.NameValidator)
	if err != nil {
		return
	}
	err = validate.RegisterValidation("location", utils.LocationValidator)
	if err != nil {
		return
	}
	err = validate.RegisterValidation("country", utils.CountryValidator)
	if err != nil {
		return
	}
	err = validate.RegisterValidation("description", utils.DescriptionValidator)
	if err != nil {
		return
	}

	if err := validate.Struct(&updatedDestination); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	destination, err := handler.Service.UpdateDestination(id, updatedDestination)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update destination"})
		return
	}

	c.JSON(http.StatusOK, destination)
}
