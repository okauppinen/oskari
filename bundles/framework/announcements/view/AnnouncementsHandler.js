import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { isUpcoming, isOutdated, isActive } from '../service/util';

// Handler for announcements. Handles state and service calls.
class ViewHandler extends StateHandler {
    constructor (service) {
        super();
        this.service = service;
        this.service.on('controller', () => this.notify());
        this.service.on('fetch', () => this.onFetch());
        this.service.fetchAnnouncements();
    }

    onFetch () {
        const announcements = this.service.getAnnouncements();
        const dontShowAgain = this.service.getIdsFromLocalStorage();

        // Admin gets all announcements
        const active = announcements.filter(a => isActive(a));

        const newState = {
            outdated: announcements.filter(a => isOutdated(a)),
            upcoming: announcements.filter(a => isUpcoming(a)),
            active,
            dontShowAgain
        };
        // Filter active announcements to show in banner or popup
        // Empty array in state -> already shown, don't populate array more than once
        if (!this.state.popupAnnouncements) {
            newState.popupAnnouncements = active.filter(ann => ann.options.showAsPopup && !dontShowAgain.includes(ann.id));
        }
        if (!this.state.bannerAnnouncements) {
            newState.bannerAnnouncements = active.filter(ann => !ann.options.showAsPopup && !dontShowAgain.includes(ann.id));
        }
        this.updateState(newState);
    }

    getToolController () {
        const controller = this.service.getAdminController();
        if (controller) {
            controller.preview = (id) => this.preview(id);
        }
        return controller;
    }

    preview (id) {
        const ann = this.service.getAnnouncement(id);
        if (!ann) {
            return;
        }
        if (ann.options.showAsPopup) {
            this.updateState({ popupAnnouncements: [ann] });
        } else {
            this.updateState({ bannerAnnouncements: [ann] });
        }
    }

    setShowAgain (id, dontShow) {
        if (dontShow) {
            this.service.addToLocalStorage(id);
        } else {
            this.service.removeFromLocalStorage(id);
        }
        const dontShowAgain = this.service.getIdsFromLocalStorage();
        this.updateState({ dontShowAgain });
    }

    onPopupClose () {
        this.updateState({ popupAnnouncements: [] });
    }

    onBannerClose () {
        this.updateState({ bannerAnnouncements: [] });
    }

    onBannerChange (currentBanner) {
        this.updateState({ currentBanner });
    }

    onPopupChange (currentPopup) {
        this.updateState({ currentPopup });
    }
}

export const AnnouncementsHandler = controllerMixin(ViewHandler, [
    'setShowAgain', 'onPopupClose', 'onPopupChange', 'onBannerClose', 'onBannerChange', 'getToolController'
]);
