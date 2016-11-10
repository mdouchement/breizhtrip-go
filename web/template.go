package web

import (
	"html/template"
	"io"

	"github.com/labstack/echo"
)

type Templates struct {
	templates *template.Template
}

var templates *Templates

func init() {
	templates = &Templates{
		templates: template.Must(template.ParseGlob("views/*")),
	}
}

func (t *Templates) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	return t.templates.ExecuteTemplate(w, name, data)
}
