package controllers

import (
	"net/http"

	"github.com/labstack/echo"
	"github.com/mdouchement/breizhtrip-go/config"
	"github.com/mdouchement/breizhtrip-go/models"
)

type Heritages []*models.Heritage

func NewHeritages() *Heritages {
	return &Heritages{}
}

func (h *Heritages) List(c echo.Context) error {
	if err := config.DB.Find(h).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}
	return c.JSON(http.StatusOK, h)
}

func (h *Heritages) Show(c echo.Context) error {
	heritage := models.NewHeritage(c.Param("id"))
	if err := config.DB.Find(heritage).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}
	return c.JSON(http.StatusOK, heritage)
}
