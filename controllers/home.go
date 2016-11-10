package controllers

import (
	"net/http"

	"github.com/labstack/echo"
)

// IndexHome renders BreizhTrip home page
func IndexHome(c echo.Context) error {
	return c.Render(http.StatusOK, "home.index.tmpl", echo.Map{
		"title": "BreizhTrip",
	})
}
