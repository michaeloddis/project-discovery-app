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
     * 
     * text-white bg-[#27272A] border-[#3F3F46] rounded-[4px] checked:bg-[#4F46E5] checked:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
     */
    return (
        <input
            type="checkbox"
            ref={ref}
            className={className + ' cursor-pointer form-checkbox h-4 w-4'}
            {...rest}
        />
    );
};