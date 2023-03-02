import React from 'react';

type Props = {
    children: React.ReactNode;
};

export const FilterButton = ({
    children
}: Props) => {
    return (
        <button className={`p-2 h-[36px] w-[78px] text-sm bg-[#18181B] cursor-default text-[#A1A1AA] whitespace-nowrap rounded border border-[#27272A] flex flex-row text-center gap-0 flex-nowrap justify-center items-center`}>
            {children}
        </button>   
    );
};