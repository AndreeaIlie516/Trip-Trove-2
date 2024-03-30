package main

import (
	"Trip-Trove-API/database"
	"Trip-Trove-API/domain/entities"
	"Trip-Trove-API/domain/services"
	"Trip-Trove-API/infrastructure/dataaccess"
	"Trip-Trove-API/infrastructure/middlewares"
	"Trip-Trove-API/presentation/handlers"
	"Trip-Trove-API/routes"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
)

func main() {
	router := gin.Default()
	
	router.Use(middlewares.CORSMiddleware())

	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	db := database.ConnectDB()

	entitiesToMigrate := []interface{}{
		&entities.Destination{},
	}

	for _, entity := range entitiesToMigrate {
		err := db.AutoMigrate(entity)
		if err != nil {
			log.Fatalf("Failed to migrate database: %v", err)
		}
	}

	destinationRepository := dataaccess.NewGormDestinationRepository(db)
	destinationService := services.DestinationService{Repo: destinationRepository}

	destinationHandler := handlers.DestinationHandler{Service: &destinationService}

	routes.RegisterDestinationRoutes(router, &destinationHandler)

	err := router.Run("localhost:3000")
	if err != nil {
		log.Fatalf("Failed to run server: %v", err)
		return
	}
}
