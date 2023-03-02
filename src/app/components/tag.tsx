import React from 'react';

type Props = {
    children: React.ReactNode;
    variant?: 'info' | 'low' | 'medium' | 'high' | 'critical' | 'jira-create' | 'jira-open' | 'icon';
};

export const Tag = ({
    children,
    variant = 'info'
}: Props) => {
    let styles = '';
    if (variant === 'critical') {
        styles = 'px-3 border-critical bg-risk-critical text-white';
    } else if (variant === 'high') {
        styles = 'px-3  border-high bg-risk-high text-white';
    } else if (variant === 'medium') {
        styles = 'px-3 border-medium bg-risk-medium text-white';
    } else if (variant === 'low') {
        styles = 'px-3 border-low bg-risk-low text-[#A1A1AA]';
    } else if (variant === 'jira-create') {
        styles = 'px-3 border-blue-600 bg-status-jira-create text-white';
    } else if (variant === 'jira-open') {
        styles = 'px-3 border-gray-700 bg-status-jira-open text-white';
    } else if (variant === 'icon') {
        styles = 'border-low bg-risk-low text-[#A1A1AA] px-1 gap-0';
    } else {
        styles = 'px-3 border-info bg-risk-info text-white';
    }

    return (
        <div className={`h-[24px] w-fit text-xs whitespace-nowrap rounded border ${styles} flex flex-row text-center gap-2 flex-nowrap justify-center items-center`}>
            {children}
        </div>
    );
};