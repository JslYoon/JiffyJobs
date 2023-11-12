import React, { useState } from 'react';
import '../styles/JobPosting.css';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import { Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Typography, Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import { Divider, MenuItem } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import InputAdornment from '@mui/material/InputAdornment';
import dayjs from 'dayjs';
import { CalendarIcon } from '@mui/x-date-pickers';
var objectSupport = require("dayjs/plugin/objectSupport");
dayjs.extend(objectSupport);

export function JobPosting() {
    const [openStartPop, setOpenStartPop] = useState(false)
    const [openSecondPop, setOpenSecondPop] = useState(false)

    const categories = ['Cleaning', 'Food/Restaurant', 'Office jobs', 'Retail', 'Moving']
    const [expand, setExpand] = useState(false)
    const [amount, setAmount] = useState("")

    // useState for the data
    const [val, setVal] = useState({
        title: '',
        name: '',
        location: '',
        pay: '',
        description: '',
        category: new Set(),
        date: {
            month: new Date().getMonth()+1,
            day: new Date().getDate(),
            year: new Date().getFullYear()
        },
        startTime: {
            hour: '0',
            min: '0'
        },
        endTime: {
            hour: '0',
            min: '0'
        },
        // times: []
    })

    // useState for errors
    const [error, setError] = useState({
        titleError: false,
        nameError: false,
        locationError: false,
        payError: false,
        descriptionError: false,
        categoryError: false,
    })

    // handles the error of the input boxes
    function handleError() {
        setError({
            titleError: val.title === '',
            nameError: val.name === '',
            locationError: val.location === '',
            payError: val.pay === '' || val.pay === 0,
            descriptionError: val.description === '',
            categoryError: val.category.length === 0
        })
    }

    // resets the data 
    function empytyVals() {
        setVal({
            title: '',
            name: '',
            location: '',
            pay: 0,
            description: '',
            category: new Set(),
            date: {
                month: new Date().getMonth()+1,
                day: new Date().getDate(),
                year: new Date().getFullYear()
            },
            startTime: {
                hour: '0',
                min: '0'
            },
            endTime: {
                hour: '0',
                min: '0'
            }, 
            // times: []
        })
    }

    // changes the vals for all except date and time
    function handleValues(event) {
        setVal(prevVal => ({
            ...prevVal,
            [event.target.id]: event.target.value
        }));
    }

    // handles the date calendar data
    function handleDate(date) {
        setVal(prevVal => ({
            ...prevVal,
            date: {
                month: date.month() + 1,
                day: date.date(),
                year: date.year()
            }
        }));
    }

    // handles the start time 
    function handleStartTime(time) {
        setVal(prevVal => ({
            ...prevVal,
            startTime: {
                hour: time.hour(),
                min: time.minute()
            }
        }));
    }
    
    // handles the end time
    function handleEndTime(time) {
        setVal(prevVal => ({
            ...prevVal,
            endTime: {
                hour: time.hour(),
                min: time.minute()
            }
        }));
    }
    
    // handles adding times
    // function handleAddTime() {
    //     val.times.push([new Date(val.date.year, val.date.month-1, val.date.day, val.startTime.hour, val.startTime.min), new Date(val.date.year, val.date.month-1, val.date.day, val.endTime.hour, val.endTime.min)])
    //     setVal({
    //         title: val.title,
    //         name: val.name,
    //         location: val.location,
    //         pay: val.pay,
    //         description: val.description,
    //         category: val.category, 
    //         date: {
    //             month: new Date().getMonth()+1,
    //             day: new Date().getDate(),
    //             year: new Date().getFullYear()
    //         },
    //         startTime: {
    //             hour: '0',
    //             min: '0'
    //         },
    //         endTime: {
    //             hour: '0',
    //             min: '0'
    //         }, 
    //         times: val.times
    //     })
    // }

    // handles removal of previous time
    // function handleRemoveTime() {
    //     val.times.pop()
    //     setVal({
    //         title: val.title,
    //         name: val.name,
    //         location: val.location,
    //         pay: val.pay,
    //         description: val.description,
    //         category: val.category, 
    //         date: {
    //             month: new Date().getMonth()+1,
    //             day: new Date().getDate(),
    //             year: new Date().getFullYear()
    //         },
    //         startTime: {
    //             hour: '0',
    //             min: '0'
    //         },
    //         endTime: {
    //             hour: '0',
    //             min: '0'
    //         }, 
    //         times: val.times
    //     })
    // }

    const openPop = () => {
        setOpenStartPop(true)
    }

    const closePop = () => {
        empytyVals()
        handleError()
        setOpenStartPop(false)
    }

    const openNextPop = () => {
        if (val.title === '' || val.name === '' || val.location === '' || val.pay === 0) {
            handleError()
        } else {
            setError({
                titleError: val.title === '',
                nameError: val.name === '',
                locationError: val.location === '',
                valError: val.pay === '' || val.pay === 0,
                descriptionError: false,
                categoryError: false,
            })
            setOpenStartPop(false)
            setOpenSecondPop(true)
        }    
    }

    const closeNextPop = () => {
        setOpenSecondPop(false)
    }

    const backSecondPop = () => {
        setOpenSecondPop(false)
        setOpenStartPop(true)
    }
    
    const descriptionElementRefStartPop = React.useRef(null)
    React.useEffect(() => {
        if (openStartPop) {
            const { current: descriptionElement } = descriptionElementRefStartPop
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [openStartPop])

    const descriptionElementRefNextPop = React.useRef(null)
    React.useEffect(() => {
        if (openSecondPop) {
            const { current: descriptionElement } = descriptionElementRefNextPop
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [openSecondPop])

    function handleAddingCategories(event) {
        val.category.add(event)
        console.log(event)
            
        setVal({
            title: val.title,
            name: val.name,
            location: val.location,
            pay: val.pay,
            description: val.description,
            category: val.category,
            date: val.date,
            startTime: val.startTime,
            endTime: val.endTime,
            // times: val.times
        })
        setExpand(!expand)
    }

    function handleDelete(event) {
        val.category.delete(event)
        setVal({
            title: val.title,
            name: val.name,
            location: val.location,
            pay: val.pay,
            description: val.description,
            category: val.category,
            date: val.date,
            startTime: val.startTime,
            endTime: val.endTime,
            // times: val.times
        })
    }
    
    const renderSelectedOptions = (selected) => {
        return Array.from(selected).map((data) => {
            return (<Chip
                key={data}
                label={data}
                onDelete={() => handleDelete(data)}
                style={{ margin: '4px', paddingLeft: '4px', paddingRight: '4px', display: 'flex', alignItems: 'center', fontFamily: 'Outfit', fontSize: 'medium'}}
                deleteIcon={<ClearIcon></ClearIcon>}
              />)
        })
      }

    const firstJobSlide = () => {
        return (
            <Dialog open={openStartPop} onClose={closePop} maxWidth={"1000px"} PaperProps={{sx: { borderRadius: "15px"}}}>
                <div className='popup-title'>
                    <DialogTitle style={{width: "90%"}}> 
                        Tell us more about the job!
                    </DialogTitle>
                    <IconButton onClick={closePop}>
                        <ClearIcon/>
                    </IconButton>
                </div>
                <Divider/>
                    <DialogContent>
                        <DialogContentText ref={descriptionElementRefStartPop} tabIndex={-1} style={{width: '1000px'}}>
                            <div>
                                <text className='pop-textfield-title'>
                                    Job Title
                                </text> <br></br>
                                <TextField error={error.titleError} helperText={error.titleError ? "*This field is required" : ""} required={true} placeholder="Add the title you are hiring for" type="search" square={false} style={{width: '98.5%'}} onChange={(e) => {handleValues(e)}} id='title' value={val.title}/>
                            </div>
                            <div style={{paddingTop: '2.5%'}}>
                                <text className='pop-textfield-title'>
                                    Company or Employer Name
                                </text> <br></br>
                                <TextField error={error.nameError} helperText={error.nameError ? "*This field is required" : ""} required={true} placeholder="Add your or your company/department name" type="search" square={false} style={{width: '98.5%'}} onChange={(e) => {handleValues(e)}} id='name' value={val.name}/>
                            </div>
                            <div style={{paddingTop: '2.5%'}}>
                                <text className='pop-textfield-title'>
                                    Job Location
                                </text> <br></br>
                                <TextField error={error.locationError} helperText={error.locationError ? "*This field is required" : ""} required={true} placeholder="Add the job location" type="search" square={false} style={{width: '98.5%'}} onChange={(e) => {handleValues(e)}} id='location' value={val.location}/>
                            </div>
                            <div style={{paddingTop: '2.5%', display: 'flex'}}>
                                <div style={{width: '35%', paddingRight: '2.5%'}}>
                                    <text className='pop-textfield-title'>
                                        Pay 
                                    </text> <br></br>
                                    <TextField InputProps={{inputProps: {inputMode: 'numeric', pattern: '[0-9.]*'}, startAdornment: <InputAdornment position="start">$</InputAdornment>}} error={error.payError} helperText={error.payError ? "*Invalid number" : ""} required={true} placeholder="" type="search" square={false} className='pop-textfield-title' style={{width: '100%'}} onChange={(e) => {handleValues(e)}} id='pay' value={val.pay}/>
                                </div>
                            </div>
                        </DialogContentText>
                    </DialogContent>
                <Divider/>
                    <DialogActions>
                        <Card sx={{height: 50, width: '10%'}} style={{overflow:'hidden', borderRadius: '15px', color: 'black', border: "1px solid black"}}>
                            <CardContent style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={closePop}> 
                                Back
                            </CardContent>
                        </Card>
                        <Card sx={{height: 50, width: '10%'}} style={{overflow:'hidden', borderRadius: '15px', background: "gray", color: 'white'}}>
                            <CardContent style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={openNextPop}> 
                                Next
                            </CardContent>
                        </Card>
                    </DialogActions>
            </Dialog>
        )
    }

    const secondJobSlide = () => {
        return (
            <Dialog open={openSecondPop} onClose={closeNextPop} maxWidth={"1000px"} PaperProps={{sx: { borderRadius: "15px"}}}>
                <div className='popup-title'>
                    <DialogTitle style={{width: "90%"}}> 
                        Tell us more about the job!
                    </DialogTitle>
                    <IconButton onClick={closeNextPop}>
                        <ClearIcon/>
                    </IconButton>
                </div>
            <Divider/>
                <DialogContent>
                    <DialogContentText ref={descriptionElementRefNextPop} tabIndex={-1} style={{width: '1000px'}}>
                        <div className='time-outer' style={{width: '98.5%'}}> 
                            <div className='date'>
                                <text className='pop-textfield-title'>
                                    Date
                                </text> <br></br>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        format="MM/DD/YYYY"
                                        value={dayjs(new Date(val.date.year, val.date.month-1, val.date.day))}
                                        onChange={(e) => {handleDate(e)}}
                                    />
                                </LocalizationProvider>
                            </div>
                            <div className='start-time'>
                                <text className='pop-textfield-title'>
                                    Start Time
                                </text> <br></br>
                                <LocalizationProvider dateAdapter={AdapterDayjs} style={{float: 'right'}}>
                                    <TimePicker 
                                        defaultValue={dayjs("00:00:00", "HH:mm:ss")} 
                                        ampm 
                                        value={dayjs({hour: val.startTime.hour, minute: val.startTime.min})}
                                        onChange={(e) => {handleStartTime(e)}}
                                    />
                                </LocalizationProvider>
                            </div>
                            <div>
                                <text className='pop-textfield-title'>
                                    End Time
                                </text> <br></br>
                                <LocalizationProvider dateAdapter={AdapterDayjs} style={{float: 'right'}}>
                                    <TimePicker 
                                        defaultValue={dayjs("00:00:00", "HH:mm:ss")} 
                                        ampm 
                                        value={dayjs({hour: val.endTime.hour, minute: val.endTime.min})}
                                        onChange={(e) => {handleEndTime(e)}}
                                    />
                                </LocalizationProvider>    
                            </div>

                        </div>
                        {/* <div className='time-outer' style={{width: '98.5%'}}> 
                            <text className='remove-time' onClick={() => {handleRemoveTime()}}>
                                - Remove previous date
                            </text>
                            <text className='pop-textfield-title' onClick={() => {handleAddTime()}}>
                                + Add date
                            </text>
                        </div> <br></br>
                        <div>
                            { val.times.length !== 0 ? 
                                <div> 
                                    <text className='pop-textfield-title'>
                                        Current Times:
                                    </text> <br></br>
                                    { val.times.map((subList) => {
                                        return <div>
                                        <text>
                                            {dayjs(subList[0]).format('MM/DD/YY h:mm A') + " - " + dayjs(subList[1]).format('h:mm A')}
                                        </text>
                                        <br></br>
                                    </div>
                                    })}
                                </div>:
                                <div>
                                    <text className='pop-textfield-title'>
                                        No Times Selected
                                    </text> <br></br>
                                </div>
                            }
                            
                        </div> */}
                        <div>
                            <text className='pop-textfield-title'>
                                Description
                            </text> <br></br>
                            <TextField error={error.descriptionError} helperText={error.descriptionError ? "*This field is required" : ""} required={true} multiline rows={8} placeholder="Add the job description" type="search" square={false} style={{width: '98.5%'}} onChange={(e) => {handleValues(e)}} id='description' value={val.description}/>
                        </div>
                        <div style={{paddingTop: '2.5%'}}>
                            <text className='pop-textfield-title'>
                                Category
                            </text> <br></br>
                            
                            <TextField error={error.categoryError} helperText={error.categoryError ? "*This field is required" : ""} required={true} type="search" square={false} style={{width: '98.5%'}} disabled={true} onClick={() => {setExpand(!expand)}} onChange={(e) => {handleValues(e)}} id='category' placeholder={"+ Add Category"}>
                            </TextField>
                            { expand && categories.map((name) => {
                                return (
                                    <MenuItem sx={{ border: 1}} style={{width: '15%'}} onClick={() => {handleAddingCategories(name)}} key={name} value={name}> 
                                        {name}
                                    </MenuItem>
                                )
                            })}
                            <Grid container columnSpacing={2} className='category-tab'>
                                {renderSelectedOptions(val.category)}
                            </Grid>
                        </div>
                    </DialogContentText>
                </DialogContent>
                <Divider/>
                <DialogActions>
                    <Card sx={{height: 50, width: '10%'}} square={false} style={{overflow:'hidden', borderRadius: '15px', color: 'black', border: "1px solid black"}}>
                        <CardContent style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={backSecondPop}> 
                            Back
                        </CardContent>
                    </Card>
                    <Card sx={{height: 50, width: '10%'}} square={false} style={{overflow:'hidden', borderRadius: '15px', background: "gray", color: 'white'}}>
                        <CardContent style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={PostJobs}> 
                            Submit
                        </CardContent>
                    </Card>
                </DialogActions>
            </Dialog>
        )
    }

    async function PostJobs() {
        handleError()
        const hasError = Object.values(error).some(e => e);
        if (!hasError) {
            const jobData = {
                title: val.title,
                job_poster: val.name,
                description: val.description,
                pay: val.pay,
                location: val.location,
                categories: Array.from(val.category),
                time: [new Date(val.date.year, val.date.month-1, val.date.day, val.startTime.hour, val.startTime.min), new Date(val.date.year, val.date.month-1, val.date.day, val.endTime.hour, val.endTime.min)],
                job_type: "Quick Jobs",
                date_posted: new Date()
            };
            try {
                const route = "https://jiffyjobs-api-production.up.railway.app/api/jobs/create";
                const response = await fetch(route, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(jobData)
                });
    
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
    
                const responseData = await response.json();
                console.log(responseData);
    
                empytyVals();
                setOpenStartPop(false);
                setOpenSecondPop(false);
    
            } catch (error) {
                console.error('There was an error!', error);
            }
        }
    }

    return (
        <Box className='job-search-tab'> 
            <div className='inner-div'>
                <Card sx={{ height: '10vw'}}elevation={8} style={{overflow: 'hidden', borderRadius: '15px', paddingTop: '3.5%', textAlign: 'center'}}>
                    <text className='job-search-text'> 
                        Find jobs or hire college students starting now with {" "}
                    </text>
                    <text className='job-search-logo'>
                        JiffyJobs
                    </text>
                    <br></br>
                    <div>
                        <TextField placeholder="Find Jobs..." type="search" style={{width: '35vw', paddingRight: '2.5%'}}/>
                        <Card sx={{width: '8vw'}} elevation={8} style={{overflow:'hidden', borderRadius: '15px', background: "#8253E7", color: 'white', display: 'inline-block', verticalAlign: 'center', alignItems: 'center', justifyContent: 'center'}}>
                            <CardContent onClick={openPop}> 
                                Post a Job
                            </CardContent>
                        </Card>
                    </div>
                    { openSecondPop ? secondJobSlide(): firstJobSlide()}
                </Card>
            </div>
        </Box>
    )
}