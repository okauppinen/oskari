Oskari.registerLocalization({
    'lang': 'sv',
    'key': 'StatsGrid',
    'value': {
        'tile': {
            'title': 'Tematiska kartor',
            'search': 'Materialsökning',
            'table': 'Tabell',
            'diagram': 'Stapeldiagram'
        },
        'flyout': {
            'title': 'Tematiska kartor'
        },
        'dataProviderInfoTitle': 'Indikatorer',
        'layertools': {
            'table_icon': {
                'tooltip': 'gå till tematiska kartor',
                'title': 'Tematiska kartor'
            },
            'diagram_icon': {
                'tooltip': 'Visa uppgifter i diagram',
                'title': 'Diagram'
            },
            'statistics': {
                'tooltip': 'gå till tematiska kartor',
                'title': 'Statistik'
            }
        },
        'panels': {
            'newSearch': {
                'title': 'SÖK DATA',
                'seriesTitle': 'Tidsserie',
                'datasourceTitle': 'Datakälla',
                'indicatorTitle': 'Datamängd',
                'regionsetTitle': 'Områdesindelning (frivillig)',
                'seriesLabel': 'Hämta som en tidsserie',
                'selectDatasourcePlaceholder': 'Välj datakälla',
                'selectIndicatorPlaceholder': 'Välj datamängd',
                'selectRegionsetPlaceholder': 'Välj områdesindelning',
                'noResults': 'Inga sökresultat hittades med',
                'refineSearchLabel': 'Precisera innehållet av datamängden du önskar att granska',
                'refineSearchTooltip1': 'Du får mera alternativ när du har först valt dataleverantören och datamängden.',
                'refineSearchTooltip2': '',
                'addButtonTitle': 'Hämta datamängdens uppgifter',
                'clearButtonTitle': 'Töm',
                'defaultPlaceholder': 'Välj värde',
                'selectionValues': {
                    'sex': {
                        'placeholder': 'Välj kön',
                        'male': 'Män',
                        'female': 'Kvinnor',
                        'total': 'Totalt'
                    },
                    'year': {
                        'placeholder': 'Välj år'
                    },
                    'regionset': {
                        'placeholder': 'Välj områdesindelning'
                    }
                },
                'noRegionset': 'Ingen områdesindelning'
            }
        },
        'statsgrid': {
            'title': 'HÄMTADE DATAMÄNGDER',
            'noResults': 'Inga valda datamängder',
            'noValues': 'Inga värden i den valda datamängden',
            'areaSelection': {
                'title': 'OMRÅDESINDELNING'
            },
            'orderBy': 'Sortera',
            'orderByAscending': 'Sortera stigande',
            'orderByDescending': 'Sortera sjunkande',
            'removeSource': 'Radera datamängd',
            'noIndicators': 'Börja användningen av tematiska kartor med att lägga till en indikator på kartan.'
        },
        'legend': {
            'title': 'Klassificering',
            'noActive': 'Inga valda datamängder, välj datamängd för att se kartans klassificering.',
            'noEnough': 'Datamängden är för liten för att klassificeras, försök en annan datamängd eller avgränsning.',
            'noData': 'Ingen data vid den valda tidspunkten.',
            'cannotCreateLegend': 'Teckenförklaringen kan inte skapas utgående från de valda värden, vänligen försök andra värden.'
        },
        'series': {
            'speed': {
                'label': 'Animeringshastighet',
                'fast': 'Snabb',
                'normal': 'Normal',
                'slow': 'Långsam'
            }
        },
        'parameters': {
            'sex': 'Kön',
            'year': 'År',
            'Vuosi': 'År',
            'regionset': 'Områdesindelning',
            'from': 'från',
            'to': 'tills'
        },
        'datatable': 'Tabell',
        'published': {
            'showMap': 'Visa karta',
            'showTable': 'Visa tabell'
        },
        'classify': {
            'classify': 'Klassificering',
            'classifymethod': 'Klassificeringsmetod',
            'classes': 'Klassfördelning',
            'methods': {
                'jenks': 'Naturliga brytpunkter',
                'quantile': 'Kvantiler',
                'equal': 'Lika intervall',
                'manual': 'Egen klassificering'
            },
            'manual': 'Klassificering för hand',
            'manualPlaceholder': 'Avgränsa tal med kommatecken.',
            'manualRangeError': 'Klassgränserna är felaktiga. Klassgränserna bör vara mellan {min} - {max}. Avgränsa tal med kommatecken. Använd punkt som decimaltecken. Rätta till klassgränserna och försök igen.',
            'nanError': 'Det givna värdet är ej ett tal. Rätta till värdet och försök igen. Använd punkt som decimaltecken.',
            'infoTitle': 'Klassificering för hand',
            'info': 'Ange klassgränserna som tal avgränsade med kommatecken. Använd punkt som decimaltecken. Till exempel genom att mata in "0, 10.5, 24, 30.2, 57, 73.1" skapas fem klasser med värden mellan "0-10,5", "10,5-24", "24-30,2", "30,2-57" och "57-73,1". Indikatorvärden, som är mindre än den lägsta klassgränsen (0 i exemplet) eller större än den högsta klassgränsen (73,1), visas inte på kartan. Klassgränserna bör vara mellan det minsta och största värdet.',
            'mode': 'Klassgränser',
            'modes': {
                'distinct': 'Kontinuerlig',
                'discontinuous': 'Diskontinuerlig'
            },
            'edit': {
                'title': 'Redigera klassificeringen',
                'open': 'Öppna klassificeringseditoraren',
                'close': 'Stägn klassificeringseditoraren'
            },
            'classifyFieldsTitle': 'Klassificeringsvärden',
            'map': {
                'mapStyle': 'Kartans stil',
                'choropleth': 'Koropletkarta',
                'points': 'Karta med punktsymboler',
                'pointSize': 'Punktens storlek',
                'min': 'Minimum',
                'max': 'Maximum',
                'color': 'Färg',
                'transparency': 'Opacitet',
                'showValues': 'Visa värden',
                'fractionDigits': 'Decimaltal'
            }
        },
        'colorset': {
            'button': 'Färg',
            'flipButton': 'Kasta om färgerna',
            'themeselection': 'Välj klassernas färger',
            'setselection': 'Fördelning',
            'seq': 'Kvantitativ',
            'qual': 'Kvalitativ',
            'div': 'Uppdelad',
            'info2': 'Välj färgsättning genom att klicka på den önskade färggruppen.',
            'cancel': 'Avbryt'
        },
        'errors': {
            'title': 'Fel',
            'indicatorListError': 'Ett fel uppstod vid sökningen av dataleverantören.',
            'indicatorListIsEmpty': 'Dataleverantörens lista av datamängder är tom.',
            'indicatorMetadataError': 'Ett fel uppstod vid sökningen av datamängder.',
            'indicatorMetadataIsEmpty': 'Inga datamängder har valts.',
            'regionsetsIsEmpty': 'Områdesindelningarna kunde inte hämtas för den valda datamängden.',
            'regionsDataError': 'Ett fel uppstod vid sökningen av områdets värden.',
            'regionsDataIsEmpty': 'Områdenas värden kunde inte ges till de valda datamängderna.',
            'datasetSave': 'Ett fel uppstod vid sparning av data.',
            'datasetDelete': 'Ett fel uppstod vid radering av data.',
            'indicatorSave': 'Ett fel uppstod vid sparning av egen indikator.',
            'myIndicatorYearInput': 'Årsfält kan inte vara tom.',
            'myIndicatorRegionselect': 'Områdesindelning kan inte vara tom.',
            'myIndicatorDatasource': 'Datakällan är tom.',
            'cannotDisplayAsSeries': 'Indikatorn kan inte inspekteras som en serie.',
            'noDataForIndicators': 'Tjänsten returnerade ingen data för {indicators, plural, one {indikatorn} other {indikatorer}}',
            'onlyPartialDataForIndicators': 'Tjänsten returnerade inte alla data för {indicators, plural, one {indikatorn} other {indikatorer}}'
        },
        'missing': {
            'regionsetName': 'Okänd'
        },
        'datacharts': {
            'flyout': 'Sökta datamängden',
            'barchart': 'Stapeldiagram',
            'linechart': 'Linjediagram',
            'table': 'Tabell',
            'desc': 'Tabell och figurer',
            'nodata': 'Inga valda indikatorer',
            'indicatorVar': 'Variabeln som ska visas i figuren',
            'descColor': 'Figurens färg',
            'selectClr': 'Vald färg',
            'clrFromMap': 'Färgsättning enligt kartas klassificering',
            'chooseColor': 'Välj färg',
            'sorting': {
                'desc': 'Sortera',
                'name-ascending': 'Stigande enligt namn',
                'name-descending': 'Sjunkande enligt namn',
                'value-ascending': 'Stigande enligt värde',
                'value-descending': 'Sjunkande enligt värde'
            }
        },
        'filter': {
            'title': 'Filtrering',
            'indicatorToFilter': 'Variabel som ska filtreras',
            'condition': 'Villkor',
            'value': 'Värde',
            'variable': 'Variabel',
            'conditionPlaceholder': 'Välj villkor',
            'greater': 'Större än (>)',
            'greaterEqual': 'Större än eller lika med (>=)',
            'equal': 'Lika med (=)',
            'lessEqual': 'Mindre än eller lika med (<=)',
            'lessThan': 'Mindre än (<)',
            'between': 'Mellan (uteslutande)',
            'filter': 'Filtrera värden',
            'desc': 'Filtrera med värden',
            'filtered': 'Filtrerade värden',
            'area': 'Filtrera med områden'
        },
        'layer': {
            'name': 'Områdesindelning av tematiska kartan',
            'inspireName': 'Tematisk karta',
            'organizationName': 'Tematisk karta'
        },
        'tab': {
            'title': 'Indikatorer',
            'edit': 'Redigera',
            'delete': 'Ta bort',
            'grid': {
                'name': 'Namn',
                'edit': 'Redigera',
                'delete': 'Ta bort'
            },
            'popup': {
                'deletetitle': 'Ta bort indikatorn',
                'deletemsg': 'Vill du ta bort indikatorn "{name}"?',
                'deleteSuccess': 'Indikatorn borttagen'
            },
            'button': {
                'cancel': 'Avbryt',
                'ok': 'OK'
            },
            'error': {
                'title': 'Fel',
                'notfound': 'Indikator saknas',
                'notdeleted': 'Borttagning av indikatorn misslyckades'
            }
        },
        'userIndicators': {
            'flyoutTitle': 'Skapa indikator',
            'buttonTitle': 'Skapa indikator',
            'buttonAddIndicator': 'Ange värden',
            'panelGeneric': {
                'title': 'Information',
                'formName': 'Namn',
                'formDescription': 'Beskrivning',
                'formDatasource': 'Källa'
            },
            'panelData': {
                'title': 'Statistisk information'
            },
            'dialog': {
                'successTitle': 'Sparad',
                'successMsg': 'Informationen sparad.'
            },
            'import': {
                'title': 'Hämta från urklipp',
                'placeholder': 'Ange värden från urklippet här. En rad motsvarar ett område och dess värde. Område betäcknas med namn eller id. Separera värden med semikolon.\n' +
                'Värden kan tilläggas i följande form: \n' +
                'Exempel 1: Helsinki;1234 \n' +
                'Exempel 2: 011;5678'
            },
            'notLoggedInTitle': 'Varning',
            'notLoggedInWarning': 'Som utloggad användare kommer de skapade indikatorerna kunna användas endast under denna session. Logga in för att spara indikatorerna.',
            'modify': {
                'title': 'Indikator',
                'edit': 'Redigera',
                'remove': 'Ta bort'
            }
        },
        'indicatorList': {
            'title': 'Indikator',
            'removeAll': 'Ta bort alla',
            'emptyMsg': 'Inga valda indikatorer'
        },
        'metadataPopup': {
            'open': 'Visa {indicators, plural, one {indikator beskrivning} other {indikator beskrivningar}}',
            'title': '{indicators, plural, one {Indikator beskrivning} other {Indikator beskrivningar}}',
            'noMetadata': 'Tjänsten returnerade ingen beskrivning för {indicators, plural, one {indikatorn} other {indikatorer}}.'
        },
        'sumo': {
            'placeholder': 'Välj här',
            'captionFormat': '{0} valda',
            'captionFormatAllSelected': 'Alla {0} valda!',
            'searchText': 'Sök...',
            'noMatch': 'Inga sökresultat hittades med "{0}"',
            'locale': ['OK', 'Avbryt', 'Välj alla']
        }
    }
});
