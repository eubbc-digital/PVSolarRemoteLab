/*Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Andres Gamboa, Alex Villazon*/

import {
	Typography,
	Box,
	Grid,
	Button,
	Card,
	Slider,
	FormControlLabel,
	Checkbox,
	IconButton,
	Popover,
	TextField,
	Tabs,
	Tab,
} from '@mui/material';
import LineChart from './LineChart';
import Clock from './Clock';
import RadiationChart from './RadiationChart';
import React, { useState, useEffect, useRef } from 'react';
import CameraPlayer from '../components/CameraPlayer';
import HelpIcon from '@mui/icons-material/Help';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import ShowSpecs from './ShowSpecs';
import { io } from 'socket.io-client';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import { CSVLink } from 'react-csv';
import InputAdornment from '@mui/material/InputAdornment';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import LoadingButton from '@mui/lab/LoadingButton';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import RadiationData from './RadiationData';

function TabPanel(props) {
	const { children, value, index } = props;

	return (
		<div role='tabpanel' hidden={value !== index}>
			{value === index && (
				<Box pt={0}>
					<Typography component={'span'}>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

const gridStyle = {
	alignItems: 'center',
	display: 'flex',
	verticalAlign: 'middle',
	lineHeight: 'normal',
};

const tabStyle = {
	textTransform: 'none',
	fontWeight: 700,
	color: 'black',
};

export default function DepartamentExperiment({
	name,
	setCBBAData,
	setLPZData,
	setSCZData,
	syncPanels,
	setSyncPanels,
	selectedAngle,
	setSelectedAngle,
	setNotSaved,
	notSaved,
}) {
	let previousRadiation;
	let previousUvaRadiation;
	let previousAngle;
	let previousTemperature;
	let counterError;
	const [value, setValue] = React.useState(0);
	const activities = useRef([
		{ data: [], maxPower: 0, efficiency: 0 },
		{ data: [[]], angles: [] },
	]);
	const panelArea = 0.6671; // 0.6671 m2 = 1224 mm x 545 mm
	const [angle, setAngle] = useState(0);
	const [uvaRadiation, setUvaRadiation] = useState(0);
	const [radiation, setRadiation] = useState(0);
	const [temperature, setTemperature] = useState(0);
	const [departmentSelectedAngle, setDepartmentSelectedAngle] = useState(0);
	const [isPrivate, setIsPrivate] = useState(false);
	const [anchorElRadiation, setAnchorElRadiation] = React.useState(null);
	const [anchorElUVA, setAnchorElUVA] = React.useState(null);
	const [anchorElSpecs, setAnchorElSpecs] = React.useState(null);
	const [typeUVAradiation, setTypeUVAradiation] = useState('');
	const [typeRadiation, setTypeRadiation] = useState('');

	const [maxPower, setMaxPower] = useState(0);
	const [maxPowerValidate, setMaxPowerValidate] = useState(false);
	const [maxPowerShowValidate, setMaxPowerShowValidate] = useState(false);

	const [efficiency, setEfficiency] = useState(0);
	const [efficiencyValidate, setEfficiencyValidate] = useState(false);
	const [efficiencyShowValidate, setEfficiencyShowValidate] = useState(false);

	const [experimentLoading, setExperimentLoading] = React.useState(false);
	const [motorLoading, setMotorLoading] = React.useState(false);
	const [dataLoading, setDataLoading] = React.useState(true);
	const [env, setEnv] = useState(null);

	const handleChangeTabs = (event, newValue) => {
		setValue(newValue);
		activities.tabIndex = newValue;
	};
	const getEnvVariables = async () => {
		const request = await fetch(`/solar-lab/api/env`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'GET',
		});

		const response = await request.json();
		if (response.status) {
			setEnv(response.variables);
		}
	};

	useEffect(() => {
		getEnvVariables();
		clearFields();
		if (name == 'Cochabamba') {
			setTypeRadiation('solarRadiationCMPAvg');
			setTypeUVAradiation('uvaRadiationLPAvg');
		} else {
			setTypeRadiation('solarRadiationCS320Avg');
			setTypeUVAradiation('uvaRadiationSU202Avg');
		}
		if (JSON.parse(window.localStorage.getItem('SESSION_DATA'))) {
			setIsPrivate(
				JSON.parse(window.localStorage.getItem('SESSION_DATA')).isPrivate
			);
		}
	}, []);

	useEffect(() => {
		if (!notSaved) {
			clearFields();
		}
	}, [notSaved]);

	useEffect(() => {
		const timerData = setTimeout(() => {
			if (dataLoading) {
				toast.warn(`Can't connect with ${name}, Trying to reconnect...`);
			}
		}, 8000);

		return () => clearTimeout(timerData);
	}, [dataLoading]);

	useEffect(() => {
		if (env) {
			const socket = io(env.NEXT_PUBLIC_WS_DATA, {
				path: env.NEXT_PUBLIC_WS_DATA_PATH,
			});

			socket.on('esp32', (...msg) => {
				dataHandler(msg);
			});
			return () => {
				socket.disconnect();
				updateCityData(name, 0, 0, 0, 0, 0, []);
			};
		}
	}, [env]);

	const clearFields = () => {
		clearActivity1();
		clearActivity2();
		setValue(0);
		activities.tabIndex = 0;
	};
	const clearActivity1 = () => {
		activities.current[0] = { data: [], maxPower: 0, efficiency: 0 };
		setMaxPower(0);
		setMaxPowerShowValidate(false);
		setEfficiency(0);
		setEfficiencyShowValidate(false);
	};
	const clearActivity2 = () => {
		activities.current[1] = {
			data: [],
			angles: [],
		};
	};

	const dataHandler = (msg) => {
		try {
			const receivedData = JSON.parse(msg);

			if (receivedData.departmentName == name) {
				setDataLoading(false);
				if (receivedData.isTesting) {
					activities.loading = false;
					setExperimentLoading(false);
					setNotSaved(true);
					const datetime = new Date();
					let efficiencyTestFilled = receivedData.efficiencyTest.map((v) => ({
						...v,
						radiation: previousRadiation,
						uvaRadiation: previousUvaRadiation,
						temperature: previousTemperature,
						degree: previousAngle,
						datetime: datetime,
						timestamp: v.timestamp.toString(),
					}));
					if (activities.tabIndex == 0) {
						clearActivity1();
						activities.current[0].data = efficiencyTestFilled;
						activities.current[0].radiation = previousRadiation;
						activities.current[0].uvaRadiation = previousUvaRadiation;
						activities.current[0].temperature = previousTemperature;
						activities.current[0].panelAngle = previousAngle;
						activities.current[0].maxPower = Math.max(
							...efficiencyTestFilled.map((o) => o.power)
						);
						activities.current[0].efficiency =
							(activities.current[0].maxPower /
								(previousRadiation *
									Math.cos(previousAngle * (Math.PI / 180.0)) *
									panelArea)) *
							100;
					} else if (activities.tabIndex == 1) {
						activities.current[1].data.push(efficiencyTestFilled);
						activities.current[1].angles.push(previousAngle);
						activities.current[1].radiation = previousRadiation;
						activities.current[1].temperature = previousTemperature;
						activities.current[1].uvaRadiation = previousUvaRadiation;
					}
					updateCityData(name);
				} else {
					if (receivedData.isMoving) {
						setMotorLoading(true);
					} else {
						setMotorLoading(false);
					}
					if (motorLoading && previousAngle == receivedData.panelangle) {
						counterError += 1;
						if (counterError > 40) {
							toast.error('Error Moving Panel, Try Again');
							setMotorLoading(false);
						}
					} else {
						counterError = 0;
					}
					previousAngle = receivedData.panelangle;
					previousRadiation = Number(receivedData.radiation).toFixed(2) * 1;
					previousTemperature = Number(receivedData.temperature).toFixed(2) * 1;
					previousUvaRadiation =
						Number(receivedData.uvaRadiation).toFixed(2) * 1;
					setAngle(previousAngle);
					setRadiation(previousRadiation);
					setUvaRadiation(previousUvaRadiation);
					setTemperature(previousTemperature);
				}
			}
		} catch (e) {}
	};

	const updateCityData = (name) => {
		let data = (prevState) => ({
			...prevState,
			departmentName: name,
			activities: [
				{
					activityNumber: 1,
					panelAngle: activities.current[0].panelAngle,
					temperature: activities.current[0].temperature,
					power: 0,
					uvaRadiation:
						Number(activities.current[0].uvaRadiation).toFixed(2) * 1,
					radiation: Number(activities.current[0].radiation).toFixed(2) * 1,
					efficiencyCurve: [activities.current[0].data],
					efficiencyPorcentaje: 0,
				},
				{
					activityNumber: 2,
					temperature: activities.current[1].temperature,
					optimalAngle: 0,
					uvaRadiation:
						Number(activities.current[1].uvaRadiation).toFixed(2) * 1,
					radiation: Number(activities.current[1].radiation).toFixed(2) * 1,
					efficiencyCurve: activities.current[1].data,
				},
			],
		});
		if (name == 'Cochabamba') {
			setCBBAData(data);
		} else if (name == 'La Paz') {
			setLPZData(data);
		} else {
			setSCZData(data);
		}
	};

	const sendMqttMessage = async (action) => {
		var department = name;
		if (action == 'START' && radiation < 150) {
			activities.loading = false;
			setExperimentLoading(false);
			toast.info('Radiation is to low...');
		} else {
			if (action == 'ANGLE') {
				if (syncPanels) {
					department = 'ALL';
				} else {
					selectedAngle = departmentSelectedAngle;
				}
				activities.sentAngle = selectedAngle;
			}
			const message = {
				action: action,
				angle: selectedAngle,
				department: department,
			};
			const response = await fetch(`/solar-lab/api/mqtt/send`, {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify(message),
			});
			const data = await response.json();
		}
	};

	const waitingExperiment = () => {
		setExperimentLoading(true);
		activities.loading = true;
		const timer = setTimeout(() => {
			if (activities.loading) {
				setExperimentLoading(false);
				activities.loading = false;
				toast.warn('Low Connection, Try Again...');
			}
		}, 18000);
	};

	const handleChange = (event) => {
		setSyncPanels(event.target.checked);
	};

	const motorMoving = () => {
		return dataLoading || motorLoading;
	};

	const handleClickUVARadiation = (event) => {
		setAnchorElUVA(event.currentTarget);
	};

	const handleCloseUVARadiation = () => {
		setAnchorElUVA(null);
	};

	const handleOpenCamera = () => {
		if (name == 'Cochabamba') {
			window.open(
				env.NEXT_PUBLIC_LINKCAMERACBBA,
				'newwindow',
				'width=500, height=600, top=100'
			);
		} else if (name == 'La Paz') {
			window.open(
				env.NEXT_PUBLIC_LINKCAMERALPZ,
				'newwindow',
				'width=500, height=600, top=100'
			);
		} else {
			window.open(
				env.NEXT_PUBLIC_LINKCAMERASCZ,
				'newwindow',
				'width=500, height=600, top=100'
			);
		}
	};

	const openUVA = Boolean(anchorElUVA);

	const handleClickRadiation = (event) => {
		setAnchorElRadiation(event.currentTarget);
	};

	const handleCloseRadiation = () => {
		setAnchorElRadiation(null);
	};

	const open = Boolean(anchorElRadiation);

	const handleOpenSpecs = (event) => {
		setAnchorElSpecs(event.currentTarget);
	};

	const handleCloseSpecs = () => {
		setAnchorElSpecs(null);
	};

	const openSpecs = Boolean(anchorElSpecs);
	const camelCase = (str) => {
		return str.substring(0, 1).toUpperCase() + str.substring(1);
	};

	const getColumns = () => {
		// Get column names
		const columns = [
			'timestamp',
			'datetime',
			'city',
			'voltage',
			'current',
			'power',
			'radiation',
			'uvaRadiation',
			'degree',
			'temperature',
		];
		let headers = [];
		columns.forEach((col, idx) => {
			headers.push({ label: camelCase(col), key: col });
		});

		return headers;
	};

	const handleMaxPowerChange = (event) => {
		setNotSaved(true);
		setMaxPower(event.target.value);
		if (activities.current[0].data.length > 0) {
			if (name == 'Cochabamba') {
				setCBBAData((prevState) => ({
					...prevState,
					activities: prevState.activities.map((activity) =>
						activity.activityNumber === 1
							? {
									...activity,
									power: Number(event.target.value).toFixed(2) * 1,
							  }
							: activity
					),
				}));
			} else if (name == 'La Paz') {
				setLPZData((prevState) => ({
					...prevState,
					activities: prevState.activities.map((activity) =>
						activity.activityNumber === 1
							? {
									...activity,
									power: Number(event.target.value).toFixed(2) * 1,
							  }
							: activity
					),
				}));
			} else {
				setSCZData((prevState) => ({
					...prevState,
					activities: prevState.activities.map((activity) =>
						activity.activityNumber === 1
							? {
									...activity,
									power: Number(event.target.value).toFixed(2) * 1,
							  }
							: activity
					),
				}));
			}
			if (!activities.current[0].maxPower) {
				setMaxPowerShowValidate(false);
			} else if (
				Math.abs(event.target.value - activities.current[0].maxPower) < 1
			) {
				setMaxPowerShowValidate(true);
				setMaxPowerValidate(true);
			} else {
				setMaxPowerShowValidate(true);
				setMaxPowerValidate(false);
			}
		}
	};

	const handleEfficiencyChange = (event) => {
		setNotSaved(true);
		setEfficiency(event.target.value);
		if (activities.current[0].data.length > 0) {
			if (name == 'Cochabamba') {
				setCBBAData((prevState) => ({
					...prevState,
					activities: prevState.activities.map((activity) =>
						activity.activityNumber === 1
							? {
									...activity,
									efficiencyPorcentaje:
										Number(event.target.value).toFixed(2) * 1,
							  }
							: activity
					),
				}));
			} else if (name == 'La Paz') {
				setLPZData((prevState) => ({
					...prevState,
					activities: prevState.activities.map((activity) =>
						activity.activityNumber === 1
							? {
									...activity,
									efficiencyPorcentaje:
										Number(event.target.value).toFixed(2) * 1,
							  }
							: activity
					),
				}));
			} else {
				setSCZData((prevState) => ({
					...prevState,
					activities: prevState.activities.map((activity) =>
						activity.activityNumber === 1
							? {
									...activity,
									efficiencyPorcentaje:
										Number(event.target.value).toFixed(2) * 1,
							  }
							: activity
					),
				}));
			}
			if (!activities.current[0].efficiency) {
				setEfficiencyShowValidate(false);
			} else if (
				Math.abs(event.target.value - activities.current[0].efficiency) < 0.5
			) {
				setEfficiencyShowValidate(true);
				setEfficiencyValidate(true);
			} else {
				setEfficiencyShowValidate(true);
				setEfficiencyValidate(false);
			}
		}
	};

	return (
		<Box my={{ xxs: 2, xs: 2, s: 2, sm: 3 }}>
			<Card
				elevation={5}
				sx={{
					height: '100%',
					width: 'auto',
				}}
			>
				<Box
					my={{ xxs: 3, xs: 4, s: 4, sm: 5 }}
					mx={{ xxs: 3, xs: 3, s: 4, sm: 5 }}
				>
					<Grid container>
						<Grid item xxs={12} sm={12} md={6} mb={1} sx={gridStyle}>
							<Typography variant='header1' color='blacky.main' mr={1}>
								{name}
							</Typography>
							<IconButton
								onClick={handleOpenSpecs}
								sx={{
									py: 0,
									color: 'info.main',
								}}
							>
								<InfoIcon
									sx={{
										fontSize: { xxs: '16px', xs: '20px', sm: '30px' },
									}}
								/>
							</IconButton>
							<Popover
								open={openSpecs}
								anchorEl={anchorElSpecs}
								anchorOrigin={{
									vertical: 'center',
									horizontal: 'right',
								}}
								transformOrigin={{
									vertical: 'center',
									horizontal: 'left',
								}}
								onClose={handleCloseSpecs}
								disableRestoreFocus
							>
								<ShowSpecs city={name}></ShowSpecs>
							</Popover>
						</Grid>
						<Grid
							item
							xxs={12}
							sm={12}
							md={6}
							mb={{ xxs: 1, xs: 2, s: 2, sm: 2, md: 0 }}
							sx={gridStyle}
							justifyContent={{ sm: 'left', md: 'flex-end' }}
						>
							<Clock></Clock>
						</Grid>

						<Grid
							item
							container
							direction='column'
							xs={12}
							sm={12}
							md={4}
							lg={3}
							mb={{ xxs: 1, xs: 2, s: 2, sm: 2, md: 0 }}
							columnSpacing={2}
						>
							<Grid
								item
								sx={{ display: 'flex' }}
								justifyContent='center'
								mb={1}
								mt={{ xxs: 0, xs: 0, s: 0, sm: 0, md: 2, md: 2 }}
							>
								<Box
									sx={{
										width: '240px',
										height: '264px',
										backgroundColor: 'black',
									}}
								>
									<CameraPlayer name={name}></CameraPlayer>
								</Box>
							</Grid>

							<Grid
								item
								textAlign='center'
								mb={{ xxs: 0, xs: 0, s: 0, sm: 1, md: 1 }}
							>
								<Typography
									variant='titleDepartment'
									color='primary.700'
									sx={{
										verticalAlign: 'middle',
									}}
								>
									Actual Angle:
								</Typography>
								<Typography
									ml={1}
									variant='titleDepartment'
									color='black'
									sx={{
										verticalAlign: 'middle',
									}}
								>
									{angle}°
								</Typography>
								<IconButton
									sx={{
										py: 0,
										color: 'secondary.main',
									}}
									onClick={handleOpenCamera}
								>
									<ZoomInIcon
										sx={{
											fontSize: { xxs: '16px', xs: '20px', sm: '30px' },
										}}
									/>
								</IconButton>
							</Grid>

							{isPrivate ? (
								<Box>
									<Grid
										item
										sx={{ display: 'flex' }}
										mb={1}
										justifyContent='center'
									>
										<Typography
											variant='titleDepartment'
											color='primary.700'
											mr={3}
											sx={gridStyle}
										>
											Move to:
										</Typography>
										<Box
											width='50%'
											sx={{
												verticalAlign: 'middle',
												lineHeight: 'normal',
											}}
										>
											{syncPanels ? (
												<Slider
													size='medium'
													value={selectedAngle}
													valueLabelDisplay='auto'
													onChange={(_, value) => {
														setSelectedAngle(value);
													}}
													max={90}
												/>
											) : (
												<Slider
													size='medium'
													value={departmentSelectedAngle}
													valueLabelDisplay='auto'
													onChange={(_, value) => {
														setDepartmentSelectedAngle(value);
													}}
													max={90}
												/>
											)}
										</Box>
									</Grid>
									<Grid
										item
										sx={{ display: 'flex' }}
										justifyContent='center'
										mb={1}
									>
										<FormControlLabel
											control={
												<Checkbox
													checked={syncPanels}
													onChange={handleChange}
													color='secondary'
													sx={{
														'& .MuiSvgIcon-root': {
															fontSize: { xxs: '24px', xs: '24px', sm: '24px' },
														},
														py: 0,
													}}
												/>
											}
											label={
												<Typography variant='titleDepartment'>
													Sync all Panels
												</Typography>
											}
										/>
									</Grid>
									<Grid item textAlign='center'>
										<LoadingButton
											loading={motorMoving()}
											variant='contained'
											sx={{
												textTransform: 'none',
												bgcolor: 'primary.700',
											}}
											onClick={() => {
												setMotorLoading(true);
												sendMqttMessage('ANGLE');
											}}
										>
											<Typography
												variant='titleDepartment'
												color='white'
												sx={{
													mx: 2,
												}}
											>
												Move
											</Typography>
										</LoadingButton>
									</Grid>
								</Box>
							) : null}
						</Grid>
						<Grid
							item
							container
							direction='column'
							xs={12}
							sm={12}
							md={8}
							lg={9}
						>
							<Box
								sx={{
									borderBottom: 1,
									borderColor: 'divider',
									maxWidth: '100%',
								}}
								mb={{ xxs: 1, xs: 1, s: 1, sm: 1, md: 1, lg: 2 }}
							>
								<Tabs
									variant='scrollable'
									scrollButtons='auto'
									allowScrollButtonsMobile
									value={value}
									onChange={handleChangeTabs}
									textColor='secondary'
									indicatorColor='secondary'
								>
									<Tab label='Activities' sx={tabStyle} />
									<Tab label='Data Collection' sx={tabStyle} />
								</Tabs>
							</Box>
							<TabPanel value={value} index={0} sx={{ width: '100%' }}>
								<Grid
									container
									columnSpacing={1}
									rowSpacing={1}
									sx={{ width: '100%' }}
								>
									<Grid item xxs={12} md={12} lg={8} order={1}>
										<LineChart
											selectedActivity={1}
											key={activities.current[0].maxPower}
											names={[name]}
											chartData={[activities.current[0].data]}
										></LineChart>
									</Grid>

									<Grid
										item
										xxs={12}
										md={12}
										lg={4}
										order={{ xxs: 6, xs: 6, s: 6, sm: 6, md: 6, lg: 2 }}
									>
										{activities.current[0].panelAngle ? (
											<Grid container ml={{ md: 0, lg: 1 }}>
												<Grid item xxs={12} xs={12} mt={1} sx={gridStyle}>
													<Typography
														variant='titleDepartment'
														color='blacky.main'
													>
														Curve Data
													</Typography>
												</Grid>

												<Grid
													item
													xxs={12}
													xs={12}
													sm={6}
													md={6}
													lg={12}
													mt={2}
													sx={gridStyle}
												>
													<Typography
														variant='titleDepartment'
														color='primary.700'
													>
														Radiation:
													</Typography>
													<Typography
														ml={1}
														variant='dataDepartment'
														color='blacky.main'
													>
														{activities.current[0].radiation} W/m2
													</Typography>
												</Grid>
												<Grid
													item
													container
													xxs={12}
													xs={12}
													sm={6}
													md={6}
													lg={12}
													sx={gridStyle}
													mt={2}
												>
													<Typography
														variant='titleDepartment'
														color='primary.700'
													>
														UVA:
													</Typography>
													<Typography
														variant='dataDepartment'
														color='blacky.main'
														ml={1}
													>
														{activities.current[0].uvaRadiation} W/m2
													</Typography>
												</Grid>
												<Grid
													item
													xxs={12}
													xs={12}
													sx={gridStyle}
													my={2}
													mb={2}
												>
													<Typography
														variant='titleDepartment'
														color='primary.700'
													>
														Panel Angle:
													</Typography>
													<Typography
														ml={1}
														variant='dataDepartment'
														color='blacky.main'
													>
														{activities.current[0].panelAngle} °
													</Typography>
												</Grid>
											</Grid>
										) : null}
										<Grid container ml={{ md: 0, lg: 1 }} rowSpacing={1}>
											<Grid item xxs={12} xs={12} sx={gridStyle}>
												<Typography
													variant='titleDepartment'
													color='blacky.main'
												>
													Procedure
												</Typography>
												<IconButton
													sx={{
														py: 0,
														color: 'secondary.main',
													}}
													href='https://time.learnify.se/l/show.html#att/7jor?startId=070e42be-8d2d-451c-81d6-35864b3d3486&lang=en'
													target='_blank'
												>
													<HelpIcon
														sx={{
															fontSize: {
																xxs: '16px',
																xs: '20px',
																sm: '24px',
															},
														}}
													/>
												</IconButton>
											</Grid>
											<Grid item xxs={12} xs={12} sx={gridStyle}>
												<Typography
													variant='dataDepartment'
													color='blacky.main'
												>
													PV Panel Datasheet
												</Typography>
												<IconButton
													sx={{
														py: 0,
														color: 'secondary.main',
													}}
													href='https://drive.google.com/file/d/1n062ERM91ZVwCC4tC17eulkaprrZm3_R/view?usp=sharing'
													target='_blank'
												>
													<DownloadIcon
														sx={{
															fontSize: {
																xxs: '16px',
																xs: '20px',
																sm: '24px',
															},
														}}
													/>
												</IconButton>
											</Grid>

											<Grid item xxs={12} xs={12} sx={gridStyle}>
												<Typography
													variant='titleDepartment'
													color='primary.700'
													mr={1}
												>
													Maximum Power Point:
												</Typography>
												<TextField
													sx={{ width: '80px' }}
													size='small'
													type='text'
													color='primary'
													variant='standard'
													value={maxPower}
													onChange={handleMaxPowerChange}
													InputProps={{
														inputMode: 'numeric',
														endAdornment: (
															<InputAdornment position='end'>W</InputAdornment>
														),
													}}
												></TextField>
												{maxPowerValidate && maxPowerShowValidate && (
													<Box ml={1}>
														<CheckIcon
															sx={{
																fontSize: {
																	xxs: '16px',
																	xs: '20px',
																	sm: '30px',
																},
															}}
															color='success'
														/>
													</Box>
												)}
												{!maxPowerValidate && maxPowerShowValidate && (
													<Box ml={1}>
														<CloseIcon
															sx={{
																fontSize: {
																	xxs: '16px',
																	xs: '20px',
																	sm: '30px',
																},
															}}
															color='error'
														/>
													</Box>
												)}
											</Grid>
											<Grid item xxs={12} xs={12} sx={gridStyle}>
												<Typography
													variant='titleDepartment'
													color='primary.700'
													mr={1}
												>
													PV Panel Efficiency:
												</Typography>
												<TextField
													sx={{ width: '80px' }}
													size='small'
													type='text'
													variant='standard'
													color='primary'
													value={efficiency}
													onChange={handleEfficiencyChange}
													InputProps={{
														inputMode: 'numeric',
														endAdornment: (
															<InputAdornment position='end'>%</InputAdornment>
														),
													}}
												></TextField>
												{efficiencyValidate && efficiencyShowValidate && (
													<Box ml={1}>
														<CheckIcon
															sx={{
																fontSize: {
																	xxs: '16px',
																	xs: '20px',
																	sm: '30px',
																},
															}}
															color='success'
														/>
													</Box>
												)}
												{!efficiencyValidate && efficiencyShowValidate && (
													<Box ml={1}>
														<CloseIcon
															sx={{
																fontSize: {
																	xxs: '16px',
																	xs: '20px',
																	sm: '30px',
																},
															}}
															color='error'
														/>
													</Box>
												)}
											</Grid>
										</Grid>
									</Grid>

									<Grid
										item
										xxs={12}
										md={12}
										lg={8}
										justifyContent='center'
										sx={{
											display: 'flex',
											alignItems: 'center',
										}}
										my={1}
										order={{ xxs: 2, xs: 2, s: 2, sm: 2, md: 2, lg: 3 }}
									>
										<LoadingButton
											loading={experimentLoading}
											variant='contained'
											sx={{
												bgcolor: 'primary.700',
												textTransform: 'none',
												mr: 1,
											}}
											onClick={() => {
												waitingExperiment('START');
												sendMqttMessage('START');
											}}
										>
											<Typography
												sx={{
													mx: 1,
												}}
												variant='titleDepartment'
												color='white'
											>
												Start
											</Typography>
										</LoadingButton>

										<CSVLink
											data={activities.current[0].data}
											headers={getColumns()}
											filename={'Efficiency_Test.csv'}
											style={{ textDecoration: 'none' }}
										>
											<Button
												variant='contained'
												sx={{
													bgcolor: 'primary.700',
													textTransform: 'none',
													mr: 1,
												}}
											>
												<Typography variant='titleDepartment' color='white'>
													Download
												</Typography>
											</Button>
										</CSVLink>
										<LoadingButton
											color='white'
											variant='contained'
											sx={{
												textTransform: 'none',
												border: 1,
												borderColor: 'primary.700',
											}}
											onClick={() => {
												clearActivity1();
											}}
										>
											<Typography
												color='primary.700'
												sx={{
													'&:hover': {
														color: '#fff',
													},
												}}
												variant='titleDepartment'
											>
												Clear
											</Typography>
										</LoadingButton>
									</Grid>
									<Grid
										item
										xxs={12}
										sm={6}
										order={{ xxs: 3, xs: 3, s: 3, sm: 3, md: 3, lg: 4 }}
										sx={gridStyle}
									>
										<Typography variant='titleDepartment' color='primary.700'>
											Actual Radiation:
										</Typography>
										<Typography
											ml={1}
											variant='dataDepartment'
											color='blacky.main'
										>
											{radiation} W/m2
										</Typography>
										<IconButton
											onClick={handleClickRadiation}
											sx={{
												py: 0,
												color: 'secondary.main',
											}}
										>
											<MoreTimeIcon
												sx={{
													fontSize: { xxs: '16px', xs: '20px', sm: '30px' },
												}}
											/>
										</IconButton>
										<Popover
											open={open}
											anchorEl={anchorElRadiation}
											anchorOrigin={{
												vertical: 'top',
												horizontal: 'center',
											}}
											transformOrigin={{
												vertical: 'bottom',
												horizontal: 'center',
											}}
											onClose={handleCloseRadiation}
											disableRestoreFocus
										>
											<RadiationChart
												title='Solar Radiation'
												city={name}
												type={typeRadiation}
											></RadiationChart>
										</Popover>
									</Grid>
									<Grid
										item
										xxs={12}
										sm={6}
										order={{ xxs: 4, xs: 4, s: 4, sm: 4, md: 4, lg: 5 }}
										sx={gridStyle}
										justifyContent={{ s: 'left', sm: 'flex-end' }}
									>
										<Typography variant='titleDepartment' color='primary.700'>
											Actual UVA:
										</Typography>
										<Typography
											ml={1}
											variant='dataDepartment'
											color='blacky.main'
										>
											{uvaRadiation} W/m2
										</Typography>
										<IconButton
											onClick={handleClickUVARadiation}
											sx={{
												py: 0,
												color: 'secondary.main',
											}}
										>
											<MoreTimeIcon
												sx={{
													fontSize: { xxs: '16px', xs: '20px', sm: '30px' },
												}}
											/>
										</IconButton>
										<Popover
											open={openUVA}
											anchorEl={anchorElUVA}
											anchorOrigin={{
												vertical: 'top',
												horizontal: 'center',
											}}
											transformOrigin={{
												vertical: 'bottom',
												horizontal: 'center',
											}}
											onClose={handleCloseUVARadiation}
											disableRestoreFocus
										>
											<RadiationChart
												title='UVA Radiation'
												city={name}
												type={typeUVAradiation}
											></RadiationChart>
										</Popover>
									</Grid>
									<Grid
										item
										xxs={12}
										xs={12}
										order={{ xxs: 5, xs: 5, s: 5, sm: 5, md: 5, lg: 6 }}
										sx={gridStyle}
									>
										<Typography variant='titleDepartment' color='primary.700'>
											Actual Panel Temperature:
										</Typography>
										<Typography
											ml={1}
											variant='dataDepartment'
											color='blacky.main'
										>
											{temperature} °C
										</Typography>
									</Grid>
								</Grid>
							</TabPanel>
							<TabPanel value={value} index={1} sx={{ width: '100%' }}>
								<Grid
									container
									columnSpacing={1}
									rowSpacing={1}
									sx={{ width: '100%' }}
								>
									<Grid item xxs={12} md={12} lg={8} order={1}>
										<LineChart
											selectedActivity={2}
											key={activities.current[1].data.length}
											names={activities.current[1].angles}
											chartData={activities.current[1].data}
										></LineChart>
									</Grid>

									<Grid
										item
										xxs={12}
										md={12}
										lg={4}
										order={{ xxs: 6, xs: 6, s: 6, sm: 6, md: 6, lg: 2 }}
									>
										<Grid container ml={{ md: 0, lg: 1 }}>
											<Grid item xxs={12} xs={12} mt={1} sx={gridStyle}>
												<Typography
													variant='titleDepartment'
													color='blacky.main'
												>
													Procedure
												</Typography>
											</Grid>
											<Grid xxs={12} xs={12} mt={1}>
												<Typography
													variant='dataDepartment'
													color='blacky.main'
												>
													Take as many I-V Curves as you want with different
													angles and save it to your account or download the
													data in an excel file!
												</Typography>
											</Grid>
										</Grid>
									</Grid>

									<Grid
										item
										xxs={12}
										md={12}
										lg={8}
										justifyContent='center'
										sx={{
											display: 'flex',
											alignItems: 'center',
										}}
										my={1}
										order={{ xxs: 2, xs: 2, s: 2, sm: 2, md: 2, lg: 3 }}
									>
										<LoadingButton
											loading={experimentLoading}
											variant='contained'
											sx={{
												bgcolor: 'primary.700',
												textTransform: 'none',
												mr: 1,
											}}
											onClick={() => {
												waitingExperiment('START');
												sendMqttMessage('START');
											}}
										>
											<Typography
												sx={{
													mx: 1,
												}}
												variant='titleDepartment'
												color='white'
											>
												Start
											</Typography>
										</LoadingButton>

										<CSVLink
											data={[].concat.apply([], activities.current[1].data)}
											headers={getColumns()}
											filename={'Efficiency_Tests.csv'}
											style={{ textDecoration: 'none' }}
										>
											<Button
												variant='contained'
												sx={{
													bgcolor: 'primary.700',
													textTransform: 'none',
													mr: 1,
												}}
											>
												<Typography variant='titleDepartment' color='white'>
													Download
												</Typography>
											</Button>
										</CSVLink>
										<LoadingButton
											color='white'
											variant='contained'
											sx={{
												textTransform: 'none',
												border: 1,
												borderColor: 'primary.700',
											}}
											onClick={() => {
												clearActivity2();
											}}
										>
											<Typography
												color='primary.700'
												sx={{
													'&:hover': {
														color: '#fff',
													},
												}}
												variant='titleDepartment'
											>
												Clear
											</Typography>
										</LoadingButton>
									</Grid>
									<Grid
										item
										xxs={12}
										sm={6}
										order={{ xxs: 3, xs: 3, s: 3, sm: 3, md: 3, lg: 4 }}
										sx={gridStyle}
									>
										<Typography variant='titleDepartment' color='primary.700'>
											Actual Radiation:
										</Typography>
										<Typography
											ml={1}
											variant='dataDepartment'
											color='blacky.main'
										>
											{radiation} W/m2
										</Typography>
										<IconButton
											onClick={handleClickRadiation}
											sx={{
												py: 0,
												color: 'secondary.main',
											}}
										>
											<MoreTimeIcon
												sx={{
													fontSize: { xxs: '16px', xs: '20px', sm: '30px' },
												}}
											/>
										</IconButton>
										<Popover
											open={open}
											anchorEl={anchorElRadiation}
											anchorOrigin={{
												vertical: 'top',
												horizontal: 'center',
											}}
											transformOrigin={{
												vertical: 'bottom',
												horizontal: 'center',
											}}
											onClose={handleCloseRadiation}
											disableRestoreFocus
										>
											<RadiationChart
												title='Solar Radiation'
												city={name}
												type={typeRadiation}
											></RadiationChart>
										</Popover>
									</Grid>
									<Grid
										item
										xxs={12}
										sm={6}
										order={{ xxs: 4, xs: 4, s: 4, sm: 4, md: 4, lg: 5 }}
										sx={gridStyle}
										justifyContent={{ s: 'left', sm: 'flex-end' }}
									>
										<Typography variant='titleDepartment' color='primary.700'>
											Actual UVA:
										</Typography>
										<Typography
											ml={1}
											variant='dataDepartment'
											color='blacky.main'
										>
											{uvaRadiation} W/m2
										</Typography>
										<IconButton
											onClick={handleClickUVARadiation}
											sx={{
												py: 0,
												color: 'secondary.main',
											}}
										>
											<MoreTimeIcon
												sx={{
													fontSize: { xxs: '16px', xs: '20px', sm: '30px' },
												}}
											/>
										</IconButton>
										<Popover
											open={openUVA}
											anchorEl={anchorElUVA}
											anchorOrigin={{
												vertical: 'top',
												horizontal: 'center',
											}}
											transformOrigin={{
												vertical: 'bottom',
												horizontal: 'center',
											}}
											onClose={handleCloseUVARadiation}
											disableRestoreFocus
										>
											<RadiationChart
												title='UVA Radiation'
												city={name}
												type={typeUVAradiation}
											></RadiationChart>
										</Popover>
									</Grid>
									<Grid
										item
										xxs={12}
										xs={12}
										order={{ xxs: 5, xs: 5, s: 5, sm: 5, md: 5, lg: 6 }}
										sx={gridStyle}
									>
										<Typography variant='titleDepartment' color='primary.700'>
											Actual Panel Temperature:
										</Typography>
										<Typography
											ml={1}
											variant='dataDepartment'
											color='blacky.main'
										>
											{temperature} °C
										</Typography>
									</Grid>
								</Grid>
							</TabPanel>
						</Grid>
					</Grid>
				</Box>
			</Card>
		</Box>
	);
}
