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
    Cell
  } from '@tanstack/react-table';
  import { useInfiniteQuery } from '@tanstack/react-query';
  import { useVirtual } from 'react-virtual';
  import { fetchData, VulnRecord, PersonApiResponse, VulnData } from './mockData';
  import { Checkbox } from './components/checkbox';
import { PageDetailTemplate } from './components/page-detail-template';
import { motion } from "framer-motion";
import { IconColumnSort } from './components/icon-column-sort';
  
  const fetchSize = 25

  export function App() {
    const [rowSelection, setRowSelection] = React.useState({});
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
            size: 80,
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
          size: 250,
          cell: info => { console.log(info.getValue()); return info.getValue<VulnData>(); },
        },
        {
            accessorKey: 'dateFound',
            header: 'Date Found',
            size: 80,
            cell: info => info.getValue<Date>().toLocaleString(),
        },
        {
          accessorKey: 'risk',
          size: 60,
          header: () => 'Risk'
        },
        {
          accessorKey: 'assetsEffected',
          size: 60,
          header: () => <span>Assets Effected</span>
        },
        {
          accessorKey: 'status',
          size: 60,
          header: 'Status',
        }
      ],
      []
    )
  
    // React-query has an useInfiniteQuery hook just for this situation!
    const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery<PersonApiResponse>(
        ['table-data', sorting], // Adding sorting state as key causes table to reset and fetch from new beginning upon sort
        
        async ({ pageParam = 0 }) => {
            const start = pageParam * fetchSize
            const fetchedData = fetchData(start, fetchSize, sorting) //pretend api call
            return fetchedData
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
    }, [fetchMoreOnBottomReached])
  
    const table = useReactTable({
        data: flatData,
        columns,
        state: {
            sorting,
            rowSelection
        },
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
    });
    
    // Get the row data
    const { rows } = table.getRowModel();
  
    //Virtualizing is optional, but might be necessary if we are going to potentially have hundreds or thousands of rows
    const rowVirtualizer = useVirtual({
        parentRef: tableContainerRef,
        size: rows.length,
        overscan: 10,
    });

    const { virtualItems: virtualRows, totalSize } = rowVirtualizer;
    
    const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
    
    const paddingBottom = 
        virtualRows.length > 0
        ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
        : 0;
  
    if (isLoading) {
        return <>Loading...</>;
    }

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

    const renderVulnDataCell = (cell: Cell<VulnRecord, unknown>) => {
        const vulnData = cell.getContext().getValue() as VulnData;
                    
        console.log('context', cell.getContext().getValue());

        return (
            <td key={cell.id}>
                {vulnData.name}
            </td>
        );
    };

    const renderCell = (cell: Cell<VulnRecord, unknown>) => {
        console.log('Beep', cell.column);
        
        return (
            <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
        );
    };

    const renderVisibleCells = (row: Row<VulnRecord>) => {
        return (
            row.getVisibleCells().map(cell => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const cellMap: any = {
                    'vulnData': renderVulnDataCell,
                    'assetsEffected': renderCell,
                    'risk': renderCell,
                    'dateFound': renderCell,
                    'status': renderCell
                };

                if ([
                        'vulnData',
                        'assetsEffected',
                        'risk',
                        'dateFound',
                        'status'
                    ].includes(cell?.column?.id)) {
                    return cellMap[cell?.column?.id](cell);
                } else {
                    return renderCell(cell);
                }

                /*
                switch (cell?.column?.id) {
                    case 'vulnData':
                        return renderVulnDataCell(cell);
                    case 'assetsEffected':
                        return renderCell(cell);
                    case 'risk':
                        return renderCell(cell);
                    case 'dateFound':
                        return renderCell(cell);
                    case 'status':
                        return renderCell(cell);
                    default:
                        return renderCell(cell);
                };
                */
            })
        )
    };

    const renderTable = () => {
        return (
            <div
                className='container'
                onScroll={e => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
                ref={tableContainerRef}>
                <table>
                    <thead>
                        {renderTableHeaderGroups()}
                    </thead>
                    <tbody>
                        {paddingTop > 0 && (
                            <tr>
                                <td style={{ height: `${paddingTop}px` }} />
                            </tr>
                        )}
                        {virtualRows.map(virtualRow => {
                            const row = rows[virtualRow.index] as Row<VulnRecord>;
                            
                            return (
                                <motion.tr
                                    key={row.id}
                                    whileHover={{ backgroundColor: '#18181B' }}
                                    transition={{
                                        type: 'tween',
                                        duration: 0.1
                                    }}
                                    className={Object.keys(rowSelection).length ? 'bg-[#18181B]' : ''}>
                                    {renderVisibleCells(row)}
                                </motion.tr>
                            );
                        })}
                        {paddingBottom > 0 && (
                            <tr>
                                <td style={{ height: `${paddingBottom}px` }} />
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }

    const renderFooterContent = () => {
        return (    
            <div>
                Fetched {flatData.length} of {totalDBRowCount} Rows.
            </div>
        )
    }
    
    const renderHeaderContent = () => {
        return (
            <div>Header Content</div>
        )
    }

    return (
        <div className='app'>
            <PageDetailTemplate
                headerContent={renderHeaderContent()}
                bodyContent={renderTable()}
                footerContent={renderFooterContent()} />
        </div>
    )
}


export default App;
