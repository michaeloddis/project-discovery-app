import React from 'react';

type Props = {
    children: React.ReactNode;
    variant: 'standard' | 'info' | 'low' | 'medium' | 'high' | 'critical';
};

export const Tag = ({
    children,
    variant
}: Props) => {
    return (
        <div className='flex flex-row text-center justify-center items-center'>{children}</div>
    );
};