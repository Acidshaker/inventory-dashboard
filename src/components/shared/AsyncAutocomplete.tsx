import {
  Autocomplete,
  TextField,
  CircularProgress,
  IconButton,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Controller } from "react-hook-form";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";

interface AsyncAutocompleteProps {
  name: string;
  label: string;
  control: any;
  errors: any;
  fetchFn: (params: { search: string; page: number }) => Promise<any>;
  onAddClick?: () => void;
}

export interface AsyncAutocompleteRef {
  reload: () => void;
}

const AsyncAutocomplete = forwardRef<
  AsyncAutocompleteRef,
  AsyncAutocompleteProps
>(({ name, label, control, errors, fetchFn, onAddClick }, ref) => {
  const [options, setOptions] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadOptions = async () => {
    setLoading(true);
    try {
      const res = await fetchFn({ search, page });
      const results = res.data.data.results;
      const newItems = results.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));

      setOptions((prev) =>
        page === 1
          ? newItems
          : [...prev.filter((o) => o.label !== "Ver más..."), ...newItems]
      );
      setTotalPages(res.data.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOptions();
  }, [search, page]);

  useEffect(() => {
    if (page < totalPages && !options.some((o) => o.label === "Ver más...")) {
      setOptions((prev) => [
        ...prev,
        { label: "Ver más...", value: null, isLoadMore: true },
      ]);
    }
  }, [options, page, totalPages]);

  useImperativeHandle(ref, () => ({
    reload: () => {
      setPage(1);
      loadOptions();
    },
  }));

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Box flex={1}>
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState }) => (
            <Autocomplete
              options={options}
              getOptionLabel={(option) => option.label}
              loading={loading}
              value={options.find((opt) => opt.value === field.value) || null}
              onChange={(_, value) => {
                if (!value?.isLoadMore) {
                  field.onChange(value?.value || "");
                }
              }}
              onBlur={field.onBlur}
              onInputChange={(_, value) => {
                setSearch(value);
                setPage(1);
              }}
              renderOption={(props, option) => {
                if (option.isLoadMore) {
                  return (
                    <Box
                      component="li"
                      {...props}
                      sx={{
                        textAlign: "center",
                        cursor: "pointer",
                        color: "primary.main",
                      }}
                      onClick={() => setPage((prev) => prev + 1)}
                    >
                      Ver más...
                    </Box>
                  );
                }
                return (
                  <Box component="li" {...props}>
                    {option.label}
                  </Box>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={label}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || " "}
                  size="small"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          )}
        />
      </Box>
      <IconButton
        onClick={onAddClick}
        color="primary"
        size="small"
        sx={{
          alignSelf: "flex-start",
          mt: 0.3,
        }}
      >
        <AddIcon />
      </IconButton>
    </Box>
  );
});

export default AsyncAutocomplete;
