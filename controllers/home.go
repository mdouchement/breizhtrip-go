package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// IndexHome renders BreizhTrip home page
func IndexHome(c *gin.Context) {
	c.HTML(http.StatusOK, "home.index.tmpl", gin.H{
		"title": "BreizhTrip",
	})
}
