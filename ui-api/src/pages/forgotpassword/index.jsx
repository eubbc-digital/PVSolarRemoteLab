/*Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Andres Gamboa, Alex Villazon*/

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Grid, TextField, Button } from '@mui/material';
import { toast } from 'react-toastify';
import LoadingButton from '@mui/lab/LoadingButton';

export default function Forgotpassword() {
	const router = useRouter();
	const [token, setToken] = useState('');
	const [email, setEmail] = useState('');

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const [confirmPasswordError, setConfirmPasswordError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);

	const [passwordMessage, setPasswordMessage] = useState('');
	const [confirmPasswordMessage, setConfirmPasswordMessage] = useState('');

	const [loading, setLoading] = React.useState(false);

	const resetPassword = async () => {
		try {
			if (validateFields()) {
				setLoading(true);
				setPasswordError(false);
				const request = await fetch(`/solar-lab/api/forgotpassword/reset`, {
					headers: {
						'Content-Type': 'application/json',
					},
					method: 'POST',
					body: JSON.stringify({ token: token, password: password }),
				});
				const response = await request.json();
				setLoading(false);
				if (response.status) {
					setConfirmPassword('');
					setPassword('');
					router.push('/');
					toast.success('Success!, you can now Log In');
				} else {
					toast.error(response.error);
				}
			} else {
				toast.error('Incorrect Passwords');
				setPasswordError(true);
			}
		} catch (error) {
			setLoading(false);
		}
	};
	const sendEmail = async () => {
		try {
			setLoading(true);
			const request = await fetch(`/solar-lab/api/forgotpassword/sendemail`, {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify({ email: email }),
			});
			const response = await request.json();
			setLoading(false);
			if (response.status) {
				setEmail('');
				toast.success('Sent, Go to your Email!');
			} else {
				setEmail('');
				toast.error(response.error);
			}
		} catch (error) {
			setLoading(false);
		}
	};
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		setToken(urlParams.get('token') || '');
	}, []);

	const handlePasswordChange = (event) => {
		const regex = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d).*$/;
		setPassword(event.target.value);
		if (!regex.test(event.target.value)) {
			setPasswordMessage(
				'Password should contain at least 8 characters, a Lowercase and a Capital Letter'
			);
			setPasswordError(true);
		} else {
			setPasswordMessage('');
			setPasswordError(false);
		}
	};

	const handleConfirmPasswordChange = (event) => {
		setConfirmPassword(event.target.value);
		if (password != event.target.value) {
			setConfirmPasswordMessage('Passwords do not match');
			setConfirmPasswordError(true);
		} else {
			setConfirmPasswordMessage('');
			setConfirmPasswordError(false);
		}
	};

	const validateFields = () => {
		return (
			!passwordError &&
			!confirmPasswordError &&
			password != '' &&
			confirmPassword
		);
	};

	return (
		<div>
			{token.length > 0 ? (
				<Grid
					container
					justify='center'
					rowSpacing={{ xxs: 1, xs: 1, s: 1, sm: 2, md: 2 }}
					sx={{
						minWidth: '100%',
						paddingX: '25vw',
						paddingY: '25vh',
						minHeight: '100vh',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
					}}
				>
					<Grid
						item
						sx={{
							display: 'flex',
							alignItems: 'left',
							textAlign: 'left',
						}}
						justifyContent='center'
					>
						<Typography variant='header2' color='secondary' mr={1}>
							Solar
						</Typography>
						<Typography variant='header2' color='primary.700'>
							Remote Lab
						</Typography>
					</Grid>
					<Grid item xxs={12} xs={12}>
						<Typography variant='header3'>New Password</Typography>
					</Grid>
					<Grid item xxs={12} xs={12}>
						<TextField
							error={passwordError}
							required
							fullWidth
							size='small'
							variant='outlined'
							type='password'
							autoComplete='new-password'
							value={password}
							onChange={handlePasswordChange}
							helperText={passwordMessage}
						/>
					</Grid>
					<Grid item xxs={12} xs={12}>
						<Typography variant='header3'>Confirm New Password</Typography>
					</Grid>
					<Grid item xxs={12} xs={12}>
						<TextField
							required
							fullWidth
							size='small'
							variant='outlined'
							type='password'
							autoComplete='new-password'
							value={confirmPassword}
							onChange={handleConfirmPasswordChange}
							error={confirmPasswordError}
							helperText={confirmPasswordMessage}
						/>
					</Grid>
					<Grid
						item
						xxs={12}
						xs={12}
						mb={{ xxs: 1, xs: 1, sm: 2 }}
						mt={{ xxs: 1, xs: 1, s: 2, sm: 2 }}
						sx={{
							display: 'flex',
							alignItems: 'center',
							textAlign: 'center',
						}}
						justifyContent='center'
					>
						<LoadingButton
							loading={loading}
							variant='contained'
							sx={{
								color: 'white',
								textTransform: 'none',
								bgcolor: 'primary.700',
							}}
							onClick={resetPassword}
						>
							<Typography variant='buttonsExperiments'>
								Reset Password
							</Typography>
						</LoadingButton>
					</Grid>
				</Grid>
			) : (
				<Grid
					container
					justify='center'
					rowSpacing={{ xxs: 1, xs: 1, s: 1, sm: 2, md: 2 }}
					sx={{
						minWidth: '100%',
						paddingX: '25vw',
						paddingY: '25vh',
						minHeight: '100vh',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
					}}
				>
					<Grid
						item
						xxs={12}
						xs={12}
						sx={{
							display: 'flex',
							alignItems: 'left',
							textAlign: 'left',
						}}
						justifyContent='center'
					>
						<Typography variant='header2' color='secondary' mr={1}>
							Password
						</Typography>
						<Typography variant='header2' color='primary.700'>
							Reset
						</Typography>
					</Grid>
					<Grid
						item
						xxs={12}
						xs={12}
						sx={{
							display: 'flex',
							alignItems: 'left',
							textAlign: 'left',
						}}
						justifyContent='left'
					>
						<Typography variant='header3'>
							Enter your email address below:
						</Typography>
					</Grid>
					<Grid
						item
						xxs={12}
						xs={12}
						sx={{
							display: 'flex',
							alignItems: 'left',
							textAlign: 'left',
						}}
						justifyContent='left'
					>
						<Typography variant='buttonsExperiments' mr={2}>
							Email:
						</Typography>
					</Grid>
					<Grid
						item
						xxs={12}
						xs={12}
						sx={{
							display: 'flex',
							alignItems: 'center',
							textAlign: 'center',
						}}
						justifyContent='center'
					>
						<TextField
							fullWidth
							required
							size='small'
							variant='outlined'
							autoComplete='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</Grid>
					<Grid
						item
						xxs={12}
						xs={12}
						mt={{ xxs: 1, xs: 1, s: 1, sm: 2 }}
						sx={{
							display: 'flex',
							alignItems: 'center',
							textAlign: 'center',
						}}
						justifyContent='center'
					>
						<LoadingButton
							loading={loading}
							variant='contained'
							sx={{
								color: 'white',
								textTransform: 'none',
								bgcolor: 'primary.700',
							}}
							onClick={sendEmail}
						>
							<Typography variant='buttonsExperiments'>
								Send Password Reset
							</Typography>
						</LoadingButton>
					</Grid>
				</Grid>
			)}
		</div>
	);
}
