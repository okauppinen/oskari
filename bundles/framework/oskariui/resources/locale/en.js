Oskari.registerLocalization({
    lang: 'en',
    key: 'oskariui',
    value: {
        buttons: {
            add: 'Add',
            cancel: 'Cancel',
            close: 'Close',
            delete: 'Delete',
            edit: 'Edit',
            save: 'Save',
            submit: 'Submit',
            import: 'Import',
            yes: 'Yes',
            no: 'No',
            next: 'Next',
            previous: 'Previous',
            print: 'Print',
            search: 'Search',
            reset: 'Reset',
            copy: 'Copy to clipboard',
            clear: 'Clear',
            accept: 'Accept',
            reject: 'Reject',
            info: 'Show more information',
            move: 'Move'
        },
        messages: {
            confirm: 'Are you sure you want to continue?',
            confirmDelete: 'Are you sure you wish to delete?',
            copied: 'Copied'
        },
        error: {
            generic: 'Something went wrong'
        },
        table: {
            sort: {
                desc: 'Click to sort descending',
                asc: 'Click to sort ascending',
                cancel: 'Click to cancel sorting'
            },
            emptyText: 'No data.'
        },
        ColorPicker: {
            tooltip: 'Choose color',
            moreColors: 'More colors'
        },
        StyleEditor: {
            subheaders: {
                styleFormat: 'Geometry type',
                name: 'Style name',
                style: 'Style',
                pointTab: 'Point',
                lineTab: 'Line',
                areaTab: 'Area'
            },
            tooltips: {
                transparent: 'No fill',
                solid: 'Solid fill',
                thin_diagonal: 'Thin diagonal line',
                thick_diagonal: 'Thick diagonal line',
                thin_horizontal: 'Thin horizontal line',
                thick_horizontal: 'Thick horizontal line'
            },
            fill: {
                color: 'Fill colour',
                area: {
                    pattern: 'Fill pattern'
                }
            },
            image: {
                shape: 'Icon',
                size: 'Size',
                fill: {
                    color: 'Colour'
                }
            },
            stroke: {
                color: 'Colour',
                lineCap: 'Endings',
                lineDash: 'Dash',
                lineJoin: 'Corners',
                width: 'Width',
                area: {
                    color: 'Colour',
                    lineDash: 'Dash',
                    lineJoin: 'Corners',
                    width: 'Line width'
                }
            }
        },
        FileInput: {
            drag: 'Drag {maxCount, plural, one {a file} other {files}} here or select by browsing.',
            noFiles: 'No file selected.',
            error: {
                invalidType: 'File format is not allowed.',
                allowedExtensions: 'Allowed file extensions: {allowedExtensions}.',
                multipleNotAllowed: 'Only single file is allowed to be uploaded.',
                fileSize: 'The selected file is too large. It can be at most {maxSize, number} Mb.'
            }
        },
        LocalizationComponent: {
            otherLanguages: 'Other languages',
            othersTip: 'Translations will be shown when using the service in different languages',
            locale: {
                generic: 'in ({0})',
                fi: 'in Finnish',
                en: 'in English',
                sv: 'in Swedish'
            }
        },
        Spin: {
            loading: 'Loading...'
        },
        FeatureFilter: {
            single: 'One property',
            and: 'AND operator',
            or: 'OR operator',
            range: {
                true: 'Don\'t use value range',
                false: 'Use value range'
            },
            addTooltip: 'Add new row for filter',
            clearTooltip: 'Clear filter',
            caseSensitive: {
                true: 'Case sensitive',
                false: 'Case insensitive'
            },
            operators: {
                value: 'is',
                in: 'in',
                notIn: 'not in',
                like: 'like',
                notLike: 'not like',
                greaterThan: 'greater than',
                atLeast: 'at least',
                lessThan: 'less than',
                atMost: 'at most'
            }
        },
        TimeSeries: {
            speed: {
                label: 'Animation speed',
                slow: 'Slow',
                normal: 'Normal',
                fast: 'Fast'
            },
            skip: {
                label: 'Skip ahead',
                none: 'None',
                minute: '1 minute',
                hour: '1 hour',
                day: '1 day',
                week: '1 week',
                month: '1 month'
            },
            dateRender: '{val, date} {val, time, short}',
            controls: {
                info: 'With this timeseries tool, you can select the years you want in the slider. The small circles indicate the years from which there exists data in current map view.',
                range: {
                    info: 'In this mode you can select a time range for the data. Note! The latest available image for the selected range is shown on any given location. You can switch to single year mode by clicking the near by icon:',
                    toggle: 'Switch to single year mode'
                },
                year: {
                    info: 'In this mode you can see data from a single year. At the fringes of yearly coverage areas it is easier to inspect the data in the time range mode. You can switch the mode by clicking the nearby icon:',
                    toggle: 'Switch to time range mode'
                }
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
              'EPSG:3067': "ETRS89-TM35FIN coordinates",
              'EPSG:3575': "North Pole LAEA Europe coordinates",
              'EPSG:3857': "WGS 84 / Pseudo-Mercator coordinates",
              default: "{crs} coordinates"
          },
        },
        layerTooltipTitle: {
            'wms': 'Raster layer',
            'wmts': 'Raster layer',
            'arcgis93': 'Raster layer',
            'arcgis': 'Raster layer',
            'vectortile': 'Raster layer',
            'bingmaps': 'Raster layer',
            'wfs': 'Vector layer',
            'vector': 'Vector layer',
            'userlayer': 'Own dataset',
            'myplaces': 'My map layer',
            'analysislayer': 'Own analysis',
            'tiles3d': '3D layer'
        }
    }
});
