import { playerSpeed, playerSkip } from './constants';
import { BUNDLE_KEY } from 'oskari-ui';

const loc = key => Oskari.getMsg(BUNDLE_KEY, `TimeSeries.${key}`);
export const getPlayerOptions = keys => {
    const addSpeed = keys.includes('speed');
    const addSkip = keys.includes('skip');
    const options = [];
    if (addSpeed) {
        options.push({
            key: 'speed',
            label: loc('label.animationSpeed'),
            children: Object.keys(playerSpeed).map(key => ({ key, label: loc(`animationSpeed.${key}`)}))
        });
    }
    if (addSkip) {
        options.push({
            key: 'skip',
            label: loc('label.skipAhead'),
            children: Object.keys(playerSkip).map(key => ({ key, label: loc(`skip.${key}`)}))
        });
    }
    if (options.length === 1) {
        options[0].type = 'group';
    }
    return options;
};
