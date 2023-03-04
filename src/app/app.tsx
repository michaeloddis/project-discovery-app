import React from 'react';

import { PageDetailTemplate } from './components/page-detail-template';
import { VulnDetailFooter, VulnDetailHeader } from './components/vuln-detail';
import { VulnTable } from './components/vuln-detail/vuln-table';

export function App () {
    const [viewAllVulns, setViewAllVulns] = React.useState(false);
    
    const onClickHandler = () => {
        setViewAllVulns(state => !state);
     };

    return (
        <div className='flex items-center flex-col'>
            <PageDetailTemplate
                headerContent={<VulnDetailHeader />}
                bodyContent={<VulnTable enableViewAll={viewAllVulns} />}
                footerContent={<VulnDetailFooter isDisabled={viewAllVulns} onClickHandler={onClickHandler} />} />
        </div>
    )
}

export default App;
