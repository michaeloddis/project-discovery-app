
import { Cell } from '@tanstack/react-table';
import { VulnRecord } from '../../..//mockData';
import { Tag } from '../../../components/tag';
import { capitalizeFirstLetter } from '../../../utils';

type CellRenderer = {
    cell: Cell<VulnRecord, unknown>;
}

export const RiskCell = ({
    cell
}: CellRenderer) => {
    const risk = cell.getContext().getValue() as 'info' | 'high' | 'medium' | 'low' | 'critical';

    return (
        <td key={cell.id}>
            <Tag variant={risk}>{capitalizeFirstLetter(risk)}</Tag>
        </td>
    );
};
