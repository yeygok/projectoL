import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  GetApp as ExportIcon,
} from '@mui/icons-material';

const DataTable = ({
  title,
  data = [],
  columns = [],
  loading = false,
  error = null,
  actions = [],
  onEdit,
  onDelete,
  onCreate,
  onExport,
  searchable = true,
  sortable = true,
  pagination = true,
  dense = false,
  emptyMessage = "No hay datos disponibles",
  rowsPerPageOptions = [5, 10, 25, 50],
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // Filtrar datos por búsqueda
  const filteredData = data.filter(row =>
    searchable && searchTerm
      ? columns.some(column =>
          String(row[column.field] || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
      : true
  );

  // Ordenar datos
  const sortedData = sortable && orderBy
    ? [...filteredData].sort((a, b) => {
        const aVal = a[orderBy] || '';
        const bVal = b[orderBy] || '';
        if (order === 'asc') {
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        }
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      })
    : filteredData;

  // Paginación
  const paginatedData = pagination
    ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : sortedData;

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleActionClick = (event, row) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedRow(row);
  };

  const handleActionClose = () => {
    setActionMenuAnchor(null);
    setSelectedRow(null);
  };

  const renderCellContent = (row, column) => {
    const value = row[column.field];
    
    if (column.render) {
      return column.render(value, row);
    }

    if (column.type === 'chip') {
      return (
        <Chip
          label={value}
          color={column.chipColor?.(value) || 'default'}
          size="small"
        />
      );
    }

    if (column.type === 'date') {
      return value ? new Date(value).toLocaleDateString('es-ES') : '-';
    }

    if (column.type === 'currency') {
      return value ? `$${Number(value).toLocaleString()}` : '-';
    }

    return value || '-';
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error.message || 'Error al cargar los datos'}
      </Alert>
    );
  }

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      {/* Toolbar */}
      <Toolbar sx={{ pl: 2, pr: 1, minHeight: '64px !important' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        
        {searchable && (
          <TextField
            size="small"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mr: 2, minWidth: 200 }}
          />
        )}

        {onCreate && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreate}
            sx={{ mr: 1 }}
          >
            Crear
          </Button>
        )}

        {onExport && (
          <Tooltip title="Exportar">
            <IconButton onClick={onExport}>
              <ExportIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>

      {/* Tabla */}
      <TableContainer>
        <Table size={dense ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth }}
                  sortDirection={orderBy === column.field ? order : false}
                >
                  {sortable && column.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === column.field}
                      direction={orderBy === column.field ? order : 'asc'}
                      onClick={() => handleRequestSort(column.field)}
                    >
                      {column.headerName}
                    </TableSortLabel>
                  ) : (
                    column.headerName
                  )}
                </TableCell>
              ))}
              {(onEdit || onDelete || actions.length > 0) && (
                <TableCell align="center">Acciones</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  <Typography color="text.secondary" sx={{ py: 4 }}>
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow key={row.id || index} hover>
                  {columns.map((column) => (
                    <TableCell
                      key={column.field}
                      align={column.align || 'left'}
                    >
                      {renderCellContent(row, column)}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete || actions.length > 0) && (
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        {onEdit && (
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              onClick={() => onEdit(row)}
                              color="primary"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {onDelete && (
                          <Tooltip title="Eliminar">
                            <IconButton
                              size="small"
                              onClick={() => onDelete(row)}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {actions.length > 0 && (
                          <Tooltip title="Más acciones">
                            <IconButton
                              size="small"
                              onClick={(e) => handleActionClick(e, row)}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      {pagination && !loading && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={sortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      )}

      {/* Menú de acciones */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionClose}
      >
        {actions.map((action, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              action.onClick(selectedRow);
              handleActionClose();
            }}
          >
            {action.icon && <ListItemIcon>{action.icon}</ListItemIcon>}
            <ListItemText primary={action.label} />
          </MenuItem>
        ))}
      </Menu>
    </Paper>
  );
};

export default DataTable;
