/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { HTMLProps } from 'react';
import { IconCheckmark, IconIntermediateCheckmark } from './icons';

type Props = {
    indeterminate?: boolean;
} & HTMLProps<HTMLInputElement> ;

export const Checkbox = ({
    indeterminate = false,
    className = '',
    ...rest
}: Props) => {
    const ref = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        if (typeof indeterminate === 'boolean' && ref.current) {
            ref.current.indeterminate = !rest.checked && indeterminate
        }
    }, [ref, indeterminate, rest.checked])

    const determineCheckmarkStyle = rest.checked || indeterminate 
        ? 'border-transparent bg-[#4F46E5]'
        : 'bg-[#27272A] border-[#3F3F46] border-[#3F3F46]';
    
    return (
        <label>
            <div
                className={`h-4 w-4 rounded flex items-center justify-center border ${determineCheckmarkStyle}`}>
                {rest.checked ? <IconCheckmark /> : indeterminate ? <IconIntermediateCheckmark /> : null}
            </div>
            <input
                type="checkbox"
                ref={ref}
                className={className + ' hidden'}
                {...rest}
            />
        </label>
    );
};