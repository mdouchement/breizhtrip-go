package web

import (
	"fmt"

	"github.com/PredicSis/mp_license_authority_go/config"
	"github.com/PredicSis/mp_license_authority_go/controllers"
	"github.com/gin-gonic/gin"
	"gopkg.in/urfave/cli.v1"
)

var ServerCommand = cli.Command{
	Name:      "server",
	ShortName: "s",
	Usage:     "start server",
	Action:    serverAction,
	Flags:     serverFlags,
}

var serverFlags = []cli.Flag{
	cli.StringFlag{
		Name:  "p, port",
		Usage: "Specify the port to listen to.",
	},
	cli.StringFlag{
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
	// engine.Use(middlewares.Logger())
	// engine.Use(middlewares.ParamsConverter())

	router := engine.Group("/")

	router.GET("/version", controllers.GetVersion)
	// middlewares.CRUD(router, "/system_informations", controllers.NewSystemInformations())
	// middlewares.CRUD(router, "/licenses", controllers.NewLicenses())

	return engine
}
