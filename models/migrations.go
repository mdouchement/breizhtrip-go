package models

import (
	"bytes"
	"fmt"

	"github.com/jinzhu/gorm"
	"github.com/lib/pq"
	"github.com/mdouchement/breizhtrip-go/config"
)

// AutoMigration migrates all database schemas.
func AutoMigration() {
	config.DB.AutoMigrate(&Heritage{})
}

// CreateDatabase creates the database in Postgres.
func CreateDatabase() error {
	// postgres://username:password@localhost:5432/dbname?sslmode=disable
	var url bytes.Buffer
	url.WriteString("postgres://")
	url.WriteString(config.Cfg.DatabaseUsername)
	url.WriteString(":")
	url.WriteString(config.Cfg.DatabasePassword)
	url.WriteString("@")
	url.WriteString(config.Cfg.DatabaseHost)
	url.WriteString(":")
	url.WriteString(config.Cfg.DatabasePort)
	url.WriteString("/")
	url.WriteString("?sslmode=disable") // FIXME

	db, err := gorm.Open("postgres", url.String())
	if err != nil {
		return err
	}
	db.DB()
	err = db.DB().Ping()
	if err != nil {
		return err
	}

	db.DB().SetMaxIdleConns(10)
	db.DB().SetMaxOpenConns(config.Cfg.DatabasePool)
	// db.LogMode(true)

	query := fmt.Sprintf("CREATE DATABASE %s WITH ENCODING = 'utf8'", config.DatabaseName())
	err = db.Exec(query).Error
	if err != nil {
		if e, ok := err.(*pq.Error); ok {
			if e.Code == "42P04" {
				return nil
			}
		}
	}

	return err
}
