package middlewares

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"

	"github.com/gin-gonic/gin"
)

// ParamsConverter instances a ParamsConverter middleware that will convert JSOn body parameters into gin.Params
// Must be used after logger middleware:
//   engine.Use(middlewares.Logger())
//   engine.Use(middlewares.ParamsConverter())
func ParamsConverter() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Handles `/path?query1=1&query2=2`
		for k, v := range c.Request.URL.Query() {
			c.Set(k, v[0])
		}

		// Pre-handles JSON body parameters
		body := &bytes.Buffer{}
		if c.ContentType() == gin.MIMEJSON && c.Request.Header.Get("Content-Length") != "" {
			c.Request.Body = newTeeReadCloser(c.Request.Body, body)
		}

		c.Next()

		// Handles JSON body parameters
		if body.Len() > 0 {
			var params map[string]interface{}
			if err := json.Unmarshal(body.Bytes(), &params); err != nil {
				c.Error(fmt.Errorf("ParamsConverter: %v", err))
				return
			}

			for k, v := range params {
				c.Set(k, v)
			}
		}
	}
}

// http.Request.Body interceptor

type teeReadCloser struct {
	r io.Reader
	w io.Writer
	c io.Closer
}

func newTeeReadCloser(r io.ReadCloser, w io.Writer) io.ReadCloser {
	return &teeReadCloser{io.TeeReader(r, w), w, r}
}

// Read implements io.Reader
func (t *teeReadCloser) Read(b []byte) (int, error) {
	return t.r.Read(b)
}

// Close attempts to close the reader and write. It returns an error if both
// failed to Close.
func (t *teeReadCloser) Close() error {
	return t.c.Close()
}
