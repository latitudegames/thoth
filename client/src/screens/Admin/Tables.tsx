import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import data from '../../data/config/clientSettings'
import Pagination from '@mui/material/Pagination'
import MoreHoriz from '@mui/icons-material/MoreHoriz'
import IconButton from '@mui/material/IconButton'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'rgba(70, 70, 70, 0.95)',
    color: theme.palette.common.white,
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    // backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  'td, th': {
    border: 0,
  },
}))

// function createData(
//   client: string,
//   name: string,
//   type: string,
//   defaultValue: string
// ) {
//   return { client, name, type, defaultValue }
// }

const rows = data.slice(0, 10)

export default function CustomizedTables() {
  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="right">Select</StyledTableCell>
              <StyledTableCell align="right">Client</StyledTableCell>
              <StyledTableCell align="right">Name</StyledTableCell>
              <StyledTableCell align="right">Type</StyledTableCell>
              <StyledTableCell align="right">Default Value</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <StyledTableRow key={row.name}>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    inputProps={{
                      'aria-label': 'select all desserts',
                    }}
                  />
                </TableCell>
                <StyledTableCell align="right">{row.client}</StyledTableCell>
                <StyledTableCell align="right">{row.name}</StyledTableCell>
                <StyledTableCell align="right">{row.type}</StyledTableCell>
                <StyledTableCell align="right">
                  {row.defaultValue}
                </StyledTableCell>
                <TableCell padding="checkbox" align="center">
                  <IconButton>
                    <MoreHoriz />
                  </IconButton>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '1.5rem',
        }}
      >
        <Pagination count={2} variant="outlined" shape="rounded" />
      </div>
    </div>
  )
}
