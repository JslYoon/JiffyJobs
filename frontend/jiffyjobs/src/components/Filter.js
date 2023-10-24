import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

var categoryList = new Set()
export function Filter() {
    const [Location] = useState([]);
    const [Category] = useState([]);
    const [Duration] = useState([]);
    const [PayRate] = useState([]);
    const [OnOffCampus] = useState([]);
    const [expandMap, setExpandMap] = useState(new Map(
      [["Location", false],
      ["Category", false],
      ["Duration", false],
      ["PayRate", false],
      ["OnOffCampus", false]]
    )) 
    const [filterList, setFilterList] = useState(new Set())
    const filterOptions = {
      Location: ['Less than a mile away', '1-2 miles away', '3-5 miles away', '7+ miles away'],
      Category: ['Cleaning', 'Food/Restaurant', 'Office jobs', 'Retail', 'Other'],
      Duration: ['Quick Jobs (1 day)', 'Short Term Jobs (1-7 days)', 'Part-Time Jobs (7+ Days)'],
      PayRate: ['$15/hour', '$15-20/hour', '$20+/hour', 'Stipend based'],
      // OnOffCampus: ['On campus', 'Off campus']
    };

    function handleFilterList(event) {
      const val = event.target.value
      if (filterList.has(val)) {
        filterList.delete(val)
        setFilterList(filterList)
      } else {
        filterList.add(val)
        setFilterList(filterList)
      }
    };

    function toggleFilter(type) { 
      setExpandMap(prevMap => {
        const newMap = new Map(prevMap);  
        newMap.forEach((val, key) => {
          newMap.set(key, key === type ? !val : false);  
        });
        return newMap;
      });
    }
    
    function handleDelete(option) {
      filterList.delete(option);
      setFilterList(new Set([...filterList]));
    }
  
    const renderSelectedOptions = (selected) => {
      return Array.from(selected, option => (
          <Chip
              key={option}
              label={option}
              onDelete={() => handleDelete(option)}
              style={{ margin: '4px', background: "gray"}}
          />
      ));
    };

    const renderFilters = (filterCategory, bool) => {
      return (
        <div style={{width: '12.5%'}} className='filters'>
          <Grid item
            xs={1.5}
            onClick={() => toggleFilter(filterCategory)}
            className = 'filter-tab'
          >
              { filterCategory } 
              { bool ? <KeyboardArrowDownIcon className='arrow-pad'/> : <KeyboardArrowUpIcon className='arrow-pad'/> }
          </Grid>
          { bool && 
            <div style={{ whiteSpace: 'nowrap', minWidth: '250%', overflowX: 'auto' }}>
              {filterOptions[filterCategory].map((option) => (
                <FormGroup key={option}>
                    <FormControlLabel control={<Checkbox checked={filterList.has(option)} />} color='default' value={option} label={option} onChange={handleFilterList} className='checkboxes' />
                </FormGroup>
            ))}
          </div>
          }
        </div>
      )
    }

    return (
      <Box sx={{ flexGrow: 1 }}>
          <Grid container columnSpacing={1} wrap="nowrap">
            
              { Object.keys(filterOptions).map((filterCategory) => (
                renderFilters(filterCategory, expandMap.get(filterCategory))
              ))}   
            
          </Grid>
          <Grid container columnSpacing={2}>
            { filterList.size > 0 && <text className='filterby-tag'> Filtered By: </text>}
            { renderSelectedOptions(filterList, setFilterList) } 
          </Grid>
      </Box>
    );
  }

export default categoryList = {
    value: categoryList
};