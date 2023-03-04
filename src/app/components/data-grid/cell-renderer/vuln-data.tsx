import { Cell } from '@tanstack/react-table';
import { VulnRecord, VulnData } from '../../..//mockData';
import { Tag } from '../../../components/tag';
import { IconGraphFull } from '../../../components/icons';

type CellRenderer = {
    cell: Cell<VulnRecord, unknown>;
}

export const VulnDataCell = ({
    cell
}: CellRenderer) => {
    const vulnData = cell.getContext().getValue() as VulnData;

    return (
        <td 
            key={cell.id}
            className='flex flex-wrap gap-2 content-center items-center pt-4 sm:pl-6 md:pl-4 lg:pl-0 sm:pr-6 md:pr-4 lg:pr-0 pr-4 '>
            <span className='w-full'>{vulnData.name}</span>
            <Tag variant='icon'><IconGraphFull /></Tag>
            <Tag variant='low'>{vulnData.cve}</Tag>
            <Tag variant='low'>{vulnData.cwe}</Tag>
            <Tag variant='low'>{vulnData.type}</Tag>
        </td>
    );
};