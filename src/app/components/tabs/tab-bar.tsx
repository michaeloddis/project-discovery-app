import React from 'react';

type Props = {
    children: React.ReactNode;
};

export const TabBar = ({
    children
}: Props) => {
    return (
        <div className='flex flex-nowrap w-full px-0 py-2 gap-8'>
            {children}
        </div>   
    );
};