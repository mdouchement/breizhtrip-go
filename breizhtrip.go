package main

import (
	"os"

	"github.com/PredicSis/mp_license_authority_go/config"
	"github.com/PredicSis/mp_license_authority_go/web"
	"gopkg.in/urfave/cli.v1"
)

var app *cli.App

func init() {
	app = cli.NewApp()
	app.Name = "BreizhTrip"
	app.Version = config.Cfg.Version
	app.Usage = ""

	app.Commands = []cli.Command{
		web.ServerCommand,
	}
}

func main() {
	err := app.Run(os.Args)
	if err != nil {
		println(err)
	}
}
