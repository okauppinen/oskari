Oskari.registerLocalization({
    'lang': 'fi',
    'key': 'StatsGrid',
    'value': {
        'tile': {
            'title': 'Teemakartat',
            'search': 'Aineistohaku',
            'grid': 'Taulukko',
            'diagram': 'Pylväsdiagrammi'
        },
        'flyout': {
            'title': 'Teemakartat'
        },
        'dataProviderInfoTitle': 'Indikaattorit',
        'layertool': 'Siirry teemakarttoihin',
        'panels': {
            'newSearch': {
                'seriesTitle': 'Aikasarja',
                'datasourceTitle': 'Tietolähde',
                'indicatorTitle': 'Indikaattori',
                'regionsetTitle': 'Aluejakorajaus (valinnainen)',
                'seriesLabel': 'Hae aikasarjana',
                'selectDatasourcePlaceholder': 'Valitse tietolähde',
                'selectIndicatorPlaceholder': 'Valitse aineisto',
                'selectRegionsetPlaceholder': 'Valitse aluejako',
                'noResults': 'Yhtään hakutulosta ei löytynyt, haulla',
                'refineSearchLabel': 'Tarkenna tarkasteltavan aineiston sisältöä',
                'refineSearchTooltip': 'Saat näkyviin vaihtoehtoja kun olet ensin valinnut aineiston tarjoajan ja aineiston.',
                'defaultPlaceholder': 'Valitse arvo',
                'selectionValues': {
                    'sex': {
                        'placeholder': 'Valitse sukupuoli',
                        'male': 'Miehet',
                        'female': 'Naiset',
                        'total': 'Yhteensä'
                    },
                    'year': {
                        'placeholder': 'Valitse vuosi'
                    },
                    'regionset': {
                        'placeholder': 'Valitse aluejako'
                    }
                },
                'noRegionset': 'Ei aluevalintaa'
            }
        },
        'statsgrid': {
            'noResults': 'Ei valittuja aineistoja',
            'noValues': 'Ei arvoja valitulla aineistolla',
            'orderBy': 'Lajittele',
            'orderByAscending': 'Lajittele nousevasti',
            'orderByDescending': 'Lajittele laskevasti',
            'removeSource': 'Poista aineisto',
            'noIndicators': 'Aloita teemakartan käyttö lisäämällä kartalle indikaattori.'
        },
        'legend': {
            'title': 'Luokittelu',
            'noActive': 'Ei valittuna aineistoa, valitse aineisto nähdäksesi kartan luokittelun.',
            'noEnough': 'Aineisto on liian pieni luokittelun muodostamiseksi, kokeile eri aineistoa tai muuta rajauksia.',
            'noData': 'Aineistoa ei ole saatavilla valitsemaltasi ajankohdalta',
            'cannotCreateLegend': 'Legendaa ei saada tehtyä valitsemillasi arvoilla, kokeile eri arvoilla.'
        },
        'diagram': {
            'title': 'Pylväsdiagrammi',
            'noValue': 'Ei arvoa'
        },
        'parameters': {
            'sex': 'Sukupuoli',
            'year': 'Vuosi',
            'Vuosi': 'Vuosi',
            'regionset': 'Aluejako',
            'from': 'alkaen',
            'to': 'päättyen',
            'value': 'Arvo',
            'region': 'Alue'
        },
        'datatable': 'Taulukko',
        'classify': {
            'classify': 'Luokittelu',
            'labels': {
                'method': 'Luokittelutapa',
                'count': 'Luokkajako', // classes
                'mode': 'Luokkarajat',
                'mapStyle': 'Kartan tyyli',
                'type': 'Jakauma', // setselection
                'reverseColors': 'Käännä värit',
                'color': 'Väri',
                'colorset': 'Värit', //button
                'pointSize': 'Pisteen koko',
                'transparency': 'Läpinäkyvyys',
                'showValues': 'Näytä arvot',
                'fractionDigits': 'Desimaalien lukumäärä'
            },
            'methods': {
                'jenks': 'Luonnolliset välit',
                'quantile': 'Kvantiilit',
                'equal': 'Tasavälit',
                'manual': 'Oma luokittelu'
            },
            'modes': {
                'distinct': 'Jatkuva',
                'discontinuous': 'Epäjatkuva'
            },
            'edit': {
                'title': 'Muokkaa luokittelua',
                'open': 'Avaa luokittelun muokkaus',
                'close': 'Sulje luokittelun muokkaus'
            },
            'mapStyles': {
                'choropleth': 'Koropleettikartta',
                'points': 'Pisteet'
            },
            'pointSizes': {
                'min': 'Minimi',
                'max': 'Maksimi'
            },
            'types': {
                'seq': 'Kvantitatiivinen',
                'qual': 'Kvalitatiivinen',
                'div': 'Jakautuva'
            }
        },
        'errors': {
            'indicatorListError': 'Aineiston tarjoajien haussa tapahtui virhe.',
            'indicatorListIsEmpty': 'Aineiston tarjoajan aineistolista on tyhjä.',
            'indicatorMetadataError': 'Aineiston valintojen haussa tapahtui virhe.',
            'indicatorMetadataIsEmpty': 'Aineiston valinnat on tyhjä.',
            'regionsetsIsEmpty': 'Aluevalintoja ei saatu valitulle aineistolle.',
            'regionsDataError': 'Alueen arvojen haussa tapahtui virhe.',
            'regionsDataIsEmpty': 'Valitulle aineistolle ei saatu alueiden arvoja.',
            'datasourceIsEmpty': 'Tietolähde on tyhjä.',
            'cannotDisplayAsSeries': 'Indikaattoria ei voida tarkastella sarjana',
            'noDataForIndicators': 'Palvelusta ei saatu tietoja {indicators, plural, one {indikaattorille} other {indikaattoreille}}',
            'onlyPartialDataForIndicators': 'Palvelusta ei saatu kaikkia tietoja {indicators, plural, one {indikaattorille} other {indikaattoreille}}'
        },
        'missing': {
            'regionsetName': 'Tuntematon',
            'indicator': 'Tuntematon indikaattori'
        },
        'sorting': {
            'desc': 'Järjestys',
            'name-ascending': 'Nimen mukaan nouseva',
            'name-descending': 'Nimen mukaan laskeva',
            'value-ascending': 'Arvon mukaan nouseva',
            'value-descending': 'Arvon mukaan laskeva'
        },
        'filter': {
            'title': 'Suodatus',
            'indicatorToFilter': 'Suodatettava muuttuja',
            'condition': 'Ehto',
            'value': 'Arvo',
            'variable': 'Muuttuja',
            'conditionPlaceholder': 'Valitse ehto',
            'greater': 'Suurempi kuin (>)',
            'greaterEqual': 'Suurempi tai yhtäsuuri kuin (>=)',
            'equal': 'Yhtäsuuri kuin (=)',
            'lessEqual': 'Pienempi tai yhtäsuuri kuin (<=)',
            'lessThan': 'Pienempi kuin (<)',
            'between': 'Välillä (poissulkeva)',
            'filter': 'Suodata arvot',
            'desc': 'Suodata arvoilla',
            'filtered': 'Suodatetut arvot',
            'area': 'Suodata alueilla'
        },
        'layer': {
            'name': 'Teemakartan aluejako',
            'inspireName': 'Teemakartta',
            'organizationName': 'Teemakartta'
        },
        'tab': {
            'title': 'Indikaattorit',
            'edit': 'Muokkaa',
            'delete': 'Poista',
            'grid': {
                'name': 'Nimi',
                'edit': 'Muokkaa',
                'delete': 'Poista',
                'actions': 'Toiminnot',
                'createDate': 'Luontiaika',
                'updateDate': 'Muokkausaika'
            },
            'popup': {
                'deletetitle': 'Poista indikaattori',
                'deletemsg': 'Haluatko poistaa indikaattorin "{name}"?'
            }
        },
        'userIndicators': {
            'title': 'Omat indikaattorit',
            'add': 'Lisää uusi indikaattori',
            'edit': 'Muokkaa indikaattoria',
            'notLoggedInWarning': 'Kirjautumattomana oman indikaattorin tiedot ovat käytettävissä vain tämän session ajan. Kirjaudu sisään tallentaaksesi indikaattori.',
            'info': {
                'title': 'Indikaattorin tiedot',
                'name': 'Nimi',
                'description': 'Kuvaus',
                'source': 'Lähde'
            },
            'datasets': {
                'title': 'Tilastotieto',
                'dataset': 'Aineisto',
                'noIndicator': 'Tallenna indikaattorin tiedot lisätäksesi aineistoja.',
                'noDatasets': 'Indikaattorilla ei ole tallennettuja aineistoja.'
            },
            'import': {
                'title': 'Tuo leikepöydältä',
                'placeholder': 'Kopioi tähän indikaattorin tiedot. Yhdellä rivillä on alue ja sitä vastaava arvo. Alue merkitään joko nimellä tai tunnisteella. Erottimeksi puolipiste. Tiedot voivat olla seuraavissa muodoissa: \n' +
                'Esimerkki 1: Helsinki;1234 \n' +
                'Esimerkki 2: 011;5678'
            },
            'success': {
                'indicatorSave': 'Indikaattorin tiedot tallennettu',
                'indicatorDelete': 'Indikaattorin tiedot poistettu',
                'datasetSave': 'Aineisto tallennettu',
                'datasetDelete': 'Aineisto poistettu'
            },
            'error': {
                'indicatorSave': 'Indikaattorin tallennus epäonnistui',
                'indicatorDelete': 'Indikaattorin poisto epäonnistui',
                'IndicatorNotfound': 'Indikaattoria ei löytynyt',
                'datasetSave': 'Virhe tallennetaessa aineistoa',
                'datasetDelete': 'Virhe poistaessa aineistoa'
            },
            'validate': {
                'name': 'Nimi kenttä ei voi olla tyhjä',
                'year': 'Vuosi kenttä ei voi olla tyhjä',
                'regionset': 'Aluejako ei voi olla tyhjä',
                'noData': 'Aineiston arvoja ei ole annettu',
                'invalidData': 'Aineistossa on virheellisiä arvoja'
            }
        },
        'indicatorList': {
            'title': 'Indikaattorit',
            'removeAll': 'Poista kaikki',
            'emptyMsg': 'Ei valittuja indikaattoreita'
        },
        'metadataPopup': {
            'open': 'Näytä {indicators, plural, one {indikaattorin kuvaus} other {indikaattorien kuvaukset}}',
            'title': '{indicators, plural, one {Indikaattorin kuvaus} other {Indikaattorien kuvaukset}}',
            'noMetadata': 'Palvelusta ei saatu {indicators, plural, one {indikaattorin kuvausta} other {indikaattorien kuvauksia}}.',
            'datasource': 'Tietolähde',
            'updated': 'Viimeksi päivitetty',
            'nextUpdate': 'Seuraava päivitys'
        }
    }
});
