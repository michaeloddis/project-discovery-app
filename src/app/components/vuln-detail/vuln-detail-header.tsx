import { TabBar, TabItem } from '../tabs';
import { Badge } from '../badge';
import { IconFilter } from '../icons';
import { FilterButton } from '../filter-button';

export const VulnDetailHeader = () => {
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
            <FilterButton>Filters <IconFilter /></FilterButton>
        </div>
    )
};
