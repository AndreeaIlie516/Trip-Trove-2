package main

import (
	"Trip-Trove-API/domain/services"
	"Trip-Trove-API/infrastructure/dataaccess"
	"Trip-Trove-API/presentation/handlers"
	"Trip-Trove-API/routes"
	"github.com/gin-gonic/gin"
	"log"
)

func main() {
	router := gin.Default()

	destinationRepository := dataaccess.NewInMemoryDestinationRepository()

	destinationService := services.DestinationService{Repo: destinationRepository}

	destinationHandler := handlers.DestinationHandler{Service: &destinationService}

	routes.RegisterDestinationRoutes(router, &destinationHandler)

	err := router.Run("localhost:3000")
	if err != nil {
		log.Fatalf("Failed to run server: %v", err)
		return
	}
}
