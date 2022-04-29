// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react'
import { Row, usePagination, useSortBy, useTable } from 'react-table'
import { 
  TableContainer, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  Paper, 
  Pagination, 
  Stack,
  IconButton,
  Input, 
} from '@mui/material'
import { VscArrowDown, VscArrowUp, VscTrash } from 'react-icons/vsc'
import { useSnackbar } from 'notistack'
import axios from 'axios'

function EventTable({ events: propEvents, updateCallback }) {
  const { enqueueSnackbar } = useSnackbar()
  const [events, setEvents] = useState(propEvents)

  const columns = useMemo(() => [
    {
      Header: 'Agent',
      accessor: 'agent'
    },
    {
      Header: 'Client',
      accessor: 'client'
    },
    {
      Header: 'Sender',
      accessor: 'sender'
    },
    {
      Header: 'Text',
      accessor: 'text'
    },
    {
      Header: 'Type',
      accessor: 'type'
    },
    {
      Header: 'Channel',
      accessor: 'channel'
    },
    {
      Header: 'Date',
      accessor: 'date'
    },
    {
      Header: 'Actions',
      Cell: row => (
        <IconButton onClick={() => handleEventDelete(row.row.original)}>
          <VscTrash size={16} color='#ffffff'/>
        </IconButton>
      )
    },
  ], [])

  const updateEvent = ({ id, ...rowData }, columnId, value) => {
    console.log('-----in updateEvent-----');
    let reqBody = {
      ...rowData,
      [columnId]: value
    }
    console.log('id ::: ', id);
    console.log('req ::: ', reqBody);
  }
  
  const EditableCell = ({ value, row: { original: row }, column: { id }, updateEvent }) => {
    const [val, setVal] = useState(value)
    const onChange = (e) => setVal(e.target.value)
    const onBlur = (e) => updateEvent(row, id, val)
    useEffect(() => setVal(value), [value])
    return <input 
      value={val} 
      onChange={onChange} 
      onBlur={onBlur} 
      className='bare-input'
    />
  }

  const defaultColumn = {
    Cell: EditableCell
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    pageOptions,
    gotoPage,
  } = useTable(
    { 
      columns, 
      data: events,
      defaultColumn,
      updateEvent 
    },
    useSortBy,
    usePagination
  )

  const handlePageChange = (page: number) => {
    const pageIndex = page - 1
    gotoPage(pageIndex)
  }

  const handleEventDelete = async (event: any) => {
    console.log('event to delete ::: ', event);
    const isDeleted = await axios.delete(`${process.env.REACT_APP_API_ROOT_URL}/event/${event.id}`)
    if(isDeleted) enqueueSnackbar('Event deleted', { variant: 'success' })
    else enqueueSnackbar('Error deleting Event', { variant: 'error' })
    updateCallback()
  }
    
  return (
    <Stack spacing={2}>
      <TableContainer component={Paper}>
        <Table {...getTableProps()}>
          <TableHead style={{ backgroundColor: '#000'}}>
            {headerGroups.map((headerGroup, idx) => (
              <TableRow {...headerGroup.getHeaderGroupProps()} key={idx}>
                {headerGroup.headers.map((column, idx) => (
                  <TableCell 
                    {...column.getHeaderProps(column.getSortByToggleProps())} 
                    key={idx}
                  >
                    {column.render('Header')}{' '}
                    <span>
                      {column.isSorted ? 
                        column.isSortedDesc ? 
                          <VscArrowDown size={14} />
                          : <VscArrowUp size={14} /> 
                        : ''}
                    </span>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row: Row<object>, idx: number) => {
              prepareRow(row)
              return (
                <TableRow {...row.getRowProps()} key={idx}>
                  {row.cells.map((cell, idx) => (
                    <TableCell {...cell.getCellProps} key={idx}>{cell.render('Cell')}</TableCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination 
        count={pageOptions.length} 
        onChange={(e, page) => handlePageChange(page)} 
        shape='rounded' 
        showFirstButton 
        showLastButton
      />
    </Stack>
  )
}

export default EventTable