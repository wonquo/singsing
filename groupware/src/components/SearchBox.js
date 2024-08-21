// material-ui
import { Box, FormControl, InputAdornment, OutlinedInput } from '@mui/material';
import { SearchOutlined } from '@mui/icons-material'; // material-ui 아이콘으로 변경
import React from 'react';

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const Search = ({ onSearch }) => {
  // 검색어 상태
  const [searchTerm, setSearchTerm] = React.useState('');

  // 검색어 변경 핸들러
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Enter 키 입력 핸들러
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSearch(searchTerm);
    }
  };

  return (
    // 검색창 컴포넌트
    <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }}>
      <FormControl sx={{ width: { xs: '100%', md: 224 } }}>
        <OutlinedInput
          size="small"
          id="header-search"
          startAdornment={
            <InputAdornment position="start" sx={{ mr: -0.5 }}>
              <SearchOutlined />
            </InputAdornment>
          }
          aria-describedby="header-search-text"
          inputProps={{
            'aria-label': 'search',
            value: searchTerm,
            onChange: handleChange,
            onKeyPress: handleKeyPress
          }}
        />
      </FormControl>
    </Box>
  );
};

export default Search;
