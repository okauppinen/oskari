import { AbstractPublisherTool } from '../../publisher2/tools/AbstractPublisherTool';

class TimeSeriesTool extends AbstractPublisherTool {
    constructor (...args) {
        super(...args);
        this.index = 1;
        this.group = 'additional';
    }

    init (data) {
        const { id } = this.getTool();
        const { config } = data.configuration?.timeseries?.conf?.plugins?.find(p => p.id === id) || {};

        const enabled = config ? config.showControl : !this.isDisabled();
        this.setEnabled(enabled);
    }

    getTool () {
        return {
            id: 'Oskari.mapframework.bundle.timeseries.TimeseriesControlPlugin',
            title: Oskari.getMsg('timeseries', 'publisher.TimeseriesControlPlugin.toolLabel'),
            hasNoPlugin: true
        };
    }

    /**
    * Set enabled.
    * @method setEnabled
    * @public
    *
    * @param {Boolean} enabled is tool enabled or not
    */
    setEnabled (enabled) {
        super.setEnabled(enabled);
        this.getSandbox().postRequestByName('Timeseries.ConfigurationRequest', ['config', { showControl: enabled }]);
    }

    /**
    * Is this tool disabled.
    * @method isDisabled
    * @public
    *
    * @returns {Boolean} is tool disabled
    */
    isDisabled () {
        return !this._getState().time;
    }

    /**
     * Don't show the tool if this code is loaded BUT the timeseries bundle is not started as part of the appsetup
     */
    isDisplayed () {
        return !!this.getSandbox().getStatefulComponents().timeseries;
    }

    _getState () {
        const { timeseries } = this.getSandbox().getStatefulComponents();
        return timeseries ? timeseries.getState() : {};
    }

    /**
    * Get values.
    * @method getValues
    * @public
    *
    * @returns {Object} tool value object
    */
    getValues () {
        if (!this.isEnabled()) {
            // Don't include timeseries at all
            return null;
        }
        const { id } = this.getTool();
        const config = { showControl: true };
        // TODO: conf: {} ??
        return {
            configuration: {
                timeseries: {
                    conf: {
                        plugins: [{ id, config }]
                    },
                    state: this._getState()
                }
            }
        };
    }
}

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.publisher.TimeSeriesTool',
    TimeSeriesTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);

export { TimeSeriesTool };
