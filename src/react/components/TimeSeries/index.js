import styled from 'styled-components';

export { showTimeSeriesPlayer } from './TimeSeriesPlayer';
export { TimeSeriesHeader } from './TimeSeriesHeader';
export { TimeSeriesSlider } from './TimeSeriesSlider';

export const Background = styled.div(({ isMobile, textColor, backgroundColor }) => ({
    'minHeight': isMobile ? '120px !important' : '90px !important',
    'width': isMobile ? '350px !important' : '500px !important',
    'color': textColor || '#ffffff',
    'background-color': backgroundColor || '#3c3c3c'
}));

export const Header = styled.h3`
    padding: 10px 20px;
    cursor: grab;
    display: flex;
    align-items: center;
    color: ${props => props?.textColor ? props?.textColor : '#ffffff'};
    .header-mid-spacer {
        flex: 1;
    }
`;
