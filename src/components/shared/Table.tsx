import {
  Box,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Button,
  Checkbox,
  Tooltip,
  Typography,
  ListItemText,
  useTheme,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Fade,
} from "@mui/material";
import Table from "@mui/material/Table";
import { useAlerts } from "../../utils/alerts";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import CachedIcon from "@mui/icons-material/Cached";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AddIcon from "@mui/icons-material/Add";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  useState,
  useMemo,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { showLoading, hideLoading, setParams } from "../../store/uiSlice";
import { tableConfig } from "../../services/tableConfig";
import { toast } from "react-toastify";

interface Props {
  action: string;
  title: string;
  addLabel?: string;
  isView?: boolean;
  isEdit?: boolean;
  isReactive?: boolean;
  isDelete?: boolean;
  onAddClick: (data?: Record<string, any>) => void;
}

const BaseTable = forwardRef(
  (
    {
      action,
      title,
      addLabel,
      isView,
      isEdit,
      isDelete,
      isReactive = true,
      onAddClick,
    }: Props,
    ref
  ) => {
    const dispatch = useDispatch();
    const params = useSelector((state: RootState) => state.ui.params);
    const loading = useSelector((state: RootState) => state.ui.loading);

    const [data, setData] = useState<any[]>([]);
    const [count, setCount] = useState(0);
    const [headers, setHeaders] = useState<any[]>([]);
    const [localSearch, setLocalSearch] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [orderBy, setOrderBy] = useState<string | null>(null);
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");

    const handleSort = (key: string) => {
      if (orderBy === key) {
        setOrderDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setOrderBy(key);
        setOrderDirection("asc");
      }
    };

    const sortedData = useMemo(() => {
      if (!orderBy) return data;
      return [...data].sort((a, b) => {
        const aVal = a[orderBy];
        const bVal = b[orderBy];
        if (typeof aVal === "number" && typeof bVal === "number") {
          return orderDirection === "asc" ? aVal - bVal : bVal - aVal;
        }
        return orderDirection === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }, [data, orderBy, orderDirection]);

    const theme = useTheme();

    const { confirmationAlert } = useAlerts();

    // Mantener localSearch sincronizado con la store
    useEffect(() => {
      if ((params?.search || "") !== localSearch) {
        setLocalSearch(params?.search || "");
      }
    }, [params?.search]);

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
      setAnchorEl(null);
    };

    const paginationOptions = {
      rowsPerPageText: "Filas por página",
      rangeSeparatorText: "de",
      noRowsPerPage: false,
      selectAllRowsItem: true,
      selectAllRowsItemText: "Todos",
    };

    // getData ahora acepta params opcionales para evitar leer params "viejos"
    const getData = async (overrideParams?: any) => {
      setOrderBy(null);
      setOrderDirection("asc");
      const p = overrideParams ?? params;
      if (!tableConfig[action]) return;
      dispatch(showLoading());
      try {
        const res = await tableConfig[action].getData(p);
        setData(res.data.data.results);
        setCount(res.data.data.count);
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(hideLoading());
      }
    };

    const deleteItem = async (id: string) => {
      const foo = async () => {
        dispatch(showLoading());
        try {
          if (tableConfig[action]?.deleteFunction) {
            await tableConfig[action]?.deleteFunction(id);
            // refrescar usando los params actuales
            getData();
            toast.success("Elemento eliminado con éxito");
          }
        } catch (err) {
          console.log(err);
        } finally {
          dispatch(hideLoading());
        }
      };
      confirmationAlert(foo, "¿Seguro que deseas eliminar este elemento?");
    };

    const reactiveItem = async (id: string) => {
      const foo = async () => {
        dispatch(showLoading());
        try {
          if (tableConfig[action]?.reactiveFunction) {
            await tableConfig[action]?.reactiveFunction(id);
            isActiveFilter(true)();
            toast.success("Elemento activado con éxito");
          }
        } catch (err) {
          console.log(err);
        } finally {
          dispatch(hideLoading());
        }
      };
      confirmationAlert(foo, "¿Seguro que deseas activar este elemento?");
    };

    // montaje inicial: setParams con initialParams y llamar getData(initialParams)
    useEffect(() => {
      const initialParams = {
        page: 1,
        limit: 10,
        offset: 0,
        search: "",
        isActive: true,
      };
      dispatch(setParams(initialParams));

      const baseHeaders = tableConfig[action]?.headers || [];
      const actionColumn = {
        key: "actions",
        label: "Acciones",
        align: "center",
        render: (_: any, row: any) => (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            {isEdit && row?.isActive ? (
              <Tooltip title="Editar">
                <IconButton onClick={() => onAddClick(row)} color="info">
                  <EditIcon />
                </IconButton>
              </Tooltip>
            ) : action === "inventory" ? (
              <Tooltip title="Editar">
                <IconButton onClick={() => onAddClick(row)} color="info">
                  <EditIcon />
                </IconButton>
              </Tooltip>
            ) : null}

            {isDelete && row.isActive && action !== "inventory" && (
              <Tooltip title="Eliminar">
                <IconButton onClick={() => deleteItem(row.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}

            {isReactive && !row.isActive && action !== "inventory" && (
              <Tooltip title="Reactivar">
                <IconButton
                  onClick={() => reactiveItem(row.id)}
                  color="warning"
                >
                  <SettingsBackupRestoreIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        ),
      };

      setHeaders([...baseHeaders, actionColumn]);

      getData(initialParams);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(ref, () => ({
      reloadData: () => getData(),
    }));

    // filtro Activos/Inactivos — construir newParams y usarlo
    const isActiveFilter = (value: boolean) => () => {
      const newParams = {
        ...params,
        isActive: value,
        page: 1,
        offset: 0,
      };
      dispatch(setParams(newParams));
      setResetPaginationToggle((old) => !old);
      handleCloseMenu();
      getData(newParams);
    };

    return (
      <Fade in timeout={500}>
        <Paper
          elevation={1}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minHeight: "400px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
              px: 2,
              py: 2,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <TextField
                size="small"
                placeholder="Buscar..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const newParams = {
                      ...params,
                      search: localSearch,
                      page: 1,
                      offset: 0,
                    };
                    dispatch(setParams(newParams));
                    getData(newParams);
                    setHasSearched(true);
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: hasSearched && (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          setLocalSearch("");
                          const newParams = {
                            ...params,
                            search: "",
                            page: 1,
                            offset: 0,
                          };
                          dispatch(setParams(newParams));
                          getData(newParams);
                          setHasSearched(false);
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {action !== "inventory" && (
                <Tooltip title="Filtros">
                  <IconButton onClick={handleOpenMenu}>
                    <FilterListIcon />
                  </IconButton>
                </Tooltip>
              )}

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
              >
                <MenuItem onClick={isActiveFilter(true)}>
                  <Checkbox checked={params.isActive === true} />
                  <ListItemText primary="Activos" />
                </MenuItem>
                <MenuItem onClick={isActiveFilter(false)}>
                  <Checkbox checked={params.isActive === false} />
                  <ListItemText primary="Inactivos" />
                </MenuItem>
              </Menu>

              <Tooltip title="Refrescar">
                <IconButton onClick={() => getData()}>
                  <CachedIcon />
                </IconButton>
              </Tooltip>

              {addLabel && (
                <Button
                  variant="contained"
                  onClick={() => onAddClick()}
                  endIcon={<AddIcon />}
                  color="error"
                >
                  {addLabel}
                </Button>
              )}
            </Box>
          </Box>
          <TableContainer
            sx={{ flex: 1, overflow: "auto", position: "relative" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableCell
                      key={header.key}
                      align={header.align ?? "center"}
                      onClick={() => header.sortable && handleSort(header.key)}
                      sx={{
                        cursor: header.sortable ? "pointer" : "default",
                        userSelect: "none",
                      }}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap={0.5}
                      >
                        {header.label}
                        {header.sortable &&
                          orderBy === header.key &&
                          (orderDirection === "asc" ? (
                            <ArrowDropUpIcon fontSize="small" />
                          ) : (
                            <ArrowDropDownIcon fontSize="small" />
                          ))}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {!loading &&
                  sortedData.map((row, idx) => (
                    <Fade in timeout={400} key={idx}>
                      <TableRow>
                        {headers.map((header) => (
                          <TableCell align={header.align} key={header.key}>
                            {header.render
                              ? header.render(row[header.key], row)
                              : row[header.key]}
                          </TableCell>
                        ))}
                      </TableRow>
                    </Fade>
                  ))}
                {/* <-- NO pongas fila vacía aquí */}
              </TableBody>
            </Table>

            {/* Overlay de “sin resultados” que ocupa TODO el alto */}
            {!loading && data.length === 0 && (
              <Fade in timeout={400}>
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0, // top/right/bottom/left: 0
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    opacity: 0.7,
                    p: 2,
                    pointerEvents: "none", // no bloquea clicks en header/scroll
                  }}
                >
                  <SentimentVeryDissatisfiedIcon fontSize="large" />
                  <Typography variant="body1">
                    No se encontraron resultados
                  </Typography>
                </Box>
              </Fade>
            )}
          </TableContainer>

          <TablePagination
            component="div"
            count={count}
            page={params.page - 1}
            rowsPerPage={params.limit}
            onPageChange={(_, newPage) => {
              const newParams = {
                ...params,
                page: newPage + 1,
                offset: newPage * params.limit,
              };
              dispatch(setParams(newParams));
              getData(newParams);
            }}
            onRowsPerPageChange={(e) => {
              const newParams = {
                ...params,
                limit: parseInt(e.target.value),
                page: 1,
                offset: 0,
              };
              dispatch(setParams(newParams));
              getData(newParams);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Elementos por página"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
            }
          />
        </Paper>
      </Fade>
    );
  }
);

export default BaseTable;
