package models

import (
	"time"

	"github.com/satori/go.uuid"
)

// An Heritage is a database record.
type Heritage struct {
	ID        string `gorm:"primary_key;type:uuid"`
	CreatedAt *time.Time
	UpdatedAt *time.Time

	Longitude float64  `gorm:"index"`
	Latitude  float64  `gorm:"index"`
	Address   string   `gorm:"index"`
	Commune   string   `gorm:"index"`
	LieuDit   string   `gorm:"index"`
	Datings   []string `gorm:"index;type:jsonb"`

	Status  string
	Study   string
	StudyAt string
	Names   []string `gorm:"type:jsonb"`
	Phase   string
}

// NewHeritage returns new Heritage with a default id.
func NewHeritage() *Heritage {
	return &Heritage{
		ID: uuid.NewV4().String(),
	}
}
