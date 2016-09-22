# BreizhTrip

Carte interactive pour découvrir le patrimoine breton recensé
Interactive map to discover listed breton heritage

![Desc](https://github.com/mdouchement/breizhtrip/blob/master/screencapture.png)


## Requirements

- Golang 1.6.x

## Installation

```bash
$ go get github.com/Masterminds/glide
$ glide install
```

## Usage

- **development**

```bash
$ go run breizhtrip.go server -p 5000

# Before pushing to Github
$ find . -name '*.go' -not -path './vendor*' -exec go fmt {} \;
```

> Environment variables https://github.com/mdouchement/breizhtrip-go/blob/master/config/config.go

## Import data to database

You need to have a database name:
* "breizhtrip_development" or
* "reizhtrip_production" or
* "breizhtrip_test"


```bash
$ go run breizhtrip.go import -i /path/to/your/file.tsv
```

The TSV must include these columns header:
* longitude
* latitude
* adresse
* commune
* lieu_dit
* datations_principales
* datations_secondaires
* statut
* cadre_etude
* date_enquete
* denomination
* phase

## License

MIT. See the [LICENSE](https://github.com/mdouchement/breizhtrip-go/blob/master/LICENSE) for more details.

## Contributing

1. Fork it
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Ensure specs and Rubocop pass
5. Push to the branch (git push origin my-new-feature)
6. Create new Pull Request
