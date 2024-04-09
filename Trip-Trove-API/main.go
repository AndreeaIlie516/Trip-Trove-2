package main

import (
	"Trip-Trove-API/domain/services"
	"Trip-Trove-API/infrastructure/dataaccess"
	"Trip-Trove-API/infrastructure/middlewares"
	"Trip-Trove-API/presentation/handlers"
	"Trip-Trove-API/routes"
	"github.com/gin-gonic/gin"
	"github.com/jaswdr/faker"
	"log"
)

func main() {
	router := gin.Default()
	router.Use(middlewares.CORSMiddleware())

	destinationRepository := dataaccess.NewInMemoryDestinationRepository()

	destinationService := services.DestinationService{Repo: destinationRepository}
	f := faker.New()
	for i := 0; i < 20; i++ {
		_, err := destinationService.GenerateFakeDestination(f)
		if err != nil {
			panic("Failed to generate fake destinations")
		}
	}

	destinationHandler := handlers.DestinationHandler{Service: &destinationService}

	routes.RegisterDestinationRoutes(router, &destinationHandler)

	err := router.Run("localhost:3000")
	if err != nil {
		log.Fatalf("Failed to run server: %v", err)
		return
	}
}
