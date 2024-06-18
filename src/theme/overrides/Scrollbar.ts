import {Components} from "@mui/material";

const Scrollbar: Components = {
    MuiCssBaseline: {
        styleOverrides: {
            html: {
                '& :: -webkit-scrollbar': {
                    width: '0.43em',
                    height: '0.4em'
                },
                '& :: -webkit-scrollbar-track': {
                    backgroundColor: '#F3EEBE'
                },
                '& :: -webkit-scrollbar-thumb': {
                    backgroundColor: '#d19020'
                },
            }
        }
    }
}

export default Scrollbar