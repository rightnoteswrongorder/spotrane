import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';

type SpeedDialAction = {
    icon: React.ReactNode;
    name: string;
    action: () => void;
    tooltip: string;
};

type AlbumCardSpeedDialProps = {
    onSave?: () => void;
    onShare?: () => void;
    onCopy?: () => void;
    onPrint?: () => void;
};

const createActions = (props: AlbumCardSpeedDialProps): SpeedDialAction[] => [
    { 
        icon: <FileCopyIcon />, 
        name: 'Copy',
        tooltip: 'Copy album details', 
        action: props.onCopy || (() => console.log('Copy action not implemented'))
    },
    { 
        icon: <SaveIcon />, 
        name: 'Save',
        tooltip: 'Save album to library', 
        action: props.onSave || (() => console.log('Save action not implemented'))
    },
    { 
        icon: <PrintIcon />, 
        name: 'Print',
        tooltip: 'Print album details', 
        action: props.onPrint || (() => console.log('Print action not implemented'))
    },
    { 
        icon: <ShareIcon />, 
        name: 'Share',
        tooltip: 'Share album', 
        action: props.onShare || (() => console.log('Share action not implemented'))
    },
];

const AlbumCardSpeedDial = (props: AlbumCardSpeedDialProps) => {
    const actions = useMemo(() => createActions(props), [props]);
    const [open, setOpen] = useState(false);

    const handleOpen = useCallback(() => setOpen(true), []);
    const handleClose = useCallback(() => setOpen(false), []);

    const handleAction = useCallback((action: SpeedDialAction) => {
        action.action();
        handleClose();
    }, [handleClose]);

    return (
        <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
            <SpeedDial
                ariaLabel="Album actions"
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
                open={open}
                onOpen={handleOpen}
                onClose={handleClose}
                FabProps={{
                    size: 'medium',
                    sx: { boxShadow: 2 }
                }}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.tooltip}
                        onClick={() => handleAction(action)}
                    />
                ))}
            </SpeedDial>
        </Box>
    );
}

export default AlbumCardSpeedDial