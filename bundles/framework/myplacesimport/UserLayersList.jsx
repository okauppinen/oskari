import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { Table, getSorterFor, ToolsContainer } from 'oskari-ui/components/Table';
import { DeleteButton } from 'oskari-ui/components/buttons';
import { EditIcon } from 'oskari-ui/components/icons';

export const UserLayersList = ({
    data = [],
    controller,
    loading
}) => {
    const columnSettings = [
        {
            align: 'left',
            title: <Message messageKey='tab.grid.name' />,
            dataIndex: 'name',
            sorter: getSorterFor('name'),
            defaultSortOrder: 'ascend',
            render: (title, item) => {
                return (
                    <a onClick={() => controller.openLayer(item.key)}>{title}</a>
                );
            }
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.description' />,
            dataIndex: 'description',
            sorter: getSorterFor('description')
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.createDate' />,
            dataIndex: 'created',
            sorter: getSorterFor('created'),
            render: title => Oskari.util.formatDate(title)
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.source' />,
            dataIndex: 'source',
            sorter: getSorterFor('source')
        },
        {
            align: 'left',
            title: <Message messageKey='tab.grid.actions' />,
            dataIndex: 'key',
            width: 100,
            render: (title, item) => {
                return (
                    <ToolsContainer>
                        <EditIcon onClick={() => controller.editUserLayer(item.key)} />
                        <DeleteButton icon
                            title={<Message messageKey='tab.confirmDeleteMsg' messageArgs={{ name: item.name }} />}
                            onConfirm={() => controller.deleteUserLayer(item.key)} />
                    </ToolsContainer>
                );
            }
        }
    ];

    return (
        <Table
            columns={columnSettings}
            dataSource={data.map(item => ({
                ...item,
                key: item.getId(),
                name: Oskari.util.sanitize(item.getName()),
                description: Oskari.util.sanitize(item.getDescription()),
                source: Oskari.util.sanitize(item.getSource()),
                created: item.getCreated()
            }))}
            pagination={false}
            loading={loading}
        />
    );
};

UserLayersList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    controller: PropTypes.object.isRequired,
    loading: PropTypes.bool
};
