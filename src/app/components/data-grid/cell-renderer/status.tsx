
import { Cell } from '@tanstack/react-table';
import { VulnRecord } from '../../..//mockData';
import { Tag } from '../../../components/tag';
import { IconExternalLink, IconJira } from '../../../components/icons';

type CellRenderer = {
    cell: Cell<VulnRecord, unknown>;
}

export const StatusCell = ({
    cell
}: CellRenderer) => {
    const value = cell.getContext().getValue() as string as 'jira-create' | 'jira-open' ;
        
    let statusLabel = 'Create Jira';
    let icon = <IconExternalLink />;

    if (value === 'jira-open') {
        statusLabel = 'Open Jira';
        icon = <IconJira />;
    }

    return (
        <td key={cell.id}>
            <Tag variant={value}>
                {icon} {statusLabel}
            </Tag>
        </td>
    );
};
