import * as React from 'react'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import data from '../../data/config/scopedata'
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

export default function ScopeTable() {
  const [page, setPage] = React.useState(1)
  //   const rows = data.slice(0, 10)
  const PER_PAGE = 10

  const count = Math.ceil(data.length / PER_PAGE)

  const paginatedData = data.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  // const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="right">Select</StyledTableCell>
              <StyledTableCell align="right">Tables</StyledTableCell>
              <StyledTableCell align="right">Full table size</StyledTableCell>
              <StyledTableCell align="right">Table size</StyledTableCell>
              <StyledTableCell align="right">Record count</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map(row => (
              <StyledTableRow key={row.table}>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    inputProps={{
                      'aria-label': 'select all desserts',
                    }}
                  />
                </TableCell>
                <StyledTableCell align="right">{row.table}</StyledTableCell>
                <StyledTableCell align="right">{row.Fullsize}</StyledTableCell>
                <StyledTableCell align="right">{row.size}</StyledTableCell>
                <StyledTableCell align="right">{row.count}</StyledTableCell>

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
        <Pagination
          count={count}
          variant="outlined"
          shape="rounded"
          page={page}
          onChange={handleChangePage}
        />
      </div>
    </div>
  )
}
