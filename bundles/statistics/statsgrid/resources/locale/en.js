Oskari.registerLocalization({
    'lang': 'en',
    'key': 'StatsGrid',
    'value': {
        'tile': {
            'title': 'Thematic maps',
            'search': 'Search data',
            'grid': 'Table',
            'diagram': 'Bar chart'
        },
        'flyout': {
            'title': 'Thematic maps'
        },
        'dataProviderInfoTitle': 'Indicators',
        'layertool': 'Move to thematic maps',
        'panels': {
            'newSearch': {
                'seriesTitle': 'Time series',
                'datasourceTitle': 'Data source',
                'indicatorTitle': 'Indicator',
                'regionsetTitle': 'Regional division filter (optional)',
                'seriesLabel': 'Get data as time series',
                'selectDatasourcePlaceholder': 'Select data source',
                'selectIndicatorPlaceholder': 'Select data',
                'selectRegionsetPlaceholder': 'Select regionset',
                'noResults': 'No results found matching',
                'refineSearchLabel': 'Specify contents of the examined data',
                'refineSearchTooltip': 'You will get more options after choosing data provider and data.',
                'defaultPlaceholder': 'Select value',
                'selectionValues': {
                    'sex': {
                        'placeholder': 'Select gender',
                        'male': 'Male',
                        'female': 'Female',
                        'total': 'Altogether'
                    },
                    'year': {
                        'placeholder': 'Select year'
                    },
                    'regionset': {
                        'placeholder': 'Select areal division'
                    }
                },
                'noRegionset': 'No area selected'
            }
        },
        'statsgrid': {
            'noResults': 'No data selected',
            'noValues': 'No values for the selected data',
            'orderBy': 'Sort',
            'orderByAscending': 'Sort ascending',
            'orderByDescending': 'Sort descending',
            'removeSource': 'Remove data',
            'noIndicators': 'Start using thematic maps by adding an indicator on the map.'
        },
        'legend': {
            'title': 'Classification',
            'noActive': 'Data was not selected, select data to see map classification.',
            'noEnough': 'The data is too small to be classified, try different data or change limitings.',
            'noData': 'Data is not available for the selected point in time.',
            'cannotCreateLegend': 'Legend cannot be created by chosen values, try different values.'
        },
        'diagram': {
            'title': 'Diagram',
            'noValue': 'N/A'
        },
        'parameters': {
            'sex': 'Gender',
            'year': 'Year',
            'Vuosi': 'Year',
            'regionset': 'Regional division',
            'from': 'from',
            'to': 'to',
            'value': 'Value',
            'region': 'Region'
        },
        'datatable': 'Table',
        'classify': {
            'classify': 'Classification',
            'labels': {
                'method': 'Classification method',
                'count': 'Class division',
                'mode': 'Class breaks',
                'mapStyle': 'Map style',
                'type': 'Distribution',
                'reverseColors': 'Flip colors',
                'color': 'Color',
                'colorset': 'Colors',
                'pointSize': 'Point size',
                'transparency': 'Transparency',
                'showValues': 'Show values',
                'fractionDigits': 'Number of decimals'
            },
            'methods': {
                'jenks': 'Natural intervals',
                'quantile': 'Quantiles',
                'equal': 'Equal intervals',
                'manual': 'Manual classification'
            },
            'modes': {
                'distinct': 'Continuous',
                'discontinuous': 'Discontinuous'
            },
            'edit': {
                'title': 'Modify classification',
                'open': 'Open the classification editor',
                'close': 'Close the classification editor'
            },
            'mapStyles': {
                'choropleth': 'Choropleth map',
                'points': 'Point symbol map'
            },
            'pointSizes': {
                'min': 'Minimum',
                'max': 'Maximum'
            },
            'types': {
                'seq': 'Quantitative',
                'qual': 'Qualitative',
                'div': 'Diverging'
            }
        },
        'errors': {
            'indicatorListError': 'Error occurred in data provider search.',
            'indicatorListIsEmpty': "Data provider's data list is empty.",
            'indicatorMetadataError': 'Error occurred in data selection search.',
            'indicatorMetadataIsEmpty': 'There are no selections for the data.',
            'regionsetsIsEmpty': 'Area selections could not be fetched for chosen data.',
            'regionsDataError': 'Error occurred in area value search.',
            'regionsDataIsEmpty': 'Area values could not be fetched for chosen data.',
            'datasourceIsEmpty': 'Datasource is empty.',
            'cannotDisplayAsSeries': 'Indicator cannot be inspected as a series.',
            'noDataForIndicators': 'Service did not return data for {indicators, plural, one {the indicator} other {indicators}}',
            'onlyPartialDataForIndicators': 'Service did not return all data for {indicators, plural, one {the indicator} other {indicators}}'
        },
        'missing': {
            'regionsetName': 'Unknown',
            'indicator': 'Unknown indicator'
        },
        'sorting': {
            'desc': 'Order',
            'name-ascending': 'Name ascending',
            'name-descending': 'Name descending',
            'value-ascending': 'Value ascending',
            'value-descending': 'Value descending'
        },
        'layer': {
            'name': 'Areal division of thematic map',
            'inspireName': 'Thematic map',
            'organizationName': 'Thematic map'
        },
        'tab': {
            'title': 'Indicators',
            'confirmDelete': 'You are deleting the indicator "{name}". Do you want to delete the indicator?',
            'grid': {
                'name': 'Name',
                'edit': 'Edit',
                'delete': 'Delete',
                'actions': 'Actions',
                'createDate': 'Created',
                'updateDate': 'Updated'
            }
        },
        'userIndicators': {
            'title': 'My indicators',
            'add': 'Add new indicator',
            'edit': 'Edit indicator',
            'notLoggedInWarning': 'Without logging in the data cannot be saved and it will only be available until page reload. Log in before adding the indicator to preserve the data.',
            'info': {
                'title': 'Indicator data',
                'name': 'Name',
                'description': 'Description',
                'datasource': 'Datasource'
            },
            'datasets': {
                'title': 'Statistical data',
                'dataset': 'Dataset',
                'noIndicator': 'Save indicator information to add datasets.',
                'noDatasets': 'Indicator doesn\'t have any dataset.'
            },
            'import': {
                'title': 'Import from the clipboard',
                'placeholder': 'Enter the indicators data here. Each row should contain a region and it\'s value. Enter the region\'s name or id. Use semicolon as a separator. Data can be imported in following formats: \n' +
                'Sample 1: Helsinki;1234 \n' +
                'Sample 2: 011;5678'
            },
            'success': {
                'indicatorSave': 'Indicator saved',
                'indicatorDelete': 'Indicator removed',
                'datasetSave': 'The dataset has been saved',
                'datasetDelete': 'The dataset has been removed',
            },
            'error': {
                'indicatorSave': 'Error saving indicator',
                'indicatorDelete': 'The indicator was not removed',
                'indicatorNotfound': 'The indicator was not found',
                'datasetSave': 'Error saving dataset',
                'datasetDelete': 'Error deleting dataset'
            },
            'validate': {
                'name': 'Name field cannot be empty',
                'year': 'Year field cannot be empty',
                'regionset': 'Regionselect cannot be empty',
                'noData': 'Data doesn\'t have values',
                'invalidData': 'Data has invalid values'
            }
        },
        'indicatorList': {
            'title': 'Indicators',
            'removeAll': 'Remove all',
            'emptyMsg': 'No selected indicators'
        },
        'metadataPopup': {
            'open': 'Show indicator {indicators, plural, one {description} other {descriptions}}',
            'title': 'Indicator {indicators, plural, one {description} other {descriptions}}',
            'noMetadata': 'Service did not return {indicators, plural, one {description for the indicator} other {descriptions for the indicators}}',
            'datasource': 'Data source',
            'updated': 'Last update',
            'nextUpdate': 'Next update'
        }
    }
});
