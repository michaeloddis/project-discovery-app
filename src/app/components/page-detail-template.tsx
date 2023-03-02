import React, { ReactNode } from 'react';

type Props = {
    headerContent: ReactNode;
    bodyContent: ReactNode;
    footerContent: ReactNode;
}

export const PageDetailTemplate = ({
    headerContent,
    bodyContent,
    footerContent
}: Props) => {
    return (
        <div className="page-detail-template_root">
            <div className="page-detail-template_header">{headerContent}</div>
            <div className="page-detail-template_body">{bodyContent}</div>
            <div className="page-detail-template_footer h-[80px]">{footerContent}</div>
        </div>
    );
};