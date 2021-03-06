package config

import (
	"bytes"
	"os/exec"

	"github.com/caarlos0/env"
)

var Cfg *Config

// Config holds all configuration for our program
type Config struct {
	Version string `env:"APP_VERSION"`

	DatabasePool     int    `env:"BREIZHTRIP_DATABASE_POOL" envDefault:"20"`
	DatabaseHost     string `env:"BREIZHTRIP_DATABASE_HOST" envDefault:"localhost"`
	DatabasePort     string `env:"BREIZHTRIP_DATABASE_PORT" envDefault:"5432"`
	DatabaseUsername string `env:"BREIZHTRIP_DATABASE_USERNAME" envDefault:"postgres"`
	DatabasePassword string `env:"BREIZHTRIP_DATABASE_PASSWORD" envDefault:"postgres"`
}

func init() {
	Cfg = &Config{}
	env.Parse(Cfg)

	if Cfg.Version == "" {
		Cfg.Version = version()
	}
}

func version() string {
	var version bytes.Buffer
	tag, _ := exec.Command("sh", "-c", "git describe --abbrev=0 --tags 2> /dev/null").Output()
	branch, _ := exec.Command("git", "symbolic-ref", "-q", "--short", "HEAD").Output()
	commit, _ := exec.Command("git", "rev-parse", "--short", "HEAD").Output()
	version.Write(tag)
	version.WriteString("-")
	version.Write(branch)
	version.WriteString("-")
	version.Write(commit)
	return string(bytes.Replace(version.Bytes(), []byte("\n"), []byte{}, -1))
}

func check(err error) {
	if err != nil {
		panic(err)
	}
}
