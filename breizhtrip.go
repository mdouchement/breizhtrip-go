package main

import (
	"os"

	"github.com/mdouchement/breizhtrip-go/config"
	"github.com/mdouchement/breizhtrip-go/web"
	"gopkg.in/urfave/cli.v2"
)

var app *cli.App

func init() {
	app = &cli.App{}
	app.Name = "BreizhTrip"
	app.Version = config.Cfg.Version
	app.Usage = ""

	app.Commands = []*cli.Command{
		web.ServerCommand,
	}
}

func main() {
	err := app.Run(os.Args)
	if err != nil {
		println(err)
	}
}
