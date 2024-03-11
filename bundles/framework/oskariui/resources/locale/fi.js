Oskari.registerLocalization({
    lang: 'fi',
    key: 'oskariui',
    value: {
        buttons: {
            add: 'Lisää',
            cancel: 'Peruuta',
            close: 'Sulje',
            delete: 'Poista',
            edit: 'Muokkaa',
            save: 'Tallenna',
            submit: 'Lähetä',
            import: 'Tuo',
            yes: 'Kyllä',
            no: 'Ei',
            next: 'Seuraava',
            previous: 'Edellinen',
            print: 'Tulosta',
            search: 'Etsi',
            reset: 'Tyhjennä',
            copy: 'Kopioi leikepöydälle',
            clear: 'Tyhjennä',
            accept: 'Hyväksy',
            reject: 'Hylkää',
            info: 'Näytä lisätietoa'
        },
        messages: {
            confirm: 'Haluatko varmasti jatkaa?',
            confirmDelete: 'Haluatko varmasti poistaa?',
            copied: 'Kopioitu'
        },
        error: {
            generic: 'Tapahtui odottamaton virhe'
        },
        table: {
            sort: {
                desc: 'Lajittele laskevasti',
                asc: 'Lajittele nousevasti',
                cancel: 'Peruuta lajittelu'
            },
            emptyText: 'Ei tietoja.'
        },
        ColorPicker: {
            tooltip: 'Valitse väri',
            moreColors: 'Enemmän värejä'
        },
        StyleEditor: {
            subheaders: {
                styleFormat: 'Geometriatyyppi',
                name: 'Tyylin nimi',
                style: 'Esitystapa',
                pointTab: 'Piste',
                lineTab: 'Viiva',
                areaTab: 'Alue'
            },
            tooltips: {
                transparent: 'Ei täyttöväriä',
                solid: 'Peittävä täyttöväri',
                thin_diagonal: 'Ohut vinottainen raita',
                thick_diagonal:'Paksu vinottainen raita',
                thin_horizontal: 'Ohut vaakaraita',
                thick_horizontal: 'Paksu vaakaraita'
            },
            fill: {
                color: 'Täyttöväri',
                area: {
                    pattern: 'Täyttökuvio'
                }
            },
            image: {
                shape: 'Symboli',
                size: 'Koko',
                fill: {
                    color: 'Väri'
                }
            },
            stroke: {
                color: 'Väri',
                lineCap: 'Päädyt',
                lineDash: 'Tyyli',
                lineJoin: 'Kulmat',
                width: 'Leveys',
                area: {
                    color: 'Väri',
                    lineDash: 'Tyyli',
                    lineJoin: 'Kulmat',
                    width: 'Viivan paksuus'
                }
            }
        },
        FileInput: {
            drag: 'Raahaa {maxCount, plural, one {tiedosto} other {tiedostot}} tähän tai valitse selaamalla.',
            noFiles: 'Ei tiedostoja.',
            error: {
                invalidType: 'Tiedostomuoto ei ole sallittu.',
                allowedExtensions: 'Sallitut tiedostopäätteet: {allowedExtensions}.',
                multipleNotAllowed: 'Anna vain yksi tiedosto.',
                fileSize: 'Tiedoston koko on liian suuri. Suurin sallittu koko yksittäiselle tiedostolle on {maxSize, number} Mt.'
            }
        },
        LocalizationComponent: {
            otherLanguages: 'Muut kielet',
            othersTip: 'Käännökset näytetään käytettäessä palvelua eri kielillä',
            locale: {
                generic: 'kielellä ({0})',
                fi: 'suomeksi',
                en: 'englanniksi',
                sv: 'ruotsiksi'
            }
        },
        Spin: {
            loading: 'Ladataan...'
        },
        FeatureFilter: {
            single: 'Yksi ominaisuus',
            and: 'AND-operaattori',
            or: 'OR-operaattori',
            range: {
                true: 'Älä käytä arvoaluetta',
                false: 'Käytä arvoaluetta'
            },
            addTooltip: 'Lisää suodattimeen uusi rivi',
            clearTooltip: 'Tyhjennä suodatin',
            caseSensitive: {
                true: 'Kirjainkoko vaikuttaa',
                false: 'Kirjainkoko ei vaikuta'
            },
            operators: {
                value: 'on',
                in: 'jokin',
                notIn: 'ei mikään',
                like: 'kuten',
                notLike: 'ei kuten',
                greaterThan: 'suurempi kuin',
                atLeast: 'vähintään',
                lessThan: 'pienempi kuin',
                atMost: 'enintään'
            }
        },
        TimeSeries: {
            label: {
                animationSpeed: 'Animaationopeus',
                skipAhead: 'Hyppää eteenpäin'
            },
            animationSpeed: {
                slow: 'Hidas',
                normal: 'Normaali',
                fast: 'Nopea'
            },
            skip: {
                none: 'Ei yhtään',
                minute: '1 minuutti',
                hour: '1 tunti',
                day: '1 päivä',
                week: '1 viikko',
                month: '1 kuukausi'
            },
            rangeControl: {
                helpGeneric: 'Tällä aikasarjatyökalulla voit valita janalta haluamasi vuodet. Janalla näytetään pienillä ympyröillä vuodet, joilta sen hetkisen karttanäkymän alueella on dataa.',
                helpMsg_year: 'Tässä moodissa pääset tarkastelemaan yksittäisen vuoden aineistoja. Kuvausalueiden rajoilla tarkastelua helpottaa aikavälimoodi, johon pääset siirtymään viereisestä ikonista:',
                helpMsg_range: 'Tässä moodissa pääset tarkastelemaan valitun aikavälin sisällä tuotettua aineistoa. Huom! Näytettävä kuva on valitusta aikavälistä viimeisin saatavilla oleva. Jos haluat nähdä vain yksittäisen vuoden aineistoa vaihda moodia viereisestä ikonista:',
                switch2range: 'Vaihda aikavälimoodiin',
                switch2year: 'Vaihda yksittäisen vuoden valintamoodiin'
            }
        },
        coordinates: {
            lon: "Lon",
            lat: "Lat",
            n: "N",
            e: "E",
            p: "N",
            i: "E", 
            crs: {
              'EPSG:3067': "ETRS89-TM35FIN -koordinaatit",
              'EPSG:3575': "North Pole LAEA Europe -koordinaatit",
              'EPSG:3857': "WGS 84 / Pseudo-Mercator -koordinaatit",
              default: "{crs} -koordinaatit"
          },
        },
        layerTooltipTitle: {
            'wms': 'Rasteritaso',
            'wmts': 'Rasteritaso',
            'arcgis93': 'Rasteritaso',
            'arcgis': 'Rasteritaso',
            'vectortile': 'Rasteritaso',
            'bingmaps': 'Rasteritaso',
            'wfs': 'Vektoritaso',
            'vector': 'Vektoritaso',
            'userlayer': 'Oma aineisto',
            'myplaces': 'Oma karttataso',
            'analysislayer': 'Oma analyysi',
            'tiles3d': '3D-taso'
        }
    }
});
