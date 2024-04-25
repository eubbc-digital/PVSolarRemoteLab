import {
	Box,
	Button,
	Dialog,
	Grid,
	TextField,
	Typography,
	Stack,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import DepartmentDataDialog from './DepartmentDataDialog';
import { useSession } from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import LineChart from './LineChart';
import { v4 as uuidv4 } from 'uuid';
import { CSVLink } from 'react-csv';
import DownloadIcon from '@mui/icons-material/Download';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LoadingButton from '@mui/lab/LoadingButton';

export default function SaveExperimentDialog({
	open,
	handleClose,
	departmentData,
	selectedCities,
	setNotSaved,
}) {
	const { data: session, status } = useSession();
	const [experimentName, setExperimentName] = useState('');
	const [date, setDate] = useState(0);
	const [time, setTime] = useState(0);
	const [timezone, setTimezone] = useState('America/La_Paz');
	const [departmentsToSave, setDepartmentsToSave] = useState([]);
	const [activitiesToShow, setActivitiesToShow] = useState([]);
	const [studentCourses, setStudentCourses] = useState([]);
	const [activities, setActivities] = useState([
		{ id: 1, activity: 1, city: 'All' },
		{ id: 2, activity: 2, city: 'Cochabamba' },
		{ id: 3, activity: 2, city: 'La Paz' },
		{ id: 4, activity: 2, city: 'Santa Cruz' },
		{ id: 5, activity: 3, city: 'All' },
	]);
	const [selectedCourse, setSelectedCourse] = useState('');
	const [selectedActivity, setSelectedActivity] = useState('');
	const [loading, setLoading] = React.useState(false);

	useEffect(() => {
		setDate(new Date().toLocaleString(navigator.language).split(',')[0]);
		setTime(
			new Date().toLocaleString(navigator.language, {
				hour: '2-digit',
				minute: '2-digit',
				hour12: false,
				timeZone: 'America/La_Paz',
			})
		);
		setDepartmentsToSave(
			departmentData.filter((department) =>
				selectedCities.includes(department.departmentName)
			)
		);
	}, [open]);
	useEffect(() => {
		checkSession();
	}, [status]);
	useEffect(() => {
		if (departmentsToSave.length > 0) {
			filterActivities(1);
			setSelectedActivity(1);
		}
	}, [departmentsToSave]);

	const checkSession = async () => {
		if (status === 'authenticated') {
			await loadStudentCourses();
		} else if (status === 'loading') {
		} else {
		}
	};

	const loadStudentCourses = async () => {
		setLoading(true);
		const response = await fetch(`/solar-lab/api/courses/readfiltered`, {
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
			setStudentCourses(answer.courses);
		}
		setLoading(false);
	};

	const saveExperiment = async () => {
		if (selectedCities.length > 0) {
			if (validateFields()) {
				if (validateEfficiencyCurves()) {
					setLoading(true);
					const cityWithId = departmentsToSave.map((cityLab) => ({
						...cityLab,
						id: uuidv4(),
					}));

					const activities = cityWithId.map(({ id, activities }) => ({
						id,
						activities,
					}));

					const cityLabs = cityWithId.map(({ activities, ...city }) => city);
					const response = await fetch(`/solar-lab/api/experiments/create`, {
						headers: {
							'Content-Type': 'application/json',
						},
						method: 'POST',
						body: JSON.stringify({
							experimentName: experimentName,
							email: session.user.email,
							cities: cityLabs,
							activities: activities,
							experimentDate: date,
							experimentTime: time,
							timezone: timezone,
							courseId: selectedCourse,
						}),
					});
					const answer = await response.json();
					if (answer.status) {
						setExperimentName('');
						setSelectedCourse('');
						setLoading(false);
						handleClose();
						setNotSaved(false);
						toast.success('Saved Successfully!');
					} else {
						toast.error('Error Saving, Please Try Again Later');
						setLoading(false);
					}
				} else {
					toast.info('Your experiment is empty');
				}
			} else {
				toast.error('Please Review Name and Course');
			}
		} else {
			toast.error('Select Cities for the Experiment');
		}
	};

	const validateFields = () => {
		return experimentName && selectedCourse;
	};
	const validateEfficiencyCurves = () => {
		if (departmentsToSave.length == 0) {
			return false;
		}
		return true;
	};

	const handleChange = (event) => {
		setSelectedCourse(event.target.value);
	};
	const handleChangeActivity = (event) => {
		filterActivities(event.target.value);
		setSelectedActivity(event.target.value);
	};
	const filterActivities = (filterId) => {
		let dataToShow = [];
		if (filterId == 1) {
			departmentsToSave.forEach((city) => {
				dataToShow.push({
					departmentName: city.departmentName,
					data: city.activities[
						city.activities.findIndex(
							(activity) => activity.activityNumber == 1
						)
					],
				});
			});
			setActivitiesToShow(dataToShow);
		} else if (filterId == 5) {
			departmentsToSave.forEach((city) => {
				dataToShow.push({
					departmentName: city.departmentName,
					data: city.activities[
						city.activities.findIndex(
							(activity) => activity.activityNumber == 3
						)
					],
				});
			});
			setActivitiesToShow(dataToShow);
		} else if (filterId > 1 && filterId < 5) {
			let selectedCity;
			if (filterId == 2) {
				selectedCity = 'Cochabamba';
			} else if (filterId == 3) {
				selectedCity = 'La Paz';
			} else if (filterId == 4) {
				selectedCity = 'Santa Cruz';
			}
			departmentsToSave.forEach((city) => {
				if (city.departmentName == selectedCity) {
					dataToShow.push({
						departmentName: city.departmentName,
						data: city.activities[
							city.activities.findIndex(
								(activity) => activity.activityNumber == 2
							)
						],
					});
				}
			});
			setActivitiesToShow(dataToShow);
		}
	};
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

	const concatData = (data) => {
		let totalArray = [];
		if (data[0]) {
			data.forEach((array) => {
				totalArray.push(...array);
			});
		}
		return totalArray;
	};

	const getCurves = () => {
		if (selectedActivity > 1 && selectedActivity < 5) {
			if (activitiesToShow.length > 0) {
				return activitiesToShow[0].data.efficiencyCurve;
			} else {
				return [];
			}
		} else {
			return activitiesToShow.map(
				(activity) => activity.data.efficiencyCurve[0]
			);
		}
	};

	const activityHasData = () => {
		if (activitiesToShow.length == 0) {
			return false;
		}
		let atLeastOneHasData = activitiesToShow.some(function (activity) {
			return activity.data.radiation || activity.data.temperature;
		});
		return atLeastOneHasData;
	};

	const getNames = () => {
		if (selectedActivity > 1 && selectedActivity < 5) {
			if (activitiesToShow.length > 0) {
				return activitiesToShow[0].data.efficiencyCurve.map(
					(curve) => curve[0].degree
				);
			} else {
				return [];
			}
		} else {
			return activitiesToShow.map((activity) => activity.departmentName);
		}
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			PaperProps={{
				sx: {
					borderRadius: '24px',
					maxWidth: '720px',
				},
			}}
		>
			<Box m={{ xxs: 2, xs: 3, s: 4, sm: 5 }}>
				<Grid container rowSpacing={1}>
					<Grid item xxs={12} xs={12} mb={1}>
						<Typography variant='header1' color='secondary'>
							Save{' '}
						</Typography>
						<Typography variant='header1' color='primary.700'>
							Experiment
						</Typography>
					</Grid>
					<Grid item xxs={12} xs={12}>
						<Typography variant='titleDialog' color='blacky.main'>
							Review the data and give the Experiment a Name
						</Typography>
					</Grid>
					<Grid item xxs={12} xs={12} mb={1}>
						<Typography variant='titleDialog' color='primary.700'>
							Name
						</Typography>
					</Grid>
					<Grid item xxs={12} xs={12} mb={1}>
						<TextField
							required
							hiddenLabel
							fullWidth
							variant='outlined'
							value={experimentName}
							onChange={(e) => setExperimentName(e.target.value)}
							size='small'
							inputProps={{
								style: {
									height: '1.6rem',
									padding: '8px',
									fontFamily: 'Lato',
									fontSize: '1.2rem',
								},
							}}
						/>
					</Grid>
					<Grid item xxs={12} xs={12} mb={1}>
						<Typography variant='titleDialog' color='primary.700'>
							Course
						</Typography>
					</Grid>
					<Grid item xxs={12} xs={12} mb={1}>
						<FormControl
							size='small'
							sx={{
								width: '100%',
							}}
						>
							<InputLabel>
								<Typography variant='header3' color='blacky.main'>
									Select a Course
								</Typography>
							</InputLabel>
							<Select
								fullWidth
								value={selectedCourse}
								onChange={handleChange}
								displayEmpty
								renderValue={() => {
									let value = '';
									studentCourses.forEach((course) => {
										if (selectedCourse == course.id) {
											value =
												course.name +
												' - ' +
												course.teacher.user.name +
												' - ' +
												course.startDate;
										}
									});
									return value;
								}}
							>
								{studentCourses.map((course) => (
									<MenuItem key={course.id} value={course.id}>
										<Typography variant='header3' color='blacky.main'>
											{course.name} {'- '}
											{course.teacher.user.name} {'- '} {course.startDate}
										</Typography>
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>

					<Grid item xxs={4} xs={4}>
						<Typography variant='titleDialog' color='primary.700'>
							Date
						</Typography>
					</Grid>
					<Grid item xxs={8} xs={8}>
						<Typography variant='titleDialog' color='primary.700'>
							Time
						</Typography>
					</Grid>
					<Grid item xxs={4} xs={4}>
						{' '}
						<Typography variant='dataDialog' color='blacky.main'>
							{date}
						</Typography>
					</Grid>
					<Grid item xxs={8} xs={8}>
						{' '}
						<Typography variant='dataDialog' color='blacky.main'>
							{time} {timezone}
						</Typography>
					</Grid>
					<Grid item xxs={4} xs={4} mt={1}>
						<Typography variant='titleDialog' color='primary.700'>
							Activity:
						</Typography>
					</Grid>
					<Grid item xxs={8} xs={8} mt={1} mb={1}>
						<FormControl
							size='small'
							sx={{
								width: '100%',
							}}
						>
							<InputLabel>
								<Typography variant='header3' color='blacky.main'>
									Select an Activity to Review Data
								</Typography>
							</InputLabel>
							<Select
								fullWidth
								value={selectedActivity}
								onChange={handleChangeActivity}
							>
								{activities.map((option) => (
									<MenuItem key={option.id} value={option.id}>
										<Typography variant='header3' color='blacky.main'>
											{'Activity: '}
											{option.activity}
											{' - City: '}
											{option.city}
										</Typography>
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					{activityHasData() ? (
						<Box sx={{ width: '100%' }}>
							<Grid item xxs={12} xs={12}>
								<Box>
									<LineChart
										key={selectedActivity}
										chartData={getCurves()}
										names={getNames()}
										selectedActivity={selectedActivity}
									></LineChart>
								</Box>
							</Grid>
							<Grid item xxs={12} align='center' mt={1}>
								<CSVLink
									data={concatData(getCurves())}
									headers={getColumns()}
									filename={'Efficiency_Test.csv'}
									style={{ textDecoration: 'none' }}
								>
									<Button
										variant='contained'
										sx={{
											textTransform: 'none',
											bgcolor: 'primary.700',
										}}
										endIcon={<DownloadIcon />}
									>
										<Typography color='white.main' variant='buttonsExperiments'>
											Download Data
										</Typography>
									</Button>
								</CSVLink>
							</Grid>

							<Grid item xxs={12} xs={12}>
								<Box key={selectedActivity}>
									{activitiesToShow.map((activity) => (
										<DepartmentDataDialog
											activity={activity}
											key={activity.departmentName}
										></DepartmentDataDialog>
									))}
								</Box>
							</Grid>
						</Box>
					) : (
						<Grid
							container
							justify='center'
							rowSpacing={{ xxs: 1, xs: 1, s: 1, sm: 2, md: 2 }}
						>
							<Grid
								item
								xxs={12}
								xs={12}
								sx={{
									display: 'flex',
									alignItems: 'center',
								}}
								justifyContent='center'
							>
								<ErrorOutlineIcon
									sx={{
										fontSize: { xxs: '32px', xs: '48px', sm: '64px' },
										color: 'warning.main',
									}}
								/>
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
								<Typography variant='header3' color='blacky.main'>
									No Data in the Selected Activity
								</Typography>
							</Grid>
						</Grid>
					)}
				</Grid>
				<Stack
					direction='row'
					justifyContent='end'
					mt={{ xxs: 1, xs: 1, sm: 2 }}
				>
					<LoadingButton
						loading={loading}
						variant='contained'
						my={{ xxs: 1, xs: 1, sm: 2 }}
						sx={{
							textTransform: 'none',
							bgcolor: 'primary.700',
							mr: { xxs: 1, xs: 1, sm: 3 },
						}}
						onClick={saveExperiment}
					>
						<Typography
							mx={{ xxs: 1, xs: 1, sm: 3 }}
							variant='buttons1'
							color='white'
						>
							Save
						</Typography>
					</LoadingButton>
					<Button
						color='white'
						variant='contained'
						sx={{
							border: 1,
							textTransform: 'none',
							borderColor: 'primary.700',
						}}
						onClick={handleClose}
					>
						<Typography
							mx={{ xxs: 0, xs: 0, sm: 1 }}
							variant='buttons1'
							color='primary.700'
							sx={{
								'&:hover': {
									color: '#fff',
								},
							}}
						>
							Cancel
						</Typography>
					</Button>
				</Stack>
			</Box>
		</Dialog>
	);
}
