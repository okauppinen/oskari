
import { StateHandler, mutatorMixin } from 'oskari-ui/util';
import { LayerListHandler } from './LayerList';

class UIStateHandler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.layerListHandler = new LayerListHandler(instance);
        this.layerListHandler.addStateListener(layerListState => this.updateState({
            layerList: {
                state: layerListState,
                mutator: this.state.layerList.mutator
            }
        }));
        this.state = {
            layerList: {
                state: this.layerListHandler.getState(),
                mutator: this.layerListHandler.getMutator()
            }
        };
        this.eventHandlers = this._createEventHandlers();
    }

    getLayerListHandler () {
        return this.layerListHandler;
    }

    setTab (tab) {
        this.updateState({ tab });
    }

    /// Oskari event handling ////////////////////////////////////////////////////////////

    /**
     * "Module" name for event handling
     */
    getName () {
        return 'LayerViewTabsHandler';
    }
    /**
    * @method onEvent
    * @param {Oskari.mapframework.event.Event} event a Oskari event object
    * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
    */
    onEvent (event) {
        const handler = this.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }
        return handler.apply(this, [event]);
    }

    _createEventHandlers () {
        const handlers = {
            'userinterface.ExtensionUpdatedEvent': event => {
                // ExtensionUpdateEvents are fired a lot, only let layerlist extension event to be handled when enabled
                if (event.getExtension().getName() !== this.instance.getName()) {
                    // wasn't me -> do nothing
                    return;
                }
                if (event.getViewState() === 'close' && this.hasStashedState()) {
                    this.useStashedState();
                    this.getLayerListHandler().getFilterHandler().useStashedState();
                }
            }
        };
        Object.getOwnPropertyNames(handlers).forEach(p => this.sandbox.registerForEventByName(this, p));
        return handlers;
    }
}

export const LayerViewTabsHandler = mutatorMixin(UIStateHandler, [
    'setTab'
]);