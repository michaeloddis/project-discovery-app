/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    HeaderGroup,
    Row,
    SortingState,
    useReactTable,
  } from '@tanstack/react-table';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useVirtual } from 'react-virtual';
import { fetchData, VulnRecord, VulnDataApiResponse, VulnData } from '../../mockData';
import { Checkbox } from '../../components/checkbox';
import { IconColumnSort } from '../../components/icons';
import { AssetsEffectedCell, GenericCell, RiskCell, VulnDataCell } from '../../components/data-grid';
import { StatusCell } from '../../components/data-grid/cell-renderer/status';

type VulnTableCellMap = {
    vulnData: React.ReactNode;
    assetsEffected: React.ReactNode;
    risk: React.ReactNode;
    dateFound: React.ReactNode;
    status: React.ReactNode;
};

type Props = {
    enableViewAll: boolean;
};
  
const fetchSize = 25;

export const VulnTable = ({
    enableViewAll = false
}: Props) => {
    const [rowSelection, setRowSelection] = React.useState<any>({});
    const [sorting, setSorting] = React.useState<SortingState>([]);
  
    // Reference to the scrolling element used by logic down below
    const tableContainerRef = React.useRef<HTMLDivElement>(null);
  
    // Builds the columnDefs for the table
    const columns = React.useMemo<ColumnDef<VulnRecord>[]>(
      () => [
        {
            id: 'select',
            header: ({ table }) => (
                <div className="px-[33px]">
                    <Checkbox
                        {...{
                        checked: table.getIsAllRowsSelected(),
                        indeterminate: table.getIsSomeRowsSelected(),
                        onChange: table.getToggleAllRowsSelectedHandler(),
                        }}
                    />
                </div>
            ),
            size: 50,
            cell: ({ row }) => (
              <div className="px-[32px]">
                <Checkbox
                  {...{
                    checked: row.getIsSelected(),
                    disabled: !row.getCanSelect(),
                    indeterminate: row.getIsSomeSelected(),
                    onChange: row.getToggleSelectedHandler(),
                  }}
                />
              </div>
            )
        },
        {
          accessorKey: 'vulnData',
          header: 'Vulnerability',
          size: 260,
          cell: info => info.getValue<VulnData>(),
        },
        {
            accessorKey: 'dateFound',
            header: 'Date Found',
            size: 80,
            cell: info => info.getValue<Date>().toLocaleString()
        },
        {
          accessorKey: 'risk',
          size: 50,
          header: () => 'Risk'
        },
        {
          accessorKey: 'assetsEffected',
          size: 85,
          header: () => <span>Assets Effected</span>
        },
        {
          accessorKey: 'status',
          size: 114,
          header: 'Status',
        }
      ],
      []
    )
  
    // React-query has an useInfiniteQuery hook just for this situation!
    const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery<VulnDataApiResponse>(
        ['table-data', sorting], // Adding sorting state as key causes table to reset and fetch from new beginning upon sort
        
        async ({ pageParam = 0 }) => {
            const start = pageParam * fetchSize;
            const end = !enableViewAll ? 7 : null;
            const fetchedData = fetchData(start, fetchSize, sorting, end); // Pretend api call
            
            return fetchedData;
        },
        {
            getNextPageParam: (_lastGroup, groups) => groups.length,
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        }
    )
  
    // We must flatten the array of arrays from the useInfiniteQuery hook
    const flatData = React.useMemo(() => data?.pages?.flatMap(page => page.data) ?? [], [data]);
    const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0;
    const totalFetched = flatData.length;
  
    // Called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
    const fetchMoreOnBottomReached = React.useCallback(
      (containerRefElement?: HTMLDivElement | null) => {
        if (containerRefElement) {
            const { scrollHeight, scrollTop, clientHeight } = containerRefElement
            
            // Once the user has scrolled within 300px of the bottom of the table, fetch more data if there is any
            if (
                scrollHeight - scrollTop - clientHeight < 300 &&
                !isFetching &&
                totalFetched < totalDBRowCount
            ) {
                fetchNextPage()
            }
        }
      },
      [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
    );
  
    // A check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
    React.useEffect(() => {
        fetchMoreOnBottomReached(tableContainerRef.current)
    }, [fetchMoreOnBottomReached, enableViewAll])
  
    const table = useReactTable({
        data: flatData,
        columns,
        state: {
            sorting,
            rowSelection
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
    });
    
    // Get the row data
    const { rows } = table.getRowModel();
  
    // Virtualizing is optional, but might be necessary if we are going to potentially have hundreds or thousands of rows
    const rowVirtualizer = useVirtual({
        parentRef: tableContainerRef,
        size: rows.length,
        overscan: 10,
    });

    const { virtualItems: virtualRows, totalSize } = rowVirtualizer;
    
    const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
    const paddingBottom = virtualRows.length > 0
        ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
        : 0;

    const renderTableHeaders = (headerGroup: HeaderGroup<VulnRecord>) => {
        const determineSortDirection = (sorted: string) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const directionOptions: any = { asc: <IconColumnSort />, desc: <IconColumnSort />};
            
            return directionOptions[sorted] ?? null;
        };
    
        return (
            headerGroup.headers.map(header => {
                return (
                    <th
                        className={`header-${header.id}`}
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{ width: header.getSize() }}
                    >
                        {header.isPlaceholder ? null : (
                            <div
                                {...{
                                    className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                                    onClick: header.column.getToggleSortingHandler(),
                                }}
                            >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {determineSortDirection(header.column.getIsSorted() as string)}
                            </div>
                        )}
                    </th>
                );
            })
        )
    }

    const renderTableHeaderGroups = () => {
        return (
            table.getHeaderGroups().map(headerGroup => (
                <tr
                    key={headerGroup.id}>
                    {renderTableHeaders(headerGroup)}
                </tr>
            ))
        );
    };

    // Renders the visible table cells
    const renderVisibleCells = (row: Row<VulnRecord>) => {
        return (
            row.getVisibleCells().map(cell => {
                const cellMap: VulnTableCellMap | any = {
                    'vulnData': <VulnDataCell key={cell.id} cell={cell} />,
                    'assetsEffected': <AssetsEffectedCell key={cell.id} cell={cell} />,
                    'risk': <RiskCell key={cell.id} cell={cell} />,
                    'dateFound':  <GenericCell key={cell.id} cell={cell} />,
                    'status': <StatusCell key={cell.id} cell={cell} />
                };

                const isValidCell = [
                    'vulnData',
                    'assetsEffected',
                    'risk',
                    'dateFound',
                    'status'
                ].includes(cell?.column?.id)

                if (isValidCell) {
                    return cellMap[cell?.column?.id];
                } else {
                    return <GenericCell key={cell.id} cell={cell} />;
                }
            })
        )
    };

    const renderTableBodyTopRow = () => {
        if (paddingTop > 0) {
            return (
                <tr>
                    <td style={{ height: `${paddingTop}px` }} />
                </tr>
            )
        }
    };

    const renderTableBodyBottomRow = () => {
        if (paddingBottom > 0) {
            return (
                <tr>
                    <td style={{ height: `${paddingBottom}px` }} />
                </tr>
            )
        }
    };

    // sm:h-36 md:h-28 lg:h-[80px]
    const renderTableBodyContent = () => {
        return (
            virtualRows.map(virtualRow => {
                const row = rows[virtualRow.index] as Row<VulnRecord>;
                const selected = Object.keys(rowSelection).length && rowSelection[row.id];
                
                return (
                    <tr
                        key={row.id}
                        className={selected ? 'bg-[#18181B] h-20' : 'hover:bg-[#18181B] duration-200 transition-colors h-20'}>
                        {renderVisibleCells(row)}
                    </tr>
                );
            })
        );
    };

    // State rendering the table
    const renderTable = () => {
        return (
            <div
                className='container'
                onScroll={e => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
                ref={tableContainerRef}>
                <table className='brand table-fixed border-collapse border-spacing-0 w-full'>
                    <thead className='bg-[#1E1E1E] m-0 top-0 sticky'>
                        {renderTableHeaderGroups()}
                    </thead>
                    <tbody>
                        {renderTableBodyTopRow()}
                        {renderTableBodyContent()}
                        {renderTableBodyBottomRow()}
                    </tbody>
                </table>
            </div>
        )
    }

    return isLoading ? <div className='flex items-center justify-center'>Loading...</div> : renderTable();
};
