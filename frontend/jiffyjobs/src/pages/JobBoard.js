import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import ClearIcon from '@mui/icons-material/Clear';
import StarBorderRounded from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from "@mui/icons-material/StarRounded"
import { Dialog, Divider, Typography, DialogContentText, DialogContent, 
        DialogActions, DialogTitle, Link, Button, Pagination, Grid, 
        CardContent, Card, Box, IconButton, Chip, TextField, Avatar,
        Stack, CardMedia } from '@mui/material';

import dayjs from 'dayjs';

import { Filter } from '../components/Filter';
import { Sort } from '../components/Sort';
import { JobPosting } from '../components/JobPosting';
import { JobCards } from '../components/JobCards';
import { CongratsPopup } from '../components/CongratsPopup';
import { SubmitProfilePopup } from '../components/popupCards/submitProfilePopup';
import { JobDescriptionPopup } from '../components/popupCards/jobDescriptionPopup';

export function JobBoard() {
    const [jobData, setJobData] = useState([])
    const [rawData, setRawData] = useState([]);
    const [size, setSize] = useState(0)
    const [background, setBackground] = useState("")
    const { render, filterList } = Filter()
    const [openPop, setOpenPop] = useState(false)
    const [currentPop, setCurrentPop] = useState([])
    const [profile, setProfile] = useState([])
    const [gotProfile, setGotProfile] = useState(false);

    const [page, setPage] = useState(1);
    const cardsPerPage = 20;
    const totalCards = jobData.length;
    const totalPages = Math.ceil(totalCards / cardsPerPage);

    const [openSubmitProfile, setOpenSubmitProfile] = useState(false);
    const [openCongratsPopup, setOpenCongratsPopup] = useState(false);

    const [isJobSaved, setIsJobSaved] = useState({});
    const [showSavedMessage, setShowSavedMessage] = useState(false);

    const [ userEmail, setUserEmail ] = useState(localStorage.getItem("email"));
    const [ userRole, setUserRole ] = useState(localStorage.getItem("user"));

    const [savedJobs, setSavedJobs] = useState([]) 
    const [jobSaved, setJobSaved] = useState(false)

    const navigate = useNavigate();

    // whenever user clicks the search button, gets directed to here
    const handleJobPostingData = (data) => {
        if (!data) {
            data = " ";
        }
        console.log(data);
        const route = `https://jiffyjobs-api-production.up.railway.app/api/jobs/search/${data}/prop`;
        fetch(route)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log(response);
                return response.json();
            })
            .then((data) => {
                setRawData(data);
                const newJobData = data.map(function(obj) {
                    return [[obj._id, obj.title], [randomImage(obj.categories.toString().split(",")[0]), obj.job_poster], ["", obj.location], ["", obj.pay], ["", obj.description], ["", dayjs(new Date(obj.time[0])).format('MM/DD/YY h:mm A')  + " " + " - " + dayjs(new Date(obj.time[1])).format('h:mm A')], ["", obj.categories.toString()]]
                });
                setJobData(newJobData);
                setSize(jobData.length)

                if (size <= 4) {
                    setBackground("1")
                } else {
                    setBackground("")
                }

                const savedStatus = {};
             data.forEach(job => {
                 savedStatus[job.id] = false; 
             });
            setIsJobSaved(savedStatus);
            })
            .catch((error) => {
                console.log(error)
            })
    };

    // go to dashboard
    const handleToDashboard = () => {
        navigate('/dashboard');
    };

    // random image for category
    const randomImage = (seed) => {
        return `https://source.unsplash.com/random?${seed}`;
    };


    // handles getting all jobs
    useEffect(() => {
        async function GetAllJobs() {
            const route = "https://jiffyjobs-api-production.up.railway.app/api/jobs/get"
            fetch(route)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data) => {
                    const sortedData = data.sort((a, b) => {
                        const startTimeA = dayjs(a.time[0]);
                        const startTimeB = dayjs(b.time[0]);
                        
                        if (!startTimeA.isValid()) return 1;
                        if (!startTimeB.isValid()) return -1;
                        
                        return startTimeA.isAfter(startTimeB) ? 1 : -1;
                    });
                    
                    setRawData(data);
                    const newJobData = data.map(function(obj) {
                        console.log(obj.time)
                        return [[obj._id, obj.title], [randomImage(obj.categories.toString().split(",")[0]), obj.job_poster], ["", obj.location], ["", obj.pay], ["", obj.description], ["", dayjs(new Date(obj.time[0])).format('MM/DD/YY h:mm A')  + " " + " - " + dayjs(new Date(obj.time[1])).format('h:mm A')], ["", obj.categories.toString()]]
                    });
                    setJobData(newJobData);

                    const newSize = newJobData.length;
                    setSize(newSize);

                    if (newSize <= 4) {
                        setBackground("1")
                    } else {
                        setBackground("")
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        if (filterList.size === 0) {
            GetAllJobs()
        }
    }, [filterList]);
    

    // handles filtering job
    useEffect(() => {
        console.log(filterList)
        async function FilterJobs() {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }
            var route = "https://jiffyjobs-api-production.up.railway.app/api/jobs/filter"
            var query = "/*/*/" + Array.from(filterList) + "/*/*"
            console.log(query)
            route = route + query
            console.log(route)
            fetch(route, requestOptions)
                .then((response) => {
                    if (!response.ok) { 
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data) => {
                    setRawData(data);
                    const newJobData = data.map(function(obj) {
                        return [[obj._id, obj.title], [randomImage(obj.categories.toString().split(",")[0]), obj.job_poster], ["", obj.location], ["", obj.pay], ["", obj.description], ["", dayjs(new Date(obj.time[0])).format('MM/DD/YY h:mm A')  + " " + " - " + dayjs(new Date(obj.time[1])).format('h:mm A')], ["", obj.categories.toString()]]
                    });
                    setJobData(newJobData);
                    setSize(jobData.length)

                    if (size <= 4) {
                        setBackground("1")
                    } else {
                        setBackground("")
                    }

                    const savedStatus = {};
                 data.forEach(job => {
                     savedStatus[job.id] = false; 
                 });
                setIsJobSaved(savedStatus);
                })
                .catch((error) => {
                    console.log(error)
                }
            )
        }
        
        if (filterList.size !== 0) {
            setJobData([])
            FilterJobs()
        }

    }, [filterList])

    // close popup
    const closePop = () => {
        setOpenPop(false);
    }
    
    // open popup
    const openPopUp = (key) => {
        setCurrentPop(key);
        console.log(currentPop);
        if (!userEmail) {
            toast.dismiss()
            console.log("here")
            toast.error('Please login to view!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else {
            setOpenPop(true);
        }
    }

    const descriptionElementRefStartPop = React.useRef(null)
    useEffect(() => {
        if (openPopUp) {
            const { current: descriptionElement } = descriptionElementRefStartPop
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [openPopUp])

    // function handleLogJobData() {
    //     console.log('Data', jobData)
    //     console.log('Raw', rawData)
    //     console.log('Job Saved', isJobSaved)
    // }

    useEffect(()=> {
        console.log(userEmail);
        console.log(userRole);
        console.log(savedJobs);
    },[])

    // open submit profile popup
    const handleOpenSubmitProfile = () => {
         if (userRole === 'provider') {
            toast.dismiss()
            toast.error('You can only apply as a Seeker!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else if (!gotProfile) {
            const requestedOptions = {
                method: "GET",
                headers: { 'Content-Type': 'application/json' },
            }
    
            const route = `https://jiffyjobs-api-production.up.railway.app/api/users/getinfo/${userEmail}/${userRole}`;
            fetch(route, requestedOptions)
            .then(async (response) => {
                const res = await response.json()
                if (!response.ok) {
                    throw new Error(res.message);
                }
                return res;
            })
            .then((data) => {
                const user = [data.personal_info.first_name, data.personal_info.last_name, data.personal_info.school, data.personal_info.major, data.personal_info.grade, data.personal_info.personal_statement[0]];
                setProfile(user);
                setOpenSubmitProfile(true);
                setGotProfile(true);
            })
        } else {
            setOpenSubmitProfile(true);
        }
    };

    // close submit profile popup
    const handleCloseSubmitProfile = () => {
        setOpenSubmitProfile(false);
    };

    const handleSubmitProfile = () => {
        handleCloseSubmitProfile();
        setOpenCongratsPopup(true);
        const user = {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                seeker_email: userEmail,
                job_id: currentPop[0][0]
            })
        }

        const route = "https://jiffyjobs-api-production.up.railway.app/api/users/apply";
        fetch(route, user)
        .then(async (response) => {
            const res = await response.json()
            if (!response.ok) {
                throw new Error(res.message);
            } 
            return res;
        })
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            const err = error.message;
            if (err.startsWith('Error: ')) {
                alert(err.slice(7));
                toast.error(err.slice(7), {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light"
                });
            } else {
                toast.error(err, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light"
                });
            }
        });

    };

    // toggle save job
    const toggleSaveJob = async (jobDetails) => {
        
        // setShowSavedMessage(true);
        // setTimeout(() => setShowSavedMessage(false), 1000);
        if (userRole === "provider") {
            toast.dismiss()
            toast.error('You can only save jobs as a Seeker!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else {
            const save = {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userEmail,
                    job_id: jobDetails
                })
            }

            const route = "https://jiffyjobs-api-production.up.railway.app/api/users/save";
            await fetch(route, save)
            .then(async (response) => {
                const res = await response.json()
                if (!response.ok) {
                    throw new Error(res.message);
                } 
                return res;
            })
            .then(async (data) => {
                await getJobs();
                await setJobSaved(savedJobs.includes(jobDetails));
                setIsJobSaved(prevState => ({
                    ...prevState,
                    [jobDetails]: !prevState[jobDetails] 
                }));


                setShowSavedMessage(true);
                setTimeout(() => setShowSavedMessage(false), 1000);

                console.log("here");
            }).catch((error) => {
                console.log(error);
            });
            console.log(jobDetails)
        }
    };

    async function getJobs() {
        const route = `https://jiffyjobs-api-production.up.railway.app/api/users/saved/${userEmail}`

        fetch(route)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                const newJobData = data.map(function(obj) {
                    return obj._id
                });
                setSavedJobs(newJobData);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    useEffect(() => {
        if (userEmail) {
            getJobs();
        }
    }, [userEmail]);

    
    return (
        <div className={`outerCard2 ${openPop ? 'blur-background' : ''}`}>
            <JobDescriptionPopup
                closePop={closePop}
                openSubmitProfile={openSubmitProfile}
                handleOpenSubmitProfile={handleOpenSubmitProfile}
                openCongratsPopup={openCongratsPopup}
                currentPop={currentPop}
                descriptionElementRefStartPop={descriptionElementRefStartPop}
                toggleSaveJob={toggleSaveJob}
                savedJobs={savedJobs}
                jobSaved={jobSaved}
                openPop={openPop}
                showSavedMessage={showSavedMessage}
            />
            <JobPosting onJobDataSubmit={handleJobPostingData} /> 
            <Box className='job-table-box'>
                <div className='job-table-inner' style={{ paddingTop: '50px', width: '1136px'}}>
                    <Typography style={{fontFamily: 'Outfit', fontSize: '20px', justifyContent: 'center', alignItems: 'center', textAlign: 'start'}}>
                        Job Board 
                    </Typography>
                </div>
            </Box>
            <Box className='job-table-box'>
                <div style={{display: 'grid', justifyContent: 'center', alignItems: 'center',}}>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', width: '1136px', }}>
                        { render }
                        <div>
                            <Sort rawData={rawData} setRawData={setRawData} setJobData={setJobData} />
                        </div>
                    </div>
                    <Divider width='1136px'/>
                </div>
                {/* <button onClick={handleLogJobData}>Log Job Data</button> */}
            </Box>
            <JobCards jobData={jobData} page={page} cardsPerPage={cardsPerPage} openPopUp={openPopUp}/>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '1%', background: '#f3f3f3', fontFamily: 'Outfit', fontSize: '14px' }}>
                <Pagination count={totalPages} page={page} onChange={(event, value) => setPage(value)}  className="custom-pagination" />
            </div>
            {openSubmitProfile && (<SubmitProfilePopup open={openSubmitProfile} onClose={handleCloseSubmitProfile} onSubmit={handleSubmitProfile} profile={profile}/>)}
            {openCongratsPopup && (<CongratsPopup open={openCongratsPopup} onClose={() => setOpenCongratsPopup(false)} onDashboardRedirect={handleToDashboard}/>)}
        </div>
    )
}