import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Card, Stack, Avatar, Typography, Grid, TextField } from '@mui/material';
import '../styles/Dashboard.css';

export function Profile() { 
    const [ userType, setUserType ] = useState('seeker');
    const [ userRole, setUserRole ] = useState(localStorage.getItem("user"));
    const [ userEmail, setUserEmail ] = useState(localStorage.getItem("email")); 
    const [last, setLast] = useState(localStorage.getItem("last"));
    const [first, setFirst] = useState(localStorage.getItem("first"));
    const [ seeker, setSeeker ] = useState({
        major: '',
        grade: '',
        school: '',
        bio: ''
    })
    const [ provider, setProvider ] = useState({
        org: ''
    })

    const gradeList = ["First-year", "Second-year", "Third-year", "Fourth-year", "Grad Student"];

    const [ token, setToken ] = useState(localStorage.getItem("token"));
    const [ showToken, setShowToken ] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setShowToken(true);
        }
    },[token]);

    useEffect(() => {
        if (showToken) {
            console.log(showToken);
            toast.dismiss()
            toast.error('Please Login!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            navigate('/login');
            setShowToken(false);
        } 
    }, [showToken])

    async function getProfile() {
        const route = `https://jiffyjobs-api-production.up.railway.app/api/users/getinfo/${userEmail}/${userRole}`;
        fetch(route)
            .then(async (response) => {
                const res = await response.json();
                if (!response.ok) {
                    throw new Error(res.message);
                }
                return res;
            }).then((data) => {
                if (userRole === 'seeker') {
                    setSeeker({
                        major: data.personal_info.major,
                        grade: data.personal_info.grade,
                        school: data.personal_info.school,
                        bio: data.personal_info.personal_statement[0]
                    })
                } else {
                    setProvider({
                        org: data.personal_info.organization
                    })
                }
            }).catch((error) => {
                console.log(error);
            }
        )
    }

    useEffect(() => {
        if (userEmail) {
            getProfile();
        }
    }, [userEmail]);


    const wordLimit = 50;

    // const handleBioChange = (event) => {
    //     const text = event.target.value;
    //     const words = text.split(/\s+/); 
    //     if (words.length <= wordLimit || text.endsWith(" ")) {
    //       setBio(text);
    //     } else {
    //       const trimmedText = words.slice(0, wordLimit).join(' ');
    //       setBio(trimmedText);
    //     }
    //   };

    const saveProfileChanges = async () => {
        const update = {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: userEmail,
                role: userRole,
                major: '',
                grade: '',
                bio: '',
                organization: ''
            })
        }
        const route = 'https://jiffyjobs-api-production.up.railway.app/api/users/getinfo/update'
        await fetch(route, update)
        .then(async (response) => {
            const res = await response.json()
            if (!response.ok) {
                throw new Error(res.message);
            } 
            return res;
        }).then(async (data) => {
            if (userRole === 'seeker') {
                setSeeker({
                    major: data.personal_info.major,
                    grade: data.personal_info.grade,
                    bio: data.personal_info.bio[0]
                })
            } else {
                setProvider({
                    org: data.personal_info.organization
                })
            }
        }).catch((error) => {
            console.log(error)
        })
    };

    const renderFields = () => {
        if (userRole === 'provider') {
            return (
                <>
                    <Grid item xs={6} container direction="row" alignItems="center" spacing={1}>
                        <Grid item xs={3}>
                            <Typography style={{ fontFamily: 'Outfit', color: '#A4A4A4', fontWeight: 400, fontSize: '14px' }}>
                                Organization
                            </Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <TextField value={provider.org} variant="outlined" fullWidth size="small" className="inputSubmit" style={{ width: '161px' }}
                            InputProps={{ style: { fontFamily: 'Outfit', fontSize: '12px' }}}/>
                        </Grid>
                    </Grid>

                    <Grid item xs={6} container direction="row" alignItems="center" spacing={1}>
                        <Grid item xs={3}>
                            <Typography style={{ fontFamily: 'Outfit', color: '#A4A4A4', fontWeight: 400, fontSize: '14px' }}>
                                Email<span style={{color: "red"}}>*</span>
                            </Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <TextField disabled value={userEmail} variant="outlined" fullWidth size="small" className="inputSubmit" style={{ width: '161px' }}
                            InputProps={{ style: { fontFamily: 'Outfit', fontSize: '12px' }}}/>
                        </Grid>
                    </Grid>
                    
                </>
            );
        } else {
            return (
                <>
                <Grid container direction="row" alignItems="center" spacing={2}>
                    <Grid item xs={6} container direction="row" alignItems="center" spacing={1}>
                        <Grid item xs={3}>
                            <Typography style={{ fontFamily: 'Outfit', color: '#A4A4A4', fontWeight: 400, fontSize: '14px' }}>
                                School<span style={{ color: "red" }}>*</span>
                            </Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <TextField disabled value={seeker.school} variant="outlined" fullWidth size="small" className="inputSubmit" style={{ width: '161px' }}
                                InputProps={{ style: { fontFamily: 'Outfit', fontSize: '12px' }}} />
                        </Grid>
                    </Grid>
                    <Grid item xs={6} container direction="row" alignItems="center" spacing={1}>
                        <Grid item xs={3}>
                            <Typography style={{ fontFamily: 'Outfit', color: '#A4A4A4', fontWeight: 400, fontSize: '14px' }}>
                                Major<span style={{color: "red"}}>*</span>
                            </Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <TextField value={seeker.major} variant="outlined" fullWidth size="small" className="inputSubmit" style={{ width: '161px' }}
                            InputProps={{ style: { fontFamily: 'Outfit', fontSize: '12px' }}}/>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container direction="row" alignItems="center" spacing={2}>
                    <Grid item xs={6} container direction="row" alignItems="center" spacing={1}>
                        <Grid item xs={3}>
                            <Typography style={{ fontFamily: 'Outfit', color: '#A4A4A4', fontWeight: 400, fontSize: '14px' }}>
                                Grade
                            </Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <TextField value={seeker.grade} variant="outlined" fullWidth size="small" className="inputSubmit" style={{ width: '161px' }}
                            InputProps={{ style: { fontFamily: 'Outfit', fontSize: '12px' }}}/>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container direction="row" alignItems="center" spacing={2}>
                    <Grid item xs={6} container direction="row" alignItems="center" spacing={1}>
                        <Grid item xs={3}>
                            <Typography style={{ fontFamily: 'Outfit', color: '#A4A4A4', fontWeight: 400, fontSize: '14px' }}>
                                Email<span style={{color: "red"}}>*</span>
                            </Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <TextField disabled value={userEmail} variant="outlined" fullWidth size="small" className="inputSubmit" style={{ width: '161px' }}
                            InputProps={{ style: { fontFamily: 'Outfit', fontSize: '12px' }}}/>
                        </Grid>
                    </Grid>
                </Grid>

                <Typography style={{ fontFamily: 'Outfit', color: '#A4A4A4', fontWeight: 400, fontSize: '14px' }}> Other Information</Typography>

                <Grid container direction="row" alignItems="center" spacing={2}>
                    <Grid item xs={6} container direction="row" alignItems="center" spacing={1}>
                        <Grid item xs={3}>
                            <Typography style={{ fontFamily: 'Outfit', color: '#A4A4A4', fontWeight: 400, fontSize: '14px' }}>
                                Bio
                            </Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <TextField value={seeker.bio} variant="outlined" fullWidth size="small" className="inputSubmit" style={{ width: '161px' }}
                            InputProps={{ style: { fontFamily: 'Outfit', fontSize: '12px' }}}/>
                        </Grid>
                    </Grid>
                </Grid>
                </>
            )
        }
    };
    return (
        <div className='outerCard' style={{ marginTop: '0px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{}}>
                <Box className='outer-box'>
                    <div className='inner-div'>
                        <Card elevation='4' style={{ overflow: 'hidden', borderRadius: '15px', width: "100%" }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '16px', marginLeft: '73px' }}>
                                <div style={{ marginBottom: '8px' }}>
                                    <Grid container direction="column" spacing={2} style={{marginTop: '10px'}}>
                                        
                                        <Typography style={{ fontFamily: 'Outfit', color: '#A4A4A4', fontWeight: 400, fontSize: '14px' }}> Edit Profile</Typography>
                                        
                                        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                                            <Avatar sx={{ bgcolor: '#D9D9D9', width: 50, height: 50, color: 'black', fontSize: '26.231px', fontFamily: 'Outfit', fontWeight: 400 }}>{first && first.length > 0 && first[0]}{last && last.length > 0 && last[0]} </Avatar>
                                        
                                            <div style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 500, marginLeft: '8px' }}>
                                                {first && first.length > 0 && first} {last && last.length > 0 && last} 
                                            </div>
                                        </div>


                                        <Typography style={{ fontFamily: 'Outfit', color: '#A4A4A4', fontWeight: 400, fontSize: '14px' }}> Basic Information</Typography>

                                        {renderFields()}
                                    </Grid>
                                </div>
                            </div>
                        </Card>
                    </div>
                </Box>
            </div>
        </div>
    )
}
