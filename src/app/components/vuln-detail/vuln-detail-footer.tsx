/* eslint-disable @typescript-eslint/no-explicit-any */
import { LinkButton } from '../../components/link-button';
import { IconRightArrow } from '../../components/icons';

type Props = {
    isDisabled?: boolean;
    onClickHandler: any;
};

export const VulnDetailFooter = ({
    isDisabled = false,
    onClickHandler
}: Props) => {
    return (
        <div className='flex flex-col items-center'>
            <LinkButton
                isDisabled={isDisabled}
                icon={<IconRightArrow isDisabled={isDisabled} />}
                onClick={onClickHandler}>
                View All Vulnerabilities
            </LinkButton>
        </div>
    )
};
