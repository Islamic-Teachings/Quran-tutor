package main

import (
	"github.com/Islamic-Teachings/Quran-tutor/socket"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

func main() {
	// Set the router as the default one shipped with Gin
	router := gin.Default()
	s := socket.NewSocket("")
	// Serve frontend static files
	router.Use(static.Serve("/", static.LocalFile("./app/build", true)))

	// Setup route group for the API
	ws := router.Group("/ws")
	{
		ws.GET("/*proxypath", func(c *gin.Context) {
			s.Wshandler(c.Writer, c.Request)
		})
	}

	router.NoRoute(func(c *gin.Context) {
		c.File("./app/build/index.html")
	})

	// Start and run the server
	router.Run(":5000")
}
