import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

import { Button, TextField, ToggleButton, ToggleButtonGroup, Card, 
        CardContent, Checkbox, FormControlLabel, Link, InputAdornment, 
        IconButton } from '@mui/material';

import { RegNavBar } from '../components/RegNavBar';


export function Login() {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const [ token, setToken ] = useState(localStorage.getItem("token"));
    const [showToken, setShowToken] = useState(false);

    useEffect(() => {
        if (token) setShowToken(true);
    },[token]);

    useEffect(()=> {
        if (showToken) {
            console.log(showToken);
            toast.info('Already Logged In!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                onClose: () => {
                    navigate('/JobBoard');
                    setShowToken(false);
                  }
            });
            setShowToken(false);
        }

    }, [showToken])

    // go to the job board
    const AllJobs = () => {
        navigate('/JobBoard')
    }

    // go to sign up page
    const handleSignUp = () => {
        navigate('/signup');
    };

    // handles the submit button
    const handleSubmit = (event) => {
        event.preventDefault();
        handleError(); 
    };

    // useState for the data
    const [val, setVal] = useState({
        email: '',
        password: '',
    })

    // useState for errors
    const [error, setError] = useState({
        emailError: false,
        passwordError: false,
    })

    // handles the error of the input boxes
    function handleError() {
        let isEmailError = !val.email || !validateEmail(val.email); 

        setError({
            emailError: isEmailError,
            passwordError: val.password === '',
        });
    }

    // handles the values of the input boxes
    function handleValues(event) {
        setVal({ ...val, [event.target.id]: event.target.value });
    }

    // handles the password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // validates the email
    const validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // handles the login
    const login = async () => {
        const Login = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: val.email,
                password: val.password
            })
        }

        const route = "https://jiffyjobs-api-production.up.railway.app/api/auth/Login";
        fetch(route, Login)
        .then(async (response) => {
            const res = await response.json()
            if (!response.ok) {
                throw new Error(res.message);
            } 
            return res;
        })
        .then((data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.email);
        localStorage.setItem("user", data.role);
        navigate("/JobBoard");
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
    }


    return (
        <> 
        <RegNavBar/> 
            <div className={ 'outerCard1' }>
            <Card sx={{ maxWidth: 650, maxHeight: 700, mx: 'auto', borderRadius: '20px'}}>
                <CardContent style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Outfit', fontWeight: 'bold', fontSize: '28px', textAlign: 'center', marginTop: '30px', marginBottom: '10px'}}>
                        Welcome to JIFFYJOBS!
                    </div>
                    
                    <form onSubmit={handleSubmit} noValidate autoComplete="off" style={{ alignItems: 'center' }}>

                    <div style={{paddingTop: '1.5%'}}>
                        <div style={{ textAlign: 'left', width: '68.5%', margin: '0 auto' }}>
                            <text className='pop-textfield-title' style={{ fontFamily: 'Outfit'}}>
                                Email
                            </text> <br></br>
                        </div>
                        <TextField error={error.emailError} helperText={error.emailError ? (val.email === '' ? "*This field is required" : "*Please enter a valid email address") : ""} required={true} placeholder={"Enter Email"}  type="email" square={false} style={{width: '68.5%', fontFamily: 'Outfit',}} FormHelperTextProps={{ style: { fontFamily: 'Outfit' }}} onChange={handleValues} id="email" value={val.email}
                            InputProps={{
                                style: {  borderRadius: '10px', fontFamily: 'Outfit' }
                            }}
                        />
                    </div>
                    <div style={{paddingTop: '1.5%', paddingBottom: '1.5%'}}>
                        <div style={{ textAlign: 'left', width: '68.5%', margin: '0 auto' }}>
                            <text className='pop-textfield-title' style={{ fontFamily: 'Outfit'}}>
                                Password
                            </text> <br></br>
                        </div>
                        <TextField error={error.passwordError} helperText={error.passwordError ? "*This field is required" : ""} required={true} placeholder="Enter Password" type={showPassword ? "text" : "password"}  square={false} style={{width: '68.5%', fontFamily: 'Outfit'}} FormHelperTextProps={{ style: { fontFamily: 'Outfit' }}} onChange={handleValues} id="password" value={val.password}
                            InputProps={{ 
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={togglePasswordVisibility}
                                            edge="end"
                                            style={{ fontFamily: 'Outfit', textTransform: 'none', fontSize: '0.8rem'}} 
                                        >
                                            {showPassword ? 'Hide' : 'Show'}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                style: {  borderRadius: '10px', fontFamily: 'Outfit' }
                            }}
                        />
                    </div>
                                
                    <div style={{ }}>
                        <Button type="submit" onClick={login} sx={{ width: '68.5%', mt: 1, mb: 2, p: '1.5%', marginTop: '10px', marginBottom: '10px', backgroundColor: '#A4A4A4', '&:hover': { backgroundColor: '#7D7D7D' }, borderRadius: '30px', textTransform: 'none', color: 'white', fontFamily: 'Outfit', border: '1px solid #5B5B5B' }} >
                            Log in
                        </Button>
                    </div>
                    <div class="orLine-container">
                        <div class="orLine "></div>
                        <span class="orText">or</span>
                        <div class="orLine "></div>
                    </div>
                    <div style={{ }}>
                        <Button onClick={handleSignUp} sx={{ width: '68.5%', mt: 1, mb: 2, p: '1.5%', marginTop: '10px', marginBottom: '30px', backgroundColor: '#5B5B5B', '&:hover': { backgroundColor: '#7D7D7D' }, borderRadius: '30px', textTransform: 'none', color: 'white', fontFamily: 'Outfit'}} >
                            Don’t have an account? Join now!
                        </Button>
                    </div>
                    </form>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

