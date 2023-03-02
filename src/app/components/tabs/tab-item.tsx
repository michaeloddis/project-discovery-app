import React, { useState } from 'react';

type Props = {
    children: React.ReactNode;
    selected?: boolean;
};

export const TabItem = ({
    children,
    selected = false
}: Props) => {
    const [isSelected] = useState(selected);

    const selectedStyles = isSelected ? 'border-b-2 border-b-[#6366F1]' : 'text-[#A1A1AA]'

    return (
        <a
            role='button'
            tabIndex={0}
            href='/'
            className=''>
            <div className={`flex items-center gap-2 ${selectedStyles} font-normal text-sm h-[30px] hover:text-white transition-colors duration-200`}>
                {children}
            </div>
        </a>   
    );
};