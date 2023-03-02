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
    Cell
  } from '@tanstack/react-table';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useVirtual } from 'react-virtual';
import { fetchData, VulnRecord, VulnDataApiResponse, VulnData } from './mockData';
import { Checkbox } from './components/checkbox';
import { PageDetailTemplate } from './components/page-detail-template';
import { IconColumnSort, IconExternalLink, IconFilter, IconGraphFull, IconJira, IconRightArrow } from './components/icons';
import { Tag } from './components/tag';
import { Badge } from './components/badge';
import { capitalizeFirstLetter } from './utils';
import { TabBar, TabItem } from './components/tabs';
import { FilterButton } from './components/filter-button';
import { LinkButton } from './components/link-button';
  
const fetchSize = 25;

export function App() {
    const [rowSelection, setRowSelection] = React.useState<any>({});
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [viewAllVulns, setViewAllVulns] = React.useState(false);
  
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
          cell: info => { console.log(info.getValue()); return info.getValue<VulnData>(); },
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
            const end = !viewAllVulns ? 7 : null;
            console.log('end', end);
            const fetchedData = fetchData(start, fetchSize, sorting, end); // Pretend api call
            
            return fetchedData;
        },
        {
            getNextPageParam: (_lastGroup, groups) => groups.length,
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        }
    )
    
    console.log('data', data);
  
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
    }, [fetchMoreOnBottomReached, viewAllVulns])
  
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

    // Renders the standard cell renderer
    const renderCell = (cell: Cell<VulnRecord, unknown>) => {
        return (
            <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
        );
    };

    // Vuln data cell renderers
    const renderVulnDataCell = (cell: Cell<VulnRecord, unknown>) => {
        const vulnData = cell.getContext().getValue() as VulnData;

        return (
            <td 
                key={cell.id}
                className='flex flex-wrap gap-2 content-center items-center pt-3'>
                <span className='w-full'>{vulnData.name}</span>
                <Tag variant='icon'><IconGraphFull /></Tag>
                <Tag variant='low'>{vulnData.cve}</Tag>
                <Tag variant='low'>{vulnData.cwe}</Tag>
                <Tag variant='low'>{vulnData.type}</Tag>
            </td>
        );
    };

    // Risk column cell renderer
    const renderRiskCell = (cell: Cell<VulnRecord, unknown>) => {
        const risk = cell.getContext().getValue() as 'info' | 'high' | 'medium' | 'low' | 'critical';

        return (
            <td key={cell.id}>
                <Tag variant={risk}>{capitalizeFirstLetter(risk)}</Tag>
            </td>
        );
    };

    // Assets Effected column cell renderer
    const renderAssetsEffectedCell = (cell: Cell<VulnRecord, unknown>) => {
        const value = cell.getContext().getValue() as string;

        return (
            <td key={cell.id} className='px-14'>
                <Badge>{value}</Badge>
            </td>
        );
    };

    // Status column cell renderer
    const renderStatusCell = (cell: Cell<VulnRecord, unknown>) => {
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

    // Renders the visible table cells
    const renderVisibleCells = (row: Row<VulnRecord>) => {
        return (
            row.getVisibleCells().map(cell => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const cellMap: any = {
                    'vulnData': renderVulnDataCell,
                    'assetsEffected': renderAssetsEffectedCell,
                    'risk': renderRiskCell,
                    'dateFound': renderCell,
                    'status': renderStatusCell
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
            })
        )
    };

    // State rendering the table
    const renderTable = () => {
        return (
            <div
                className='container'
                onScroll={e => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
                ref={tableContainerRef}>
                <table className='brand table-fixed border-collapse border-spacing-0 w-full'>
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
                            const selected = Object.keys(rowSelection).length && rowSelection[row.id];

                            console.log('selected', selected);

                            console.log('row', row);
                            console.log('rowSelection', rowSelection);
                            
                            return (
                                <tr
                                    key={row.id}
                                    className={selected ? 'bg-[#18181B]' : 'hover:bg-[#18181B] duration-200 transition-colors'}>
                                    {renderVisibleCells(row)}
                                </tr>
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

    // Renders the footer content area
    const renderFooterContent = () => {
        const onClickHandler = () => {
           setViewAllVulns(state => !state);
        };


        return (    
            <div className='flex flex-col items-center'>
                <LinkButton
                    isDisabled={viewAllVulns}
                    icon={<IconRightArrow isDisabled={viewAllVulns} />}
                    onClick={onClickHandler}>
                    View All Vulnerabilities
                </LinkButton>
            </div>
        )
    }
    
    // Renders the Header content area
    const renderHeaderContent = () => {
        return (
            <div className='flex items-center justify-center flex-nowrap h-[72px] px-8'>
                <TabBar>
                    <TabItem selected>
                        Vulnerabilities
                        <Badge>20</Badge>
                    </TabItem>
                    <TabItem>
                        Assets
                        <Badge disabled>20</Badge>
                    </TabItem>
                    <TabItem>
                        Archive
                        <Badge disabled>20</Badge>
                    </TabItem>
                </TabBar>
                <span className='whitespace-nowrap mr-2'>Fetched {flatData.length} of {totalDBRowCount} Rows</span>
                <FilterButton>Filters <IconFilter /></FilterButton>
            </div>
        )
    }

    return (
        <div className='app'>
            <PageDetailTemplate
                headerContent={renderHeaderContent()}
                bodyContent={isLoading ? <div className='flex items-center justify-center'>Loading...</div> : renderTable()}
                footerContent={renderFooterContent()} />
        </div>
    )
}


export default App;
