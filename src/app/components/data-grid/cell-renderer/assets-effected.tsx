import { Cell } from '@tanstack/react-table';
import { VulnRecord } from '../../..//mockData';
import { Badge } from '../../../components/badge';

type CellRenderer = {
    cell: Cell<VulnRecord, unknown>;
}

export const AssetsEffectedCell = ({
    cell
}: CellRenderer) => {
    const value = cell.getContext().getValue() as string;

    return (
        <td key={cell.id} className='px-14'>
            <Badge>{value}</Badge>
        </td>
    );
};
