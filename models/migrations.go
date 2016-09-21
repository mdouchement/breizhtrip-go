package models

import "github.com/mdouchement/breizhtrip-go/config"

func AutoMigration() {
	config.DB.AutoMigrate(&Heritage{})
}
