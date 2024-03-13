Oskari.registerLocalization(
{
    "lang": "ru",
    "key": "StatsGrid",
    "value": {
        "tile": {
            "title": "Тематические карты",
            "search": "Поиск данных",
            "grid": "Таблица",
            "diagram": "Гистограмма"
        },
        "flyout": {
            "title": "Тематические карты"
        },
        "dataProviderInfoTitle": "Индикаторы",
        "layertools": "Переход к тематическим картам",
        "panels": {
            "newSearch": {
                "seriesTitle": "Временные ряды",
                "datasourceTitle": "Источник данных",
                "indicatorTitle": "Индикатор",
                "regionsetTitle": "Установки региона",
                "seriesLabel": "Получить данные в виде временных рядов ",
                "selectDatasourcePlaceholder": "Выбрать источник данных",
                "selectIndicatorPlaceholder": "Выбрать данные",
                "selectRegionsetPlaceholder": "Выбрать установки региона",
                "noResults": "Результаты соответствия не найдены",
                "refineSearchLabel": "Укажите содержание исследуемых данных",
                "refineSearchTooltip": "Вы получите больше вариантов после выбора поставщика данных и данных.",
                "defaultPlaceholder": "Выбрать значение",
                "selectionValues": {
                    "sex": {
                        "placeholder": "Выбрать пол",
                        "male": "Мужской",
                        "female": "Женский",
                        "total": "Итого"
                    },
                    "year": {
                        "placeholder": "Выбрать год"
                    },
                    "regionset": {
                        "placeholder": "Выбрать ареал обитания"
                    }
                },
                "noRegionset": "Область не выбрана"
            }
        },
        "statsgrid": {
            "noResults": "Данные не выбраны",
            "noValues": "Нет значений для выбранных данных",
            "orderBy": "Сортировать",
            "orderByAscending": "Сортировать по возрастанию",
            "orderByDescending": "Сортировать по убыванию",
            "removeSource": "Удалить данные"
        },
        "legend": {
            "title": "Классификация",
            "noActive": "Данные не были выбраны, выберите данные для просмотра классификации карт.",
            "noEnough": "Данные слишком малы для классификации, попробуйте другие данные или измените ограничения.",
            "noData": "Данные недоступны для выбранного момента времени.",
            "cannotCreateLegend": "Условные обозначения не могут быть созданы выбранными значениями, попробуйте разные значения."
        },
        "diagram": {
            "title": "Диаграмма",
            "noValue": "Недоступно"
        },
        "parameters": {
            "sex": "Пол",
            "year": "Год",
            "regionset": "Облаcть",
            "from": "от",
            "to": "до",
            "value": "Значение",
            "region": "Облаcть"
        },
        "datatable": "Таблица",
        "classify": {
            "classify": "Классификация",
            "labels": {
                "method": "Метод классификации",
                "count": "Классовое деление",
                "mode": "Разрывы классов",
                "mapStyle": "Стиль карты",
                "type": "Распределение",
                "reverseColors": "Флип цвета",
                "color": "Цвет",
                "colorset": "Цвета",
                "pointSize": "Размер точки",
                "transparency": "Прозрачность",
                "showValues": "Показать значения",
                "fractionDigits": "Количество десятичных знаков"
            },
            "methods": {
                "jenks": "Естественные интервалы",
                "quantile": "Квантили",
                "equal": "Равные интервалы"
            },
            "modes": {
                "distinct": "Непрерывный",
                "discontinuous": "Прерывистый"
            },
            "mapStyles": {
                "choropleth": "Картограмма",
                "points": "Символ точки на карте"
            },
            "pointSizes": {
                "min": "Минимум",
                "max": "Максимум"
            },
            "types": {
                "seq": "Количественный",
                "qual": "Качественный",
                "div": "Различный"
            }
        },
        "errors": {
            "indicatorListError": "Произошла ошибка при поиске поставщика данных.",
            "indicatorListIsEmpty": "Список данных поставщика данных пуст.",
            "indicatorMetadataError": "Произошла ошибка при поиске выборки данных.",
            "indicatorMetadataIsEmpty": "Выборка данных отсутствует.",
            "regionsetsIsEmpty": "Не удалось выбрать области для выборки данных.",
            "regionsDataError": "Произошла ошибка при поиске значения области.",
            "regionsDataIsEmpty": "Невозможно получить значения области для выбранных данных."
        },
        "sorting": {
            "desc": "Порядок",
            "name-ascending": "Название по возрастанию",
            "name-descending": "Название по убыванию",
            "value-ascending": "Значение по возрастанию",
            "value-descending": "Значение по убыванию"
        },
        "layer": {
            "name": "Ареал обитания на тематической карте",
            "inspireName": "Тематическая карта",
            "organizationName": "Тематическая карта"
        },
        "tab": {
            "title": "Индикаторы",
            "confirmDelete": "Вы удаляете индикатор \"{name}\". Вы действительно хотите удалить индикатор?",
            "grid": {
                "name": "Название",
                "edit": "Редактировать",
                "delete": "Удалить"
            }
        },
        "userIndicators": {
            "add": "Добавить новый индикатор",
            "notLoggedInWarning": "Без авторизации данные не могут быть сохранены и будут доступны только до перезагрузки страницы. Авторизируйтесь в системе перед добавлением индикатора для сохранения данных.",
            "iinfo": {
                "title": "Индикатор данных",
                "name": "Название",
                "description": "Описание",
                "source": "Источник данных"
            },
            "datasets": {
                "title": "Статистические данные"
            },
            "import": {
            },
            "success": {
                "indicatorSave": "Данные сохранены.",
                "indicatorDelete": "Индикатор удален",
                "datasetSave": "Данные сохранены.",
                "datasetDelete": "Индикатор удален"
            },
            "error": {
                "indicatorSave": "Индикатор сохранения ошибок",
                "indicatorDelete": "Индикатор не был удален.",
                "IndicatorNotfound": "Индикатор не найден.",
                "datasetSave": "Ошибка сохранения набора данных.",
                "datasetDelete": "Ошибка удаления набора данных."
            },
            "validate": {
                "year": "Поле год не может быть пустым.",
                "regionset": "Поле выбора региона не может быть пустым."
            }
        },
        'indicatorList': {
            'title': 'Индикаторы',
            'emptyMsg': 'Отсутствуют выбранные индикаторы'
        }
    }
});
