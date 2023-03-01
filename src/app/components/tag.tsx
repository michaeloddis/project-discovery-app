import React from 'react';

type Props = {
    children: React.ReactNode;
    variant?: 'standard' | 'info' | 'low' | 'medium' | 'high' | 'critical';
};

export const Tag = ({
    children
}: Props) => {
    return (
        <div className='px-4 h-[24px] w-fit rounded bg-stone-400 text-white flex flex-row text-center justify-center items-center'>{children}</div>
    );
};