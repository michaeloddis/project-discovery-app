import React, { HTMLProps } from 'react';
// import * as RadixCheckbox from '@radix-ui/react-checkbox';

type Props = {
    indeterminate?: boolean;
} & HTMLProps<HTMLInputElement> ;


export const Checkbox = ({
    indeterminate = false,
    className = '',
    ...rest
}: Props) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const ref = React.useRef<HTMLInputElement>(null!)

    React.useEffect(() => {
        if (typeof indeterminate === 'boolean') {
            ref.current.indeterminate = !rest.checked && indeterminate
        }
    }, [ref, indeterminate, rest.checked])
    
    /**
     * <div className='test block h-4 w-4 border-[#27272A] border-2 border-solid rounded checked:bg-white before:content-[""] after:w-[6px] after:h-[12px] bordered after:border-white after:border-solid after:border-t-0 after:border-r-4 after:border-b-4 after:border-l-0 after:rotate-45'></div>
     */
    return (
        <input
            type="checkbox"
            ref={ref}
            className={className + ' cursor-pointer'}
            {...rest}
        />
    );
};