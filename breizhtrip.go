package main

import (
	"fmt"
	"os"

	"github.com/mdouchement/breizhtrip-go/config"
	"github.com/mdouchement/breizhtrip-go/imports"
	"github.com/mdouchement/breizhtrip-go/models"
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
		imports.Command,
	}
}

func main() {
	if err := models.CreateDatabase(); err != nil {
		fmt.Println(err)
		return
	}
	config.InitDB()
	models.AutoMigration()

	if err := app.Run(os.Args); err != nil {
		fmt.Println(err)
	}
}
