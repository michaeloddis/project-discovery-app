
import { Cell, flexRender } from '@tanstack/react-table';
import { VulnRecord } from '../../..//mockData';

type CellRenderer = {
    cell: Cell<VulnRecord, unknown>;
}

export const GenericCell = ({
    cell
}: CellRenderer) => {
    return (
        <td key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
    );
};
