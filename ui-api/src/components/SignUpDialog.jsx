import GoogleButton from './GoogleButton';
import {
	Box,
	Dialog,
	Divider,
	Grid,
	Link,
	TextField,
	Typography,
	Button,
	FormControlLabel,
	Checkbox,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

export default function SignUpDialog({ open, handleClose, onClickSignIn }) {
	const { data: session, status } = useSession();

	const [emailDisable, setEmailDisable] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [name, setName] = useState('');
	const [isTeacher, setIsTeacher] = useState(false);

	const [emailError, setEmailError] = useState(false);
	const [nameError, setNameError] = useState(false);
	const [confirmPasswordError, setConfirmPasswordError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);

	const [emailMessage, setEmailMessage] = useState('');
	const [passwordMessage, setPasswordMessage] = useState('');
	const [confirmPasswordMessage, setConfirmPasswordMessage] = useState('');
	const [nameMessage, setNameMessage] = useState('');

	const [loading, setLoading] = React.useState(false);

	useEffect(() => {
		clearFields();
		if (session) {
			loadData();
		}
	}, [open]);

	const handleAuth = async () => {
		if (validateFields()) {
			setLoading(true);
			const response = await fetch(`/solar-lab/api/signUp`, {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify({
					email: email,
					password: password,
					name: name,
					isTeacher: isTeacher,
				}),
			});
			const data = await response.json();
			if (data.status) {
				await createSessionAuth();
			} else {
				setLoading(false);
				toast.error(data.error);
			}
		} else {
			toast.error('Missing Fields, Verify and Retry');
		}
	};
	const loadData = async () => {
		setLoading(true);
		const request = await fetch(`/solar-lab/api/users/read`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({ email: session.user.email }),
		});
		const response = await request.json();
		if (!response.status) {
			setLoading(false);
			toast.error('Something Went Wrong, Please Try Again');
		} else {
			setEmailDisable(true);
			setEmail(response.user.email);
			setName(response.user.name);
			setLoading(false);
		}
	};

	const handleUpdate = async () => {
		setLoading(true);
		const updateUser = {
			email: email,
			name: name,
		};
		try {
			const response = await fetch(`/solar-lab/api/users/update`, {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify(updateUser),
			});
			const user = await response.json();
			if (user.email) {
				setName(user.name);
				toast.success('Updated Successfully');
				setLoading(false);
				handleClose();
			} else {
				setLoading(false);
				toast.error('Update Failed, Please Try Again Later');
			}
		} catch (error) {
			setLoading(false);
			toast.error('Update Failed, Please Try Again Later');
		}
	};
	const createSessionAuth = async () => {
		signIn('credentials', { email: email, password: password, redirect: false })
			.then((response) => {
				setLoading(false);
				if (response.ok) {
					toast.success('Account Created!');
					clearFields();
					handleClose();
				}
			})
			.catch((error) => {
				toast.info('Account Created, You Can Now LogIn');
			});
	};
	const validateFields = () => {
		return (
			!emailError &&
			!nameError &&
			!passwordError &&
			!confirmPasswordError &&
			email &&
			name &&
			password
		);
	};

	const clearFields = () => {
		setName('');
		setEmail('');
		setPassword('');
		setConfirmPassword('');
		setNameMessage('');
		setEmailMessage('');
		setPasswordMessage('');
		setConfirmPasswordMessage('');
		setNameError(false);
		setEmailError(false);
		setPasswordError(false);
		setConfirmPasswordError(false);
	};

	const handleChange = (event) => {
		setIsTeacher(event.target.checked);
	};

	const handleEmailChange = (event) => {
		setEmail(event.target.value);
		const regexp =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!regexp.test(event.target.value)) {
			setEmailMessage('Enter a valid Email');
			setEmailError(true);
		} else {
			setEmailMessage('');
			setEmailError(false);
		}
	};

	const handleNameChange = (event) => {
		setName(event.target.value);
		if (event.target.value.length < 6) {
			setNameMessage('Full Name should contain at least 6 characters');
			setNameError(true);
		} else {
			setNameMessage('');
			setNameError(false);
		}
	};

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

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			PaperProps={{
				sx: {
					borderRadius: '24px',
					maxWidth: '660px',
				},
			}}
		>
			<Box
				m={{ xxs: 3, xs: 4, sm: 5 }}
				sx={{
					alignItems: 'center',
				}}
			>
				<Grid container justifyContent='center'>
					<Grid item>
						<Typography variant='header1' color='secondary'>
							Solar{' '}
						</Typography>
						<Typography variant='header1' color='primary.700'>
							Remote Lab
						</Typography>
					</Grid>
				</Grid>
				<Box component='form'>
					<Grid
						container
						rowSpacing={{ xxs: 1, xs: 1, sm: 2 }}
						columnSpacing={2}
					>
						<Grid item xxs={12} xs={12}>
							<Typography variant='header3'>Email</Typography>{' '}
						</Grid>

						<Grid item xxs={12} xs={12}>
							<TextField
								error={emailError}
								required
								fullWidth
								size='small'
								variant='outlined'
								autoComplete='email'
								value={email}
								disabled={emailDisable}
								onChange={handleEmailChange}
								helperText={emailMessage}
							/>
						</Grid>
						<Grid item xxs={12} xs={12}>
							<Typography variant='header3' mb={2}>
								Full Name
							</Typography>
						</Grid>
						<Grid item xxs={12} xs={12}>
							<TextField
								error={nameError}
								required
								fullWidth
								size='small'
								variant='outlined'
								autoComplete='name'
								value={name}
								onChange={handleNameChange}
								helperText={nameMessage}
							/>
						</Grid>
					</Grid>
					{!session ? (
						<Box>
							<Grid item xxs={12} xs={12} my={{ xxs: 1, xs: 1, sm: 2 }}>
								<Typography variant='header3'>Password</Typography>
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
							<Grid item xxs={12} xs={12} my={{ xxs: 1, xs: 1, sm: 2 }}>
								<Typography variant='header3'>Confirm Password</Typography>
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
							<Grid item xxs={12} xs={12}>
								<FormControlLabel
									sx={{ mt: 2 }}
									control={
										<Checkbox
											checked={isTeacher}
											onChange={handleChange}
											color='primary'
										/>
									}
									label={
										<Typography variant='header3'>I am a Teacher</Typography>
									}
								/>
							</Grid>
							<Grid
								item
								xxs={12}
								xs={12}
								mb={{ xxs: 2, xs: 2, sm: 3 }}
								mt={{ xxs: 2, xs: 3, sm: 3 }}
							>
								<LoadingButton
									loading={loading}
									fullWidth
									variant='contained'
									sx={{
										color: 'white',
										textTransform: 'none',
										padding: '1px',
										bgcolor: 'primary.700',
									}}
									onClick={handleAuth}
								>
									<Typography variant='buttons4'>Sign Up</Typography>
								</LoadingButton>
							</Grid>
							<Grid
								item
								xxs={12}
								xs={12}
								container
								justifyContent='center'
								sx={{
									mb: { xxs: 1, xs: 1, sm: 2 },
								}}
							>
								<Grid item>
									<Typography variant='header3'>
										Already Have an Account?{' '}
									</Typography>
									<Link
										component='button'
										onClick={onClickSignIn}
										variant='header3'
										mb={{ xxs: 1, xs: 1, sm: 1 }}
									>
										Sign In
									</Link>
								</Grid>
							</Grid>
							<Divider
								sx={{
									'&::before, &::after': {
										borderColor: 'blacky.main',
									},
								}}
							>
								<Typography variant='body1'>or</Typography>
							</Divider>
							<Grid container>
								<Grid
									item
									xxs={12}
									xs={12}
									mt={{ xxs: 2, xs: 2, sm: 3 }}
									mb={{ xxs: 1, xs: 1, sm: 3 }}
								>
									<GoogleButton></GoogleButton>
								</Grid>
							</Grid>{' '}
						</Box>
					) : (
						<Grid
							item
							xxs={12}
							xs={12}
							mb={{ xxs: 2, xs: 2, sm: 3 }}
							mt={{ xxs: 2, xs: 3, s: 4, sm: 5 }}
						>
							<LoadingButton
								loading={loading}
								fullWidth
								variant='contained'
								sx={{
									color: 'white',
									textTransform: 'none',
									padding: '1px',
									bgcolor: 'primary.700',
								}}
								onClick={handleUpdate}
							>
								<Typography variant='buttons4'>Update</Typography>
							</LoadingButton>
						</Grid>
					)}
				</Box>
			</Box>
		</Dialog>
	);
}
