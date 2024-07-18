/*Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Andres Gamboa, Alex Villazon*/

import CitiesTypography from '../../components/CitiesTypography';
import DepartamentExperiment from '../../components/DepartamentExperiment';
import {
	Box,
	Typography,
	Grid,
	FormGroup,
	FormControlLabel,
	Checkbox,
	FormControl,
	Select,
	MenuItem,
	ListItemText,
	Stack,
	Button,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import SaveExperimentDialog from '../../components/SaveExperimentDialog';
import SessionTimer from '../../components/SessionTimer';
import { useRouter } from 'next/router';
import SignInDialog from '../../components/SignInDialog';
import SignUpDialog from '../../components/SignUpDialog';
import { useSession } from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import VerifyEmailDialog from '@/components/VerifyEmailDialog';
import Router from 'next/router';

const checkBoxStyle = {
	color: 'primary.700',
	'& .MuiSvgIcon-root': {
		fontSize: { xxs: '24px', xs: '30px', sm: '32px' },
	},
};
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

export default function Laboratory() {
	const router = useRouter();
	const { data: session, status } = useSession();
	const [openSignIn, setOpenSignIn] = useState(false);
	const [openSignup, setOpenSignUp] = useState(false);
	const [openSaveExperiment, setOpenSaveExperiment] = useState(false);
	const [canAccess, setCanAccess] = useState(false);
	const [syncPanels, setSyncPanels] = useState(true);
	const [selectedAngle, setSelectedAngle] = useState(0);
	const [SCZData, setSCZData] = useState({});
	const [LPZData, setLPZData] = useState({});
	const [CBBAData, setCBBAData] = useState({});
	const [notSaved, setNotSaved] = useState(false);

	const [selectedCities, setSelectedCities] = React.useState(['Cochabamba']);
	const cities = ['Cochabamba', 'La Paz', 'Santa Cruz'];

	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const confirmationMessage =
			'There are changes you made may not be saved. Are you sure to leave?';
		const beforeUnloadHandler = (e) => {
			(e || window.event).returnValue = confirmationMessage;
			return confirmationMessage; // Gecko + Webkit, Safari, Chrome etc.
		};
		const beforeRouteHandler = (url) => {
			if (Router.pathname !== url && !confirm(confirmationMessage)) {
				// to inform NProgress or something ...
				Router.events.emit('routeChangeError');
				// tslint:disable-next-line: no-string-throw
				throw `Route change to "${url}" was aborted (this error can be safely ignored). See https://github.com/zeit/next.js/issues/2476.`;
			}
		};
		if (notSaved) {
			window.addEventListener('beforeunload', beforeUnloadHandler);
			Router.events.on('routeChangeStart', beforeRouteHandler);
		} else {
			window.removeEventListener('beforeunload', beforeUnloadHandler);
			Router.events.off('routeChangeStart', beforeRouteHandler);
		}
		return () => {
			window.removeEventListener('beforeunload', beforeUnloadHandler);
			Router.events.off('routeChangeStart', beforeRouteHandler);
		};
	}, [notSaved]);

	useEffect(() => {
		handleResize();
		window.addEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		checkAccess();
		connectMQTT();
	}, []);

	const connectMQTT = async () => {
		await fetch(`/solar-lab/api/mqtt/connect`);
	};

	const checkAccess = () => {
		if (!window.localStorage.getItem('SESSION_DATA')) {
			toast.error('You Dont Have a Session');
			router.push('/');
		} else {
			setCanAccess(true);
		}
	};

	const handleResize = () => {
		if (window.innerWidth < 960) {
			setIsMobile(true);
		} else {
			setIsMobile(false);
		}
	};

	const handleOpenSignUpFromSignIn = () => {
		setOpenSignIn(false);
		setOpenSignUp(true);
	};

	const handleOpenSignInFromSignUp = () => {
		setOpenSignUp(false);
		setOpenSignIn(true);
	};

	const handleOpenSaveExperiment = async () => {
		if (session) {
			if (await isStudentAndVerified()) {
				if (selectedCities.length > 0) {
					setOpenSaveExperiment(true);
				} else {
					toast.error('First you Have to Select a City to Save');
				}
			}
		} else {
			setOpenSignIn(true);
		}
	};

	const handleChangeCheckbox = (event) => {
		if (event.target.checked) {
			setSelectedCities((selectedCities) => [
				...selectedCities,
				event.target.name,
			]);
		} else {
			setSelectedCities(
				selectedCities.filter((element) => event.target.name !== element)
			);
		}
	};

	const handleChangeSelect = (event) => {
		const { value } = event.target;
		setSelectedCities(value);
	};

	const [openVerifyEmail, setOpenVerifyEmail] = useState(false);

	const handleCloseVerifyEmail = (event, reason) => {
		if (reason && reason == 'backdropClick') {
			toast.error('Not Verified yet');
		} else {
			setOpenVerifyEmail(false);
		}
	};

	const isStudentAndVerified = async () => {
		const response = await fetch(`/solar-lab/api/users/read`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({ email: session.user.email }),
		});
		const answer = await response.json();

		if (!answer.status) {
			toast.error('Something Went Wrong, Please Try Again');
		} else {
			if (answer.user.student) {
				if (answer.user.isVerified) {
					return true;
				} else {
					setOpenVerifyEmail(true);
					return false;
				}
			} else {
				toast.info('Teachers cannot save Experiments');
				return false;
			}
		}
	};

	return (
		<main>
			<div>
				<Head>
					<title>UPB Solar Remote Lab</title>
					<meta
						name='description'
						content='Remote Laboratory for Solar Energy'
					/>
					<link rel='icon' href='/solar-lab/logoYellow.png' />
				</Head>
			</div>
			{canAccess ? (
				<Box
					sx={{ minHeight: '80vh' }}
					mt={{ xxs: 10, xs: 10, s: 10, sm: 12 }}
					px={{ xxs: 2, xs: 2, s: 4, sm: 6 }}
				>
					<Grid container>
						<Grid
							item
							sx={{
								display: 'flex',
								alignItems: 'center',
							}}
							xxs={12}
							xs={12}
							sm={5}
							md={3}
							mb={{ xxs: 2, xs: 2, s: 2, sm: 0, md: 0 }}
							justifyContent='flex-end'
							order={{ xxs: 1, xs: 1, s: 1, sm: 2 }}
						>
							<SessionTimer></SessionTimer>
						</Grid>
						<Grid
							item
							sx={{
								display: 'flex',
								alignItems: 'center',
							}}
							xxs={12}
							xs={12}
							sm={7}
							md={9}
							order={{ xxs: 2, xs: 2, s: 2, sm: 1 }}
						>
							<CitiesTypography></CitiesTypography>
							{!isMobile ? (
								<Box ml={{ xxs: 2, xs: 2, s: 2, sm: 2 }}>
									<FormGroup row>
										{cities.map((city) => (
											<FormControlLabel
												key={city}
												control={
													<Checkbox
														sx={checkBoxStyle}
														checked={selectedCities.includes(city)}
													/>
												}
												name={city}
												onChange={handleChangeCheckbox}
												label={
													<Typography variant='buttons1'>{city}</Typography>
												}
											/>
										))}
									</FormGroup>
								</Box>
							) : (
								<Box
									mx={{ xxs: 2, xs: 2, s: 2, sm: 2 }}
									mr={{ xxs: 0, xs: 0, s: 0, sm: 2 }}
									sx={{
										width: '100%',
									}}
								>
									<FormControl
										size='small'
										sx={{
											width: '100%',
										}}
									>
										<Select
											multiple
											displayEmpty
											value={selectedCities}
											onChange={handleChangeSelect}
											MenuProps={MenuProps}
											inputProps={{ 'aria-label': 'Without label' }}
											renderValue={(selected) => {
												if (selected.length === 0) {
													return (
														<Typography variant='body3'>
															Select the Cities to Display
														</Typography>
													);
												}

												return selected.join(', ');
											}}
										>
											{cities.map((city) => (
												<MenuItem key={city} value={city}>
													<Checkbox
														sx={checkBoxStyle}
														checked={selectedCities.includes(city)}
													/>
													<ListItemText primary={city} />
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Box>
							)}
						</Grid>
					</Grid>
					{selectedCities.map((city) => (
						<DepartamentExperiment
							key={city}
							name={city}
							setCBBAData={setCBBAData}
							setLPZData={setLPZData}
							setSCZData={setSCZData}
							syncPanels={syncPanels}
							setSyncPanels={setSyncPanels}
							selectedAngle={selectedAngle}
							setSelectedAngle={setSelectedAngle}
							setNotSaved={setNotSaved}
							notSaved={notSaved}
						></DepartamentExperiment>
					))}
					<Box>
						<Stack
							direction='row'
							justifyContent='end'
							mt={{ xxs: 2, xs: 3, s: 3, sm: 4 }}
							mb={1}
							sx={{
								display: 'none',

								'@media (min-width:418px)': {
									display: 'flex',
								},
							}}
						>
							<Button
								variant='contained'
								sx={{
									textTransform: 'none',
									bgcolor: 'primary.700',
									mr: { xxs: 1, xs: 1, s: 2, sm: 3 },
								}}
								onClick={handleOpenSaveExperiment}
							>
								<Typography
									color='white.main'
									variant='buttonsPages'
									sx={{
										mx: { xxs: 0, xs: 0, s: 1, sm: 1 },
									}}
								>
									Save Current Experiment
								</Typography>
							</Button>
							<Button
								variant='outlined'
								sx={{
									textTransform: 'none',
									border: 1,
									textTransform: 'none',
									borderColor: 'primary.700',
								}}
								onClick={() => router.push('/experiments')}
							>
								<Typography
									color='primary.700'
									variant='buttonsPages'
									sx={{
										mx: { xxs: 0, xs: 0, s: 1, sm: 1 },
										'&:hover': {
											color: '#fff',
										},
									}}
								>
									Load Previous Experiments
								</Typography>
							</Button>
						</Stack>
						<Stack
							direction='row'
							justifyContent='end'
							mt={{ xxs: 2, xs: 3, s: 3, sm: 4 }}
							mb={1}
							sx={{
								display: 'flex',

								'@media (min-width:418px)': {
									display: 'none',
								},
							}}
						>
							<Button
								variant='contained'
								sx={{
									textTransform: 'none',
									bgcolor: 'primary.700',
									mr: { xxs: 1, xs: 1, s: 2, sm: 3 },
								}}
								onClick={handleOpenSaveExperiment}
							>
								<Typography
									color='white.main'
									variant='buttonsExperiments'
									sx={{
										mx: { xxs: 0, xs: 0, s: 1, sm: 1 },
									}}
								>
									Save Experiment
								</Typography>
							</Button>
							<Button
								variant='contained'
								color='white'
								sx={{
									textTransform: 'none',
									border: 1,
									borderColor: 'primary.700',
								}}
								onClick={() => router.push('/experiments')}
							>
								<Typography
									color='primary.700'
									variant='buttonsExperiments'
									sx={{
										mx: { xxs: 0, xs: 0, s: 1, sm: 1 },
										'&:hover': {
											color: '#fff',
										},
									}}
								>
									My Experiments
								</Typography>
							</Button>
							{openSaveExperiment ? (
								<SaveExperimentDialog
									open={openSaveExperiment}
									handleClose={() => setOpenSaveExperiment(false)}
									departmentData={[CBBAData, LPZData, SCZData]}
									selectedCities={selectedCities}
									setNotSaved={setNotSaved}
									setSCZData={setSCZData}
									setCBBAData={setCBBAData}
									setLPZData={setLPZData}
								/>
							) : null}
						</Stack>
					</Box>
					<Box>
						<SignUpDialog
							open={openSignup}
							handleClose={() => setOpenSignUp(false)}
							onClickSignIn={handleOpenSignInFromSignUp}
						/>
						<SignInDialog
							open={openSignIn}
							handleClose={() => setOpenSignIn(false)}
							onClickSignup={handleOpenSignUpFromSignIn}
						/>
						<VerifyEmailDialog
							open={openVerifyEmail}
							handleClose={handleCloseVerifyEmail}
						/>
					</Box>
				</Box>
			) : null}
		</main>
	);
}
