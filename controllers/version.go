package controllers

import (
	"net/http"

	"github.com/labstack/echo"
	"github.com/mdouchement/breizhtrip-go/config"
)

// ShowVersion renders Risuto veropn
func ShowVersion(c echo.Context) error {
	return c.JSON(http.StatusOK, echo.Map{
		"version": config.Cfg.Version,
	})
}
