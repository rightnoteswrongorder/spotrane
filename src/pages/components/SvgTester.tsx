import {Box, SvgIcon} from "@mui/material";
import Foo from "../../static/images/ecmlogo.svg?react"

const SvgTester = () => {
    return <Box
    >
            <SvgIcon sx={{width: '233px', height: '233px'}} component={Foo} inheritViewBox/>
    </Box>
}

export default SvgTester