package config

import (
	"github.com/Sirupsen/logrus"
	prefixer "github.com/x-cray/logrus-prefixed-formatter"
)

// Log is an instance of Logrus logger
var Log = logrus.New()

func init() {
	Log.Formatter = new(prefixer.TextFormatter)
	Log.Level = logrus.InfoLevel
}
