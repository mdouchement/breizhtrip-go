package imports

import (
	"bufio"
	"encoding/csv"
	"io"
	"os"
	"strconv"
	"strings"

	"github.com/mdouchement/breizhtrip-go/config"
	"github.com/mdouchement/breizhtrip-go/models"

	cli "gopkg.in/urfave/cli.v2"
)

var Command = &cli.Command{
	Name:    "import",
	Aliases: []string{"i"},
	Usage:   "import dataset",
	Action:  action,
	Flags:   flags,
}

var flags = []cli.Flag{
	&cli.StringFlag{
		Name:  "i, input",
		Usage: "Specify the path of the dataset",
	},
}

func action(context *cli.Context) error {
	path := context.String("i")
	if path == "" {
		cli.ShowCommandHelp(context, "import")
		return nil
	}

	f, err := os.Open(path)
	if err != nil {
		return err
	}

	r := csv.NewReader(bufio.NewReader(f))
	r.Comma = ','

	header := make(map[string]int)

	hasReadHeader := false
	for {
		record, err := r.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return err
		}

		if !hasReadHeader {
			for index, field := range record {
				header[field] = index
			}
			hasReadHeader = true
		} else {
			h := models.NewHeritage()
			h.Longitude, _ = strconv.ParseFloat(record[header["longitude"]], 64) // ignore error
			h.Latitude, _ = strconv.ParseFloat(record[header["latitude"]], 64)   // ignore error
			h.Addresses = models.NewStringSlice(splitFlatArray(record[header["adresses"]])...)
			h.Commune = record[header["commune"]]
			h.LieuDit = record[header["lieu_dit"]]
			h.Datings = models.NewStringSlice(record[header["datings"]])
			h.Status = record[header["status"]]
			h.Study = record[header["study"]]
			h.StudiedAt = record[header["studied_at"]]
			h.Names = models.NewStringSlice(splitFlatArray(record[header["names"]])...)
			h.Phase = record[header["phase"]]
			h.Description = record[header["description"]]
			h.Photos = models.NewStringSlice(splitFlatArray(record[header["photos"]])...)

			if err := config.DB.Create(h).Error; err != nil {
				return err
			}
		}
	}
	return nil
}

func splitFlatArray(s string) []string {
	names := strings.Split(s, "|")
	for i, name := range names {
		names[i] = strings.Trim(name, " ")
	}
	return names
}
