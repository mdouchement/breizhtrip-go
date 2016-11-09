package middlewares

import (
	"encoding/json"
	"time"

	"github.com/Sirupsen/logrus"
	"github.com/labstack/echo"
	"github.com/mdouchement/breizhtrip-go/config"
)

var (
	green   = string([]byte{27, 91, 57, 55, 59, 52, 50, 109})
	white   = string([]byte{27, 91, 57, 48, 59, 52, 55, 109})
	yellow  = string([]byte{27, 91, 57, 55, 59, 52, 51, 109})
	red     = string([]byte{27, 91, 57, 55, 59, 52, 49, 109})
	blue    = string([]byte{27, 91, 57, 55, 59, 52, 52, 109})
	magenta = string([]byte{27, 91, 57, 55, 59, 52, 53, 109})
	cyan    = string([]byte{27, 91, 57, 55, 59, 52, 54, 109})
	reset   = string([]byte{27, 91, 48, 109})
)

func DefaultEchorus() echo.MiddlewareFunc {
	return Echorus(config.Log)
}

func Echorus(logger *logrus.Logger) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) (err error) {
			req := c.Request()
			res := c.Response()
			start := time.Now()
			path := req.URL.Path

			if err = next(c); err != nil {
				c.Error(err)
			}

			end := time.Now()
			latency := end.Sub(start)

			clientIP := c.RealIP()
			method := req.Method
			statusCode := res.Status
			statusColor := colorForStatus(statusCode)
			methodColor := colorForMethod(method)
			comment := ""

			keys := make(map[string]interface{}, len(c.ParamNames()))
			for _, pname := range c.ParamNames() {
				keys[pname] = c.Param(pname)
			}
			queries := c.QueryParams()
			for qname, _ := range queries {
				keys[qname] = queries.Get(qname)
			}

			params, err := json.Marshal(keys)
			if err != nil {
				params = []byte("Ignored error during parameters parsing")
			}
			if len(keys) == 0 {
				params = []byte{}
			}

			logger.Infof("[Echo] |%s %3d %s| %13v | %s |%s  %s %-7s %s %s %s",
				statusColor, statusCode, reset,
				latency,
				clientIP,
				methodColor, reset, method,
				path,
				params,
				comment,
			)
			return
		}
	}
}

func colorForStatus(code int) string {
	switch {
	case code >= 200 && code < 300:
		return green
	case code >= 300 && code < 400:
		return white
	case code >= 400 && code < 500:
		return yellow
	default:
		return red
	}
}

func colorForMethod(method string) string {
	switch method {
	case "GET":
		return blue
	case "POST":
		return cyan
	case "PUT":
		return yellow
	case "DELETE":
		return red
	case "PATCH":
		return green
	case "HEAD":
		return magenta
	case "OPTIONS":
		return white
	default:
		return reset
	}
}
