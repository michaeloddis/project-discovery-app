import React from 'react';

type Props = {
    children: React.ReactNode;
    disabled?: boolean;
};

export const Badge = ({
    children,
    disabled = false
}: Props) => {
    const styles = disabled ? 'text-[#A1A1AA]' : 'text-white'

    return (
        <div className={`${styles} px-1 h-[20px] w-fit text-xs whitespace-nowrap rounded border border-low bg-risk-low flex flex-row text-center gap-2 flex-nowrap justify-center items-center`}>
            {children}
        </div>
    );
};