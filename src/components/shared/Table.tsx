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
} from "@mui/material";
import { confirmationAlert } from "../../utils/alerts";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import CachedIcon from "@mui/icons-material/Cached";
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

const Table = forwardRef(
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

    const [data, setData] = useState<any[]>([]);
    const [count, setCount] = useState(0);
    const [headers, setHeaders] = useState<any[]>([]);
    const [localSearch, setLocalSearch] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [hasSearched, setHasSearched] = useState(false);

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
            getData();
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
        name: "Acciones",
        cell: (row: any) => (
          <Box sx={{ display: "flex", gap: 1 }}>
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

    const subHeaderComponentMemo = useMemo(() => {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            paddingY: 1,
          }}
        >
          <TextField
            variant="outlined"
            size="small"
            placeholder="Buscar"
            value={localSearch}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const newParams = {
                  ...params,
                  search: localSearch,
                  page: 1,
                  offset: 0,
                };
                dispatch(setParams(newParams));
                setHasSearched(true);
                getData(newParams);
              }
            }}
            onChange={(e) => setLocalSearch(e.target.value)}
            sx={{ width: "260px" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {localSearch ? (
                    <IconButton
                      size="small"
                      onClick={() => {
                        // Solo recargamos si previamente se hizo una búsqueda real
                        if (hasSearched) {
                          const newParams = {
                            ...params,
                            search: "",
                            page: 1,
                            offset: 0,
                          };
                          dispatch(setParams(newParams));
                          setHasSearched(false);
                          getData(newParams);
                        }
                        setLocalSearch("");
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  ) : null}
                  <IconButton
                    onClick={() => {
                      const newParams = {
                        ...params,
                        search: localSearch,
                        page: 1,
                        offset: 0,
                      };
                      dispatch(setParams(newParams));
                      setHasSearched(true);
                      getData(newParams);
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                  <IconButton onClick={handleOpenMenu}>
                    <FilterListIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={isActiveFilter(true)}>
              <Checkbox
                checked={params.isActive === true}
                color="error"
                sx={{ padding: 0.5 }}
              />
              <ListItemText primary="Activos" sx={{ ml: 1 }} />
            </MenuItem>

            <MenuItem onClick={isActiveFilter(false)}>
              <Checkbox
                checked={params.isActive === false}
                color="error"
                sx={{ padding: 0.5 }}
              />
              <ListItemText primary="Inactivos" sx={{ ml: 1 }} />
            </MenuItem>
          </Menu>

          <Tooltip title="Actualizar">
            <IconButton onClick={() => getData()}>
              <CachedIcon />
            </IconButton>
          </Tooltip>

          {addLabel && (
            <Button
              variant="contained"
              color="error"
              onClick={() => onAddClick()}
            >
              {addLabel}
            </Button>
          )}
        </Box>
      );
    }, [localSearch, resetPaginationToggle, anchorEl, hasSearched, params]);

    const noDataComponent = useMemo(() => {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            mt: 3,
          }}
        >
          <Typography variant="body1">No se encontraron resultados</Typography>
          <SentimentVeryDissatisfiedIcon sx={{ ml: 1 }} />
        </Box>
      );
    }, []);

    return (
      <Box sx={{ flexGrow: 1 }}>
        <DataTable
          columns={headers}
          data={data}
          pagination
          paginationServer
          paginationTotalRows={count}
          paginationPerPage={params.limit}
          paginationDefaultPage={params.page}
          onChangePage={(page) => {
            const newParams = {
              ...params,
              page,
              offset: (page - 1) * params.limit,
            };
            dispatch(setParams(newParams));
            getData(newParams);
          }}
          onChangeRowsPerPage={(limit) => {
            const newParams = {
              ...params,
              limit,
              page: 1,
              offset: 0,
            };
            dispatch(setParams(newParams));
            getData(newParams);
          }}
          paginationComponentOptions={paginationOptions}
          paginationResetDefaultPage={resetPaginationToggle}
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          selectableRows
          persistTableHead
          highlightOnHover
          striped
          responsive
          noDataComponent={noDataComponent}
        />
      </Box>
    );
  }
);

export default Table;
