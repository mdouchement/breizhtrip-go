package web

import (
	"fmt"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
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
		Usage: "Binds server to the specified IP.",
	},
}

func serverAction(context *cli.Context) error {
	engine := EchoEngine()
	printRoutes(engine)

	listen := fmt.Sprintf("%s:%s", context.String("b"), context.String("p"))
	config.Log.Infof("Server listening on %s", listen)
	engine.Start(listen)

	return nil
}

func EchoEngine() *echo.Echo {
	engine := echo.New()
	engine.Use(middleware.Recover())
	engine.Use(middlewares.DefaultEchorus())

	engine.Renderer = templates // views

	router := engine.Group("") // TODO add namespace handler (e.g. /breizhtrip/version)

	router.Static("/public", "public")
	router.GET("/", controllers.IndexHome)
	router.GET("/version", controllers.ShowVersion)
	middlewares.CRUD(router, "/heritages", controllers.NewHeritages())

	return engine
}

func printRoutes(e *echo.Echo) {
	fmt.Println("Routes:")
	for _, route := range e.Routes() {
		fmt.Printf("%6s %s\n", route.Method, route.Path)
	}
}
