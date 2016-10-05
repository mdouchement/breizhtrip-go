package config

import (
	"bytes"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

// DB is the connection pool of Postgres database
var DB *gorm.DB

func InitDB() {
	// postgres://username:password@localhost:5432/dbname?sslmode=disable
	var url bytes.Buffer
	url.WriteString("postgres://")
	url.WriteString(Cfg.DatabaseUsername)
	url.WriteString(":")
	url.WriteString(Cfg.DatabasePassword)
	url.WriteString("@")
	url.WriteString(Cfg.DatabaseHost)
	url.WriteString(":")
	url.WriteString(Cfg.DatabasePort)
	url.WriteString("/")
	url.WriteString(DatabaseName())
	url.WriteString("?sslmode=disable") // FIXME

	if gin.Mode() != gin.ReleaseMode {
		Log.Info("database:", url.String())
	}

	db, err := gorm.Open("postgres", url.String())
	check(err)

	// Get database connection handle [*sql.DB](http://golang.org/pkg/database/sql/#DB)
	db.DB()

	// Then you could invoke `*sql.DB`'s functions with it
	err = db.DB().Ping()
	check(err)
	db.DB().SetMaxIdleConns(10)
	db.DB().SetMaxOpenConns(Cfg.DatabasePool)

	// Enables SQL queries logging
	// db.LogMode(true)

	DB = db
}

func DatabaseName() string {
	switch gin.Mode() {
	case gin.ReleaseMode:
		return "breizhtrip_production"
	case gin.TestMode:
		return "breizhtrip_test"
	default:
		return "breizhtrip_development"
	}
}
