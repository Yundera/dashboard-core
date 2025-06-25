import {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

import {Avatar, Box, Button, Card, CardActions, CircularProgress,} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import {Form, required, TextInput, useLogin, useNotify, useTranslate,} from 'react-admin';
import {RegisterPagePath} from "./RegisterPage";
import {PasswordResetPage} from "./PasswordResetPage";

import GradientButton from '../component/GradientButton';
import GradientCard from '../component/GradientCard';

export const Login = () => {
    const [loading, setLoading] = useState(false);
    const translate = useTranslate();
    const navigate = useNavigate();

    const notify = useNotify();
    const login = useLogin();
    const location = useLocation();

    const handleSubmit = (auth: FormValues) => {
        setLoading(true);
        login(
            auth,
            location.state ? (location.state as any).nextPathname : '/'
        ).catch((error: Error) => {
            setLoading(false);
            notify(
                typeof error === 'string'
                    ? error
                    : typeof error === 'undefined' || !error.message
                      ? 'ra.auth.sign_in_error'
                      : error.message,
                {
                    type: 'error',
                    messageArgs: {
                        _:
                            typeof error === 'string'
                                ? error
                                : error && error.message
                                  ? error.message
                                  : undefined,
                    },
                }
            );
        });
    };

    return (
        <Form onSubmit={handleSubmit} noValidate>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    background:
                        'url(https://source.unsplash.com/featured/1600x900)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                }}
            >
              <GradientCard sx={{minWidth: 300, marginTop: '6em'}}>
                <Box
                  sx={{
                    margin: '1em',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Avatar sx={{bgcolor: 'primary.main'}}>
                    <LockIcon/> 
                  </Avatar>
                </Box>
                <Box
                  sx={{
                    marginTop: '1em',
                    display: 'flex',
                    justifyContent: 'center',
                    fontSize: '0.8em',
                    color: theme => theme.palette.text.primary,
                  }}
                >
                  Welcome!
                </Box>
                <Box sx={{padding: '0 1em 1em 1em'}}>
                  <Box sx={{marginTop: '1em'}}>
                    <TextInput
                      autoFocus
                      source="username"
                      label={translate('ra.auth.username')}
                      disabled={loading}
                      validate={required()}
                    />
                  </Box>
                  <Box sx={{marginTop: '0.25em'}}>
                    <TextInput
                      source="password"
                      label={translate('ra.auth.password')}
                      type="password"
                      disabled={loading}
                      validate={required()}
                    />
                  </Box>
                </Box>
                <CardActions sx={{padding: '0 1em 1em 1em'}}>
                  <GradientButton
                    variant="contained"
                    type="submit"
                    color="primary"
                    disabled={loading}
                    fullWidth
                  >
                    {loading && (
                      <CircularProgress size={25} thickness={2}/>
                    )}
                    {translate('ra.auth.sign_in')}
                  </GradientButton>
                </CardActions>
                <CardActions sx={{padding: '0 1em 1em 1em'}}>
                  <GradientButton
                    variant="contained"
                    type="button"
                    color="primary"
                    disabled={loading}
                    fullWidth
                    onClick={() => navigate(RegisterPagePath)}
                  >
                    {loading && (
                      <CircularProgress size={25} thickness={2}/>
                    )}
                    {translate('auth.sign_up')}
                  </GradientButton>
                </CardActions>
                <CardActions sx={{padding: '0 1em 1em 1em'}}>
                  <Button
                    variant="text"
                    type="button"
                    color="secondary"
                    disabled={loading}
                    fullWidth
                    onClick={() => navigate(PasswordResetPage.path)}
                  >
                    {translate('auth.forgot_password')}
                  </Button>
                </CardActions>
              </GradientCard>

              <Box
                  component="img"
                  src="/yunderaLogo.svg"
                  alt="Logo"
                  sx={{
                      position: 'absolute',
                      bottom: 16,        // px from bottom
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 120,
                      height: 'auto',
                      zIndex: -1000,
                      filter: 'drop-shadow(-1px 1px 2px rgba(0,0,0,0.3))',
                  }}
              />
            </Box>
        </Form>
    );
};

interface FormValues {
    username?: string;
    password?: string;
}
