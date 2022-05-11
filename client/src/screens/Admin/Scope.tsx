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
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

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

const Container = styled(Grid)({
  marginBottom: '1.5rem',
})

const ButtonCustom = styled(Button)({
  background: '#424242',
  color: '#fff',
  border: '1px solid #636363',
  '&:hover': {
    background: '#424242',
  },
})

const OutlineButton = styled(Button)({
  color: '#fff',
  border: '2px solid #636363',
  '&:hover': {
    border: '1px solid #636363',
  },
})

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
      <Typography variant="h3" gutterBottom component="div">
        Scope
      </Typography>
      <Container container spacing={2}>
        <Grid item xs={10}>
          <Typography variant="h6" gutterBottom component="div">
            These are all the scopes you have created
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <ButtonCustom variant="contained" size="medium" fullWidth>
            Add Scope
          </ButtonCustom>
        </Grid>
      </Container>

      <Container container spacing={2}>
        <Grid item xs={11}>
          <FormControl sx={{ width: '100%' }}>
            <OutlinedInput placeholder="Search" />
          </FormControl>
        </Grid>
        <Grid item xs={1}>
          <OutlineButton variant="outlined" size="medium" fullWidth>
            Filter
          </OutlineButton>
        </Grid>
      </Container>
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
