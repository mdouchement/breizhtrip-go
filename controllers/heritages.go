package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mdouchement/breizhtrip-go/config"
	"github.com/mdouchement/breizhtrip-go/models"
)

type Heritages []*models.Heritage

func NewHeritages() *Heritages {
	return &Heritages{}
}

func (h *Heritages) List(c *gin.Context) {
	if err := config.DB.Find(h).Error; err != nil {
		c.JSON(http.StatusInternalServerError, c.Error(err))
		return
	}
	c.JSON(http.StatusOK, h)
}

func (h *Heritages) Show(c *gin.Context) {
	heritage := models.NewHeritage(c.Param("id"))
	if err := config.DB.Find(heritage).Error; err != nil {
		c.JSON(http.StatusInternalServerError, c.Error(err))
		return
	}
	c.JSON(http.StatusOK, heritage)
}
