Oskari.registerLocalization({
    "lang": "fr",
    "key": "StatsGrid",
    "value": {
        "tile": {
            "title": "Cartes thématiques",
            "search": "Données de recherche",
            "grid": "Tableau",
            "diagram": "Diagramme à barres"
        },
        "flyout": {
            "title": "Cartes thématiques"
        },
        "dataProviderInfoTitle": "Indicateurs",
        "layertool": "Passer aux cartes thématiques",
        "panels": {
            "newSearch": {
                "seriesTitle": "Série chronologique",
                "datasourceTitle": "Source des données",
                "indicatorTitle": "Indicateur",
                "regionsetTitle": "Filtre de division régionale (facultatif)",
                "seriesLabel": "Obtenir des données en tant que série chronologique",
                "selectDatasourcePlaceholder": "Sélectionner la source des données",
                "selectIndicatorPlaceholder": "Sélectionner les données",
                "selectRegionsetPlaceholder": "Sélectionner le jeu de régions",
                "noResults": "Votre recherche n'a donné aucun résultat",
                "refineSearchLabel": "Veuillez préciser le contenu des données examinées",
                "refineSearchTooltip": "Vous aurez plus d'options après avoir choisi le fournisseur de données et les données.",
                "defaultPlaceholder": "Sélectionner la valeur",
                "selectionValues": {
                    "sex": {
                        "placeholder": "Sélectionner le sexe",
                        "male": "Homme",
                        "female": "Femme",
                        "total": "En tout"
                    },
                    "year": {
                        "placeholder": "Sélectionner l'année"
                    },
                    "regionset": {
                        "placeholder": "Sélectionner la division de superficie"
                    }
                },
                "noRegionset": "Aucune superficie sélectionnée"
            }
        },
        "statsgrid": {
            "noResults": "Aucune donnée sélectionnée",
            "noValues": "Aucune valeur pour les données sélectionnées",
            "orderBy": "Trier",
            "orderByAscending": "Trier en ordre croissant",
            "orderByDescending": "Trier en ordre décroissant",
            "removeSource": "Supprimer les données"
        },
        "legend": {
            "title": "Classification",
            "noActive": "Aucune donnée sélectionnée. Veuillez sélectionner les données pour voir la classification de la carte.",
            "noEnough": "Les données sont trop petites pour être classifiées. Veuillez essayer des données différentes ou modifier les limites.",
            "noData": "Les données ne sont pas accessibles pour le moment précis sélectionné.",
            "cannotCreateLegend": "Impossible de créer la légende à l'aide des  valeurs choisies. Veuillez essayer des valeurs différentes."
        },
        "diagram": {
            "title": "Schéma",
            "noValue": "S/O"
        },
        "parameters": {
            "sex": "Sexe",
            "year": "Année",
            "regionset": "Superficie",
            "from": "de",
            "to": "à",
            "value": "Valeur",
            "region": "Région"
        },
        "datatable": "Tableau",
        "classify": {
            "classify": "Classification",
            "labels": {
                "method": "Méthode de classification",
                "count": "Division de catégories",
                "mode": "Séparations de catégories",
                "mapStyle": "Style de carte",
                "type": "Distribution",
                "reverseColors": "Passer d'une couleur à l'autre",
                "color": "Couleur",
                "colorset": "Couleurs",
                "pointSize": "Force du corps",
                "transparency": "Transparence",
                "showValues": "Afficher les valeurs",
                "fractionDigits": "Décimales"
            },
            "methods": {
                "jenks": "Intervalles naturels",
                "quantile": "Quantiles",
                "equal": "Untervalles égaux"
            },
            "modes": {
                "distinct": "En continu",
                "discontinuous": "En discontinu"
            },
            'edit': {
                'title': 'Modifier la classification',
                'open': 'Ferme l\'éditeur de classification',
                'close': 'Ouvrir l\'éditeur de classification'
            },
            "mapStyles": {
                "choropleth": "Carte choroplèthe",
                "points": "Carte par symboles"
            },
            "pointSizes": {
                "min": "Minimum",
                "max": "Maximum"
            },
            "types": {
                "seq": "Quantitative",
                "qual": "Qualitative",
                "div": "Divergente"
            }
        },
        "errors": {
            "indicatorListError": "Une erreur est survenue lors de la recherche du fournisseur de données.",
            "indicatorListIsEmpty": "La liste de données du fournisseur de données est vide.",
            "indicatorMetadataError": "Une erreur est survenue lors de la recherche des sélections de données.",
            "indicatorMetadataIsEmpty": "Il n'y a pas de sélection pour les données.",
            "regionsetsIsEmpty": "Impossible d'aller chercher les sélections de superficie pour les données choisies.",
            "regionsDataError": "Une erreur est survenue lors de la recherche des valeurs de superficie.",
            "regionsDataIsEmpty": "Impossible d'aller chercher les valeurs de superficie pour les données choisies.",
            "datasourceIsEmpty": "Le champ Source de données est vide.",
            "cannotDisplayAsSeries": "Impossible d'analyser l'indicateur en tant que série."
        },
        "sorting": {
            "desc": "Ordre",
            "name-ascending": "Nom en ordre croissant",
            "name-descending": "Nom en ordre décroissant",
            "value-ascending": "Valeur en ordre croissant",
            "value-descending": "Valeur en ordre décroissant"
        },
        "layer": {
            "name": "Division par superficie de la carte thématique",
            "inspireName": "Carte thématique",
            "organizationName": "Carte thématique"
        },
        "tab": {
            "title": "Indicateurs",
            "confirmDelete": "Vous supprimez l'indicateur \"{name}\". Souhaitez-vous supprimer l'indicateur?",
            "grid": {
                "name": "Nom",
                "edit": "Modifier",
                "delete": "Supprimer"
            }
        },
        "userIndicators": {
            "title": "Mes indicateurs",
            "add": "Ajouter un nouvel indicateur",
            "edit": "Indicateur de modification",
            "notLoggedInWarning": "Sans ouverture de session, impossible d'enregistrer les données, qui seront uniquement accessibles jusqu'à ce que la page soit rechargée. Ouvrir une session avant d'ajouter l'indicateur pour conserver les données.",
            "info": {
                "title": "Données de l'indicateur",
                "name": "Nom",
                "description": "Description",
                "source": "Source de données"
            },
            "datasets": {
                "title": "Données statistiques"
            },
            "import": {
                "title": "Importation à partir du presse-papiers",
                "placeholder": "Saisir les données de l'indicateur ici. Chaque rangée doit contenir une région et sa valeur. Saisir le nom ou l'identifiant de la région. Utiliser le point-virgule en tant que délimiteur. On peut importer les données dans les formats suivants : \nExemple 1 : Helsinki;1234 \nExample 2 : 011;5678"
            },
            "success": {
                "indicatorSave": "Les données ont été enregistrées",
                "indicatorDelete": "Indicateur supprimé",
                "datasetSave": "Les données ont été enregistrées"
            },
            "error": {
                "indicatorSave": "Erreur lors de l'enregistrement de l'indicateur",
                "indicatorDelete": "L'indicateur n'a pas été supprimé",
                "IndicatorNotfound": "Impossible de trouver l'indicateur",
                "datasetSave": "Erreur lors de l'enregistrement du jeu de données",
                "datasetDelete": "Erreur lors de la suppression du jeu de données"
            },
            'validate': {
                "year": "Le champ Année ne peut pas être vide.",
                "regionset": "Le champ Sélection de la région ne peut pas être vide."
            }
        }
    }
});
