import React, { useState } from "react";

import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";

function RecensionManagmentBar({ recensions, applyFilters, applySort }) {
  const filterOptions = [
    {
      label: "10.0",
      filter: (array) => {
        return array.filter((item) => item.bookRate === 10);
      },
    },
    {
      label: "9.0",
      filter: (array) => {
        return array.filter((item) => item.bookRate === 9);
      },
    },
    {
      label: "8.0",
      filter: (array) => {
        return array.filter((item) => item.bookRate === 8);
      },
    },
    {
      label: "7.0",
      filter: (array) => {
        return array.filter((item) => item.bookRate === 7);
      },
    },
    {
      label: "6.0",
      filter: (array) => {
        return array.filter((item) => item.bookRate === 6);
      },
    },
    {
      label: "5.0",
      filter: (array) => {
        return array.filter((item) => item.bookRate === 5);
      },
    },
    {
      label: "4.0",
      filter: (array) => {
        return array.filter((item) => item.bookRate === 4);
      },
    },
    {
      label: "3.0",
      filter: (array) => {
        return array.filter((item) => item.bookRate === 3);
      },
    },
    {
      label: "2.0",
      filter: (array) => {
        return array.filter((item) => item.bookRate === 2);
      },
    },
    {
      label: "1.0",
      filter: (array) => {
        return array.filter((item) => item.bookRate === 1);
      },
    },
  ];

  const sortOptions = [
    {
      label: "Highest Rating",
      sort: (array) => {
        return array.slice().sort((a, b) => b.bookRate - a.bookRate);
      },
    },
    {
      label: "Lowest Rating",
      sort: (array) => {
        return array.slice().sort((a, b) => a.bookRate - b.bookRate);
      },
    },
    {
      label: "Earliest Recensions",
      sort: (array) => {
        return array.slice().sort((a, b) => a.dateOfFinish - b.dateOfFinish);
      },
    },
    {
      label: "Latest Recensions",
      sort: (array) => {
        return array.slice().sort((a, b) => b.dateOfFinish - a.dateOfFinish);
      },
    },
  ];

  const [sortSelected, setSort] = useState("");

  const [filtersSelected, setFilters] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setFilters(value);
    applyFilters(value); // Apply selected filters to recensions
  };

  const handleSortChange = (event) => {
    const {
      target: { value },
    } = event;
    setSort(value);
    applySort(value); // Apply selected sort to recensions
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }} className=" text-white">
        <InputLabel className=" text-white" id="demo-multiple-name-label">
          Filters
        </InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={filtersSelected}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} className=" text-white" />
              ))}
            </Box>
          )}
        >
          {filterOptions.map((option) => (
            <MenuItem value={option.label} key={option.label}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel className="text-white" id="demo-simple-select-label">
          Sort by
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={sortOptions}
          label={sortSelected}
          onChange={handleSortChange}
        >
          {sortOptions.map((option) => (
            <MenuItem value={option.label}>{option.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default RecensionManagmentBar;
