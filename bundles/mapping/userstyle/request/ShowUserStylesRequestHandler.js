/**
 * @class Oskari.mapframework.userstyle.request.ShowUserStylesRequestHandler
 *
 * Handles user style functionality.
 */
Oskari.clazz.define('Oskari.mapframework.userstyle.request.ShowUserStylesRequestHandler',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.mapwfs2.plugin.WfsLayerPlugin} plugin
     */

    function (instance) {
        this.instance = instance;
        this.localization = Oskari.getMsg.bind(null, 'userstyle');
        /* templates */
        this.template = {};
        var p;
        for (p in this.__templates) {
            if (this.__templates.hasOwnProperty(p)) {
                this.template[p] = jQuery(this.__templates[p]);
            }
        }
    }, {
        __templates: {
            wrapper: '<div></div>',
            toolsButton: '<div style= "display: inline-block; border: 1px solid;"></div>',
            link: '<div class="link"><a href="javascript:void(0);"></a></div></div>'
        },

        /**
         * @method handleRequest
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.userstyle.request.ShowUserStylesRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            const layerId = request.getLayerId();
            const styleName = request.getStyleName();
            const createNew = request.isCreateNew();
            const userStylesForLayer = this.instance.getService().getUserStylesForLayer(layerId);
            if (userStylesForLayer.length > 0 && !styleName && !createNew) {
                this._showUserStylesList(layerId);
            } else {
                this._showVisualizationForm(layerId, styleName);
            }
        },
        _showVisualizationForm (layerId, styleName, createNew) {
            const service = this.instance.getService();
            // init popup
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var title = this.localization('popup.title');
            var content = this.template.wrapper.clone();
            var style;
            if (styleName) {
                style = service.getUserStyle(layerId, styleName);
            }
            // add form
            content.append(service.getCustomStyleEditorForm(style));

            // buttons
            var saveOwnStyleBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            saveOwnStyleBtn.setTitle(this.localization('popup.button.save'));
            saveOwnStyleBtn.addClass('primary save-user-style');
            saveOwnStyleBtn.setHandler(() => {
                service.saveUserStyle(layerId, styleName);
                dialog.close();
            });

            var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelBtn.setTitle(this.localization('popup.button.cancel'));
            cancelBtn.setHandler(function () {
                dialog.close();
            });

            // show popup
            dialog.addClass('user_style');
            dialog.show(title, content, [cancelBtn, saveOwnStyleBtn]);
        },
        _showUserStylesList (layerId) {
            const flyout = this.instance.getFlyout();
            flyout.setLayerId(layerId);
            flyout.show();
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });