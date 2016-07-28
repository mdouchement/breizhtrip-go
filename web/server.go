package web

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/mdouchement/breizhtrip-go/config"
	"github.com/mdouchement/breizhtrip-go/controllers"
	"github.com/mdouchement/breizhtrip-go/web/middlewares"
	"gopkg.in/urfave/cli.v2"
)

var ServerCommand = &cli.Command{
	Name:    "server",
	Aliases: []string{"s"},
	Usage:   "start server",
	Action:  serverAction,
	Flags:   serverFlags,
}

var serverFlags = []cli.Flag{
	&cli.StringFlag{
		Name:  "p, port",
		Usage: "Specify the port to listen to.",
	},
	&cli.StringFlag{
		Name:  "b, binding",
		Usage: "Binds Gin to the specified IP.",
	},
}

func serverAction(context *cli.Context) error {
	engine := GinEngine()

	listen := fmt.Sprintf("%s:%s", context.String("b"), context.String("p"))
	config.Log.Infof("Server listening on %s", listen)
	engine.Run(listen)

	return nil
}

func GinEngine() *gin.Engine {
	engine := gin.New()
	engine.Use(gin.Recovery())
	engine.Use(middlewares.DefaultGinrus())
	engine.Use(middlewares.ParamsConverter())

	router := engine.Group("/")

	router.GET("/version", controllers.ShowVersion)
	// middlewares.CRUD(router, "/system_informations", controllers.NewSystemInformations())
	// middlewares.CRUD(router, "/licenses", controllers.NewLicenses())

	return engine
}
