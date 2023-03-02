import React from 'react';

type Props = {
    isDisabled?: boolean;
};

export const IconRightArrow = ({
    isDisabled = false
}: Props) => {
    let styles = 'inline-flex pl-2 justify-center items-center fill-[#6366F1] group-hover:fill-white';

    if (isDisabled) {
        styles = 'inline-flex pl-2 justify-center items-center fill-[#999999]';
    }

    return (
        <div className={styles}>
            <svg width="7" height="9" viewBox="0 0 7 9" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M0.988427 8.79285C0.730041 8.52413 0.73842 8.09682 1.00714 7.83844L4.55111 4.5L1.00714 1.16156C0.738419 0.903177 0.730041 0.475873 0.988426 0.207152C1.24681 -0.0615683 1.67412 -0.0699471 1.94284 0.188438L5.99284 4.01344C6.12519 4.1407 6.19999 4.31639 6.19999 4.5C6.19999 4.68361 6.12519 4.8593 5.99284 4.98656L1.94284 8.81156C1.67412 9.06995 1.24681 9.06157 0.988427 8.79285Z" />
            </svg>
        </div>
    )
}