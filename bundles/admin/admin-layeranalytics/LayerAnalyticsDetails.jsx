import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'oskari-ui/components/Table';
import { Button, Message, Space, Spin, Link } from 'oskari-ui';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { DeleteButton } from 'oskari-ui/components/buttons';

const dateLocale = 'fi-FI';
const localeDateOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
};

const sorterTooltipOptions = {
    title: <Message messageKey='flyout.sorterTooltip' />
};

// timestamp formatting copied from admin-layereditor in oskari-frontend
// TO-DO: Move both to helper class
const formatTimestamp = (timestamp) => {
    let date;
    if (typeof timestamp !== 'undefined') {
        date = new Date(timestamp);
    }
    return formatDate(date) + ' ' + formatTime(date);
};
const formatDate = (date) => {
    if (typeof date === 'undefined') {
        return '--.--.----';
    }
    return date.toLocaleDateString(dateLocale, localeDateOptions);
};

const formatTime = (date) => {
    if (typeof date === 'undefined') {
        return '--:--:--';
    }
    return date.toLocaleTimeString(dateLocale).replace(/\./g, ':');
};

const generateLink = (item) => {
    let toScaleURL = '/?coord=' + item.x + '_' + item.y;

    toScaleURL += '&mapLayers=';
    for (const [index, value] of item.layers.entries()) {
        toScaleURL += value; // add layer id
        toScaleURL += '+100'; // add layer opacity
        toScaleURL += '+'; // add layer default style as empty string
        if (index !== (item.layers.length - 1)) {
            toScaleURL += ','; // add layer separator if not last layer in item
        }
    }

    toScaleURL += '&zoomLevel=' + item.z;

    return toScaleURL;
};

export const LayerAnalyticsDetails = ({ layerData, isLoading, closeDetailsCallback, removeAnalyticsCallback }) => {
    const columnSettings = [
        {
            title: <b><Message messageKey='flyout.successTitle' /></b>,
            dataIndex: 'success',
            sortDirections: ['descend', 'ascend', 'descend'],
            sorter: (a, b) => a.success - b.success,
            showSorterTooltip: sorterTooltipOptions
        },
        {
            title: <b><Message messageKey='flyout.failureTitle' /></b>,
            dataIndex: 'errors',
            sortDirections: ['descend', 'ascend', 'descend'],
            sorter: (a, b) => a.errors - b.errors,
            showSorterTooltip: sorterTooltipOptions
        },
        {
            title: 'Aika',
            dataIndex: 'time',
            defaultSortOrder: 'descend',
            sortDirections: ['descend', 'ascend', 'descend'],
            sorter: (a, b) => a.time - b.time,
            showSorterTooltip: sorterTooltipOptions,
            render: (text) => <Space>{ formatTimestamp(text) }</Space>
        },
        {
            title: '',
            key: 'movetoscale',
            render: (text, entry) => entry.stack.map((item, index) => {
                const link = generateLink(item);
                return (
                    <Fragment key={ link }>
                        <Link url={link} tooltip={<Message messageKey='flyout.moveToScaleTooltip' />} >
                            <Message messageKey='flyout.moveToScale' /> { index + 1 }
                        </Link>
                        <br/>
                    </Fragment>
                );
            })
        },
        {
            title: '',
            key: 'remove',
            render: (text, entry) => (
                <DeleteButton icon
                    title={<Message messageKey='flyout.removeSingleDataForLayer' />}
                    onConfirm={() => removeAnalyticsCallback(layerData.id, entry.time)}
                />
            )
        }
    ];

    if (isLoading) {
        return (<Spin/>);
    }

    return (
        <Space direction='vertical' style={{ width: '100%' }}>
            <Button onClick={ () => closeDetailsCallback() } >
                <ArrowLeftOutlined /> <Message messageKey='flyout.backToList' />
            </Button>
            <b>{ layerData.title }</b>
            { layerData.layerOrganization &&
                <div><Message messageKey='flyout.layerDataProvider' />: { layerData.layerOrganization }</div>
            }
            <div><Message messageKey='flyout.successTitle' />: { layerData.success } ({ layerData.successPercentage }%)</div>
            <div><Message messageKey='flyout.failureTitle' />: { layerData.errors }</div>
            { layerData.details.length > 0 &&
                <Table
                    columns={ columnSettings }
                    dataSource={ layerData.details.map(item => {
                        return {
                            key: item.time,
                            ...item
                        };
                    }) }
                    pagination={{ position: ['none', 'none'] }}
                />
            }
        </Space>
    );
};

LayerAnalyticsDetails.propTypes = {
    layerData: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    closeDetailsCallback: PropTypes.func.isRequired,
    removeAnalyticsCallback: PropTypes.func.isRequired
};
