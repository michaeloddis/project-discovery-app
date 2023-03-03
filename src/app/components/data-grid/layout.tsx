
type Props = {
    headerContent: React.ReactNode;
    bodyContent: React.ReactNode;
};

export const Layout = ({
    headerContent,
    bodyContent
}: Props) => {
    return (
        <table className='brand table-fixed border-collapse border-spacing-0 w-full'>
            <thead>
                {headerContent}
            </thead>
            <tbody>
                {bodyContent}
            </tbody>
        </table>
    )
};
