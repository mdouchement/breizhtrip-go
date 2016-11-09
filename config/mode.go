package config

import (
	"fmt"
	"os"
)

const (
	EnvironmentVariableName = "ECHO_ENV"
	Development             = "development"
	Test                    = "test"
	Production              = "production"
)

var envMode = Development

func init() {
	if e := os.Getenv(EnvironmentVariableName); e != "" {
		switch e {
		case Development, Test, Production:
			envMode = e
		default:
			panic(fmt.Sprintf("Bad %s value: %s", EnvironmentVariableName, e))
		}
	}
}

func Env() string {
	return envMode
}

func SetEnv(environment string) {
	envMode = environment
}
