Oskari.registerLocalization(
{
    "lang": "fi",
    "key": "Printout",
    "value": {
        "title": "Tulostus",
        "flyouttitle": "Tulostus",
        "desc": "",
        "btnTooltip": "Tulosta nykyinen karttanäkymä png-kuvaksi tai pdf-tiedostoon.",
        "BasicView": {
            "title": "Tulosta karttanäkymä",
            "size": {
                "label": "Koko ja suunta",
                "tooltip": "Valitse tulosteen arkkikoko ja suunta. Tarkista muutokset esikatselukuvasta.",
                "options": {
                    "A4": "A4 pystysuunta",
                    "A4_Landscape": "A4 vaakasuunta",
                    "A3": "A3 pystysuunta",
                    "A3_Landscape": "A3 vaakasuunta"
                }
            },
            "preview": {
                "label": "Esikatselu",
                "pending": "Esikatselukuva päivitetään hetken kuluttua.",
                "notes": {
                    "extent": "Tarkista tulosteen kattavuusalue esikatselukuvasta."
                }
            },
            "buttons": {
                "save": "Tulosta",
                "cancel": "Peruuta"
            },
            "settings": {
                "label": "Lisäasetukset",
                "tooltip": "Valitse asetukset karttatulosteelle."
            },
            "format": {
                "label": "Tiedostomuoto",
                "tooltip": "Valitse tiedostomuoto, jossa haluat tulosteen.",
                "options": {
                    "png": "PNG-kuva",
                    "pdf": "PDF-dokumentti"
                }
            },
            "content": {
                "label": "Näytettävät tiedot",
                "tooltip": "Valitse tulosteessa näytettävät tiedot.",
                "pngNote": "PNG-tulosteelle ei lisätä alla olevia tietoja.",
                "mapTitle": {
                    "placeholder": "Otsikko"
                },
                "pageLogo": {
                    "label": "Näytä palvelun logo",
                    "tooltip": "Näytä tulosteessa tämän palvelun logo."
                },
                "pageScale": {
                    "label": "Näytä mittakaava",
                    "tooltip": "Näytä tulosteessa kartan mittakaava."
                },
                "pageDate": {
                    "label": "Näytä päivämäärä",
                    "tooltip": "Näytä tulosteessa sen laatimispäivämäärä."
                },
                "pageTimeSeriesTime": {
                    "label": "Näytä aikasarjan ajanhetki",
                    "tooltip": "Näytä tulosteessa aikasarjan ajanhetki.",
                    "printLabel": "Aikasarjan ajanhetki"
                }
            },
            "help": "Ohje",
            "error": {
                "title": "Virhe",
                "nohelp": "Ohjetta ei löytynyt.",
                "saveFailed": "Tulostus epäonnistui."
            },
            "scale": {
                "label": "Mittakaava",
                "tooltip": "Määritä tulostuksessa käytettävä mittakaava",
                "map": "Käytä kartan mittakaavaa",
                "configured": "Valitse mittakaava",
                "unsupportedLayersMessage": "Seuraavat tasot eivät tulostu mittakaava valinnalla",
                "unsupportedLayersTitle": "Tulosteessa ei näy kaikki tasot"
            }
        },
        "StartView": {
            "text": "Tulosta karttanäkymä tiedostoon. Tiedosto voi olla joko PNG-kuva tai PDF-tiedosto.",
            "info": {
                "maxLayers": "Tulosteessa voi olla enintään kahdeksan karttatasoa.",
                "printoutProcessingTime": "Tulostus voi kestää hetken, jos valittuna on useita karttatasoja."
            },
            "buttons": {
                "continue": "Jatka",
                "cancel": "Peruuta"
            }
        }
    }
});
