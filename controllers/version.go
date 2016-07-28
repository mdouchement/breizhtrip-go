package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mdouchement/breizhtrip-go/config"
)

// ShowVersion renders Risuto veropn
func ShowVersion(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"version": config.Cfg.Version,
	})
}
