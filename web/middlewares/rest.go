package middlewares

import (
	"github.com/gin-gonic/gin"
)

// All of the methods are the same type as HandlerFunc
// if you don't want to support any methods of CRUD, then don't implement it

// CreateSupported interface
type CreateSupported interface {
	Create(*gin.Context)
}

// ListSupported interface
type ListSupported interface {
	List(*gin.Context)
}

// ShowSupported interface
type ShowSupported interface {
	Show(*gin.Context)
}

// UpdateSupported interface
type UpdateSupported interface {
	Update(*gin.Context)
}

// DeleteSupported interface
type DeleteSupported interface {
	Delete(*gin.Context)
}

// CRUD defines the folowwing resources:
//   POST:   /path
//   GET:    /path
//   GET:    /path/:id
//   PATCH:  /path/:id
//   DEL:    /path/:id
func CRUD(group *gin.RouterGroup, path string, resource interface{}) {
	if resource, ok := resource.(CreateSupported); ok {
		group.POST(path, resource.Create)
	}
	if resource, ok := resource.(ListSupported); ok {
		group.GET(path, resource.List)
	}
	if resource, ok := resource.(ShowSupported); ok {
		group.GET(path+"/:id", resource.Show)
	}
	if resource, ok := resource.(UpdateSupported); ok {
		group.PATCH(path+"/:id", resource.Update)
	}
	if resource, ok := resource.(DeleteSupported); ok {
		group.DELETE(path+"/:id", resource.Delete)
	}
}
