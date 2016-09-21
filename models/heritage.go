package models

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"time"

	"github.com/satori/go.uuid"
)

// An Heritage is a database record.
type Heritage struct {
	ID        string     `gorm:"primary_key;type:uuid" json:"id"`
	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`

	Longitude float64      `json:"longitude" gorm:"index"`
	Latitude  float64      `json:"latitude" gorm:"index"`
	Address   string       `json:"address" gorm:"index"`
	Commune   string       `json:"commune" gorm:"index"`
	LieuDit   string       `json:"lieu_dit" gorm:"index"`
	Datings   *StringSlice `json:"datings" gorm:"index;type:jsonb"`

	Status  string       `json:"status"`
	Study   string       `json:"study"`
	StudyAt string       `json:"study_at"`
	Names   *StringSlice `json:"names" gorm:"type:jsonb"`
	Phase   string       `json:"phase"`
}

// NewHeritage returns new Heritage with a default id.
func NewHeritage(id ...string) *Heritage {
	switch len(id) {
	case 0:
		return &Heritage{
			ID: uuid.NewV4().String(),
		}
	case 1:
		return &Heritage{
			ID: id[0],
		}
	default:
		panic(fmt.Errorf("Heritage: Invalid number of arguments %d for 0..1", len(id)))
	}
}

//---------------------//
// Datatypes           //
//---------------------//

// A StringSlice is a []string with marshalization methods
type StringSlice []string

// NewStringSlice returns a StringSlice eventually initialized with the given args.
func NewStringSlice(args ...string) *StringSlice {
	s := make(StringSlice, 0)
	for _, arg := range args {
		s = append(s, arg)
	}
	return &s
}

// Value serializes a StringSlice
func (f *StringSlice) Value() (driver.Value, error) {
	return json.Marshal(f)
}

// Scan unserializes a StringSlice
func (f *StringSlice) Scan(input interface{}) error {
	return json.Unmarshal(input.([]byte), f)
}
