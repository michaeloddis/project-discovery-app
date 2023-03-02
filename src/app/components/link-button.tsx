import React from 'react';

type Props = {
    children: React.ReactNode;
    icon?: React.ReactElement;
    onClick?: () => void;
    isDisabled?: boolean;
};

export const LinkButton = ({
    children,
    icon,
    onClick,
    isDisabled = false
}: Props) => {
    const otherProps = {
        disabled: isDisabled
    };

    let buttonStyles = 'group p-2 h-[36px] w-fit text-sm text-[#6366F1] transition-all duration-200 hover:text-white hover:gap-2 whitespace-nowrap flex flex-row text-center gap-0 flex-nowrap justify-center items-center';

    if (isDisabled) {
        buttonStyles = 'group p-2 h-[36px] w-fit text-sm text-[#999999] whitespace-nowrap flex flex-row text-center gap-0 flex-nowrap justify-center items-center';
    }

    return (
        <button
            {...otherProps}
            className={buttonStyles}
            onClick={onClick}>
            {children} {icon}
        </button>   
    );
};