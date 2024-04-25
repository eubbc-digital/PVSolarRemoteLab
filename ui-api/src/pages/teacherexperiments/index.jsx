import {
	Box,
	Grid,
	Card,
	Typography,
	Button,
	FormControl,
	Select,
	MenuItem,
	InputLabel,
} from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import ExperimentsListDialog from '../../components/ExperimentsList';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LineChart from '../../components/LineChart';
import DepartmentDataDialog from '@/components/DepartmentDataDialog';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { CSVLink } from 'react-csv';
import DownloadIcon from '@mui/icons-material/Download';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function Teacherexperiments() {
	const [selectedStudentName, setSelectedStudentName] = useState('');
	const [selectedStudentEmail, setSelectedStudentEmail] = useState('');
	const [courseStudents, setCourseStudents] = useState({});
	const [selectedCourse, setSelectedCourse] = useState('');
	const [teacherCourses, setTeacherCourses] = useState([]);
	const [selectedActivity, setSelectedActivity] = useState('');
	const [activities, setActivities] = useState([
		{ id: 1, activity: 1, city: 'All' },
		{ id: 2, activity: 2, city: 'Cochabamba' },
		{ id: 3, activity: 2, city: 'La Paz' },
		{ id: 4, activity: 2, city: 'Santa Cruz' },
		{ id: 5, activity: 3, city: 'All' },
	]);
	const [activitiesToShow, setActivitiesToShow] = useState([]);

	const { data: session, status } = useSession();
	const [experiment, setExperiment] = useState({});

	const [openExperimentsList, setOpenExperimentsList] = useState(false);

	const router = useRouter();

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

	const getData = (data) => {
		// Get column names
		let totalArray = [];
		data.forEach((array) => {
			totalArray.push(...array);
		});
		return totalArray;
	};

	const checkSession = async () => {
		if (status === 'authenticated') {
			await verifyRole();
		} else if (status === 'loading') {
		} else {
			router.push('/experiments');
		}
	};

	const verifyRole = async () => {
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
				router.push('/experiments');
			} else {
				loadData();
			}
		}
	};

	const loadData = async () => {
		const response = await fetch(
			`/solar-lab/api/teacher/courses/readfiltered`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify({ email: session.user.email }),
			}
		);
		const answer = await response.json();

		if (!answer.status) {
			toast.error('Something Went Wrong, Please Try');
		} else {
			setTeacherCourses(answer.courses);
			if (answer.courses.length > 0) {
				setSelectedCourse(answer.courses[0].id);
				var courseId = answer.courses[0].id;
				setCourseStudents(answer.courses[0].students);
				if (answer.courses[0].students.length > 0) {
					setSelectedStudentName(answer.courses[0].students[0].user.name);
					setSelectedStudentEmail(answer.courses[0].students[0].user.email);
					setExperiment(
						answer.courses[0].students[0].experiments.filter(
							(experiment) => experiment.courseId == courseId
						)[0]
					);
				}
			}
		}
	};

	const handleChangeCourse = (event) => {
		setSelectedStudentName('');
		setSelectedStudentEmail('');
		setExperiment(undefined);
		setSelectedCourse(event.target.value);
		teacherCourses.forEach((course) => {
			if (course.id === event.target.value) {
				setCourseStudents(course.students);
			}
		});
	};

	const handleChangeStudent = (event) => {
		setSelectedStudentName(event.target.value);
		courseStudents.forEach((student) => {
			if (student.user.name == event.target.value) {
				setSelectedStudentEmail(student.userEmail);
				if (
					student.experiments.some(
						(experiment) => experiment.courseId == selectedCourse
					)
				) {
					setExperiment(
						student.experiments.filter(
							(experiment) => experiment.courseId == selectedCourse
						)[0]
					);
				} else {
					setExperiment(undefined);
				}
			}
		});
	};
	const handleChangeActivity = (event) => {
		filterActivities(event.target.value);
		setSelectedActivity(event.target.value);
	};
	const filterActivities = (filterId) => {
		let dataToShow = [];
		if (filterId == 1) {
			experiment.cityLabs.forEach((city) => {
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
			experiment.cityLabs.forEach((city) => {
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
			experiment.cityLabs.forEach((city) => {
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
		let curves = [];
		if (activitiesToShow.length > 0) {
			if (selectedActivity > 1 && selectedActivity < 5) {
				return activitiesToShow[0].data.efficiencyCurve.map(
					(curve) => curve.efficiencyRecords
				);
			} else {
				activitiesToShow.forEach((activity) => {
					if (activity.data.efficiencyCurve.length > 0) {
						curves.push(activity.data.efficiencyCurve[0].efficiencyRecords);
					}
				});
				return curves;
			}
		} else {
			return [];
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
					(curve) => curve.efficiencyRecords[0].degree
				);
			} else {
				return [];
			}
		} else {
			return activitiesToShow.map((activity) => activity.departmentName);
		}
	};

	useEffect(() => {
		checkSession();
	}, [status]);

	useEffect(() => {
		if (experiment) {
			if (selectedStudentEmail != '') {
				filterActivities(1);
				setSelectedActivity(1);
			}
		}
	}, [experiment]);

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
			<Box
				sx={{ minHeight: '80vh' }}
				mt={{ xxs: 10, xs: 10, s: 10, sm: 12 }}
				px={{ xxs: 2, xs: 2, s: 4, sm: 6 }}
			>
				<Box
					my={{ xxs: 2, xs: 3, s: 3, sm: 3 }}
					mx={{ xxs: 1, xs: 1, s: 1, sm: 2 }}
					sx={{
						height: '100%',
						width: 'auto',
					}}
				>
					<Grid container justify='center' columnSpacing={2} rowSpacing={2}>
						<Grid
							item
							xs={12}
							s={6}
							sm={6}
							md={6}
							lg={4}
							sx={{
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<Typography variant='header2' color='primary.700'>
								Course:
							</Typography>
							<Box ml={2}>
								{teacherCourses.length > 0 ? (
									<FormControl
										size='small'
										sx={{
											minWidth: { xxs: 160, xs: 180, s: 140, sm: 150, md: 180 },
											maxWidth: { xxs: 180, xs: 220, s: 140, sm: 180, md: 250 },
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
											onChange={handleChangeCourse}
											displayEmpty
											renderValue={() => {
												let value = '';
												teacherCourses.forEach((course) => {
													if (selectedCourse == course.id) {
														value = course.name + ' - ' + course.startDate;
													}
												});
												return value;
											}}
										>
											{teacherCourses.map((course) => (
												<MenuItem key={course.id} value={course.id}>
													<Typography variant='header3' color='blacky.main'>
														{course.name} {'- '} {course.startDate}
													</Typography>
												</MenuItem>
											))}
										</Select>
									</FormControl>
								) : (
									<Typography variant='header3' color='blacky.main'>
										Create a Course first
									</Typography>
								)}
							</Box>
						</Grid>
						<Grid
							item
							xs={12}
							s={6}
							sm={6}
							md={6}
							lg={4}
							sx={{
								display: 'flex',
								alignItems: 'center',
							}}
							justifyContent={{ xs: 'left', s: 'flex-end' }}
						>
							<Typography variant='header2' color='primary.700'>
								Student:
							</Typography>
							<Box ml={2}>
								{courseStudents.length > 0 ? (
									<FormControl
										size='small'
										sx={{
											minWidth: { xxs: 160, xs: 180, s: 140, sm: 150, md: 180 },
											maxWidth: { xxs: 180, xs: 220, s: 140, sm: 180, md: 250 },
										}}
									>
										<InputLabel>
											<Typography variant='header3' color='blacky.main'>
												Select a Student
											</Typography>
										</InputLabel>
										<Select
											value={selectedStudentName}
											onChange={handleChangeStudent}
										>
											{courseStudents.map((student) => (
												<MenuItem key={student.id} value={student.user.name}>
													<Typography variant='header3' color='blacky.main'>
														{student.user.name}
													</Typography>
												</MenuItem>
											))}
										</Select>
									</FormControl>
								) : (
									<Typography variant='header3' color='blacky.main'>
										No Students found in this Course
									</Typography>
								)}
							</Box>
						</Grid>
						<Grid
							item
							xs={12}
							s={12}
							sm={12}
							md={12}
							lg={4}
							sx={{
								display: 'flex',
								alignItems: 'center',
							}}
							justifyContent={{ s: 'left', sm: 'flex-end' }}
						>
							{experiment && Object.keys(experiment).length > 0 ? (
								<Box>
									<ExperimentsListDialog
										open={openExperimentsList}
										handleClose={() => {
											setOpenExperimentsList(false);
										}}
										email={selectedStudentEmail}
										setExperiment={setExperiment}
										courseId={selectedCourse}
									/>
									<Button
										variant='contained'
										sx={{
											textTransform: 'none',
											bgcolor: 'primary.700',
											ml: { xxs: 0, xs: 0, s: 0, sm: 0, md: 0, lg: 2 },
										}}
										onClick={() => setOpenExperimentsList(true)}
									>
										<Typography color='white.main' variant='buttonsExperiments'>
											View Student Experiments
										</Typography>
									</Button>
								</Box>
							) : (
								<Button
									variant='contained'
									sx={{
										textTransform: 'none',
										bgcolor: 'primary.700',
										ml: { xxs: 0, xs: 0, s: 0, sm: 0, md: 0, lg: 2 },
									}}
									onClick={() => router.push('/courses')}
								>
									<Typography color='white.main' variant='buttonsExperiments'>
										Manage Courses
									</Typography>
								</Button>
							)}
						</Grid>
					</Grid>
				</Box>
				<Box
					mx={{ xxs: 1, xs: 1, s: 1, sm: 2 }}
					mb={1}
					sx={{
						height: '100%',
						width: 'auto',
					}}
				>
					<Card
						elevation={5}
						sx={{
							height: '100%',
							width: 'auto',
						}}
					>
						<Box
							py={{ xxs: 2, xs: 4, s: 5, sm: 5 }}
							px={{ xxs: 1, xs: 2, s: 2, sm: 4 }}
						>
							<Grid
								container
								justify='center'
								px={2}
								mb={{ xxs: 1, xs: 1, s: 1, sm: 2 }}
							>
								<Grid
									item
									xs={12}
									s={12}
									sm={12}
									md={12}
									sx={{
										display: 'flex',
										alignItems: 'center',
									}}
								>
									<Typography variant='header2' color='secondary.main'>
										Experiment Info:
									</Typography>
								</Grid>
							</Grid>
							{experiment && Object.keys(experiment).length > 0 ? (
								<Grid
									container
									justify='center'
									rowSpacing={{ xxs: 1, xs: 1, s: 1, sm: 2 }}
									px={2}
								>
									<Grid
										item
										xxs={12}
										xs={12}
										s={12}
										sx={{ verticalAlign: 'middle' }}
									>
										<Typography variant='header12' color='blacky.main'>
											{experiment.name}
										</Typography>
									</Grid>
									<Grid item xxs={12} xs={12} s={12}>
										<Typography variant='titleDialog' color='primary.700'>
											Date:
										</Typography>
										<Typography ml={1} variant='dataDialog' color='blacky.main'>
											{experiment.experimentDate}
										</Typography>
									</Grid>
									<Grid item xxs={12} xs={12} md={7}>
										<Typography variant='titleDialog' color='primary.700'>
											Time:
										</Typography>
										<Typography ml={1} variant='dataDialog' color='blacky.main'>
											{experiment.experimentTime} ({experiment.timezone})
										</Typography>
									</Grid>
									<Grid item xxs={12} sm={12} md={5}>
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
									<Grid item xxs={12} align='center'>
										{activityHasData() ? (
											<Box>
												<Grid item xxs={12} align='center'>
													<Box
														sx={{
															width: '100%',
															'@media (min-width:500px)': {
																width: '80%',
															},
															'@media (min-width:800px)': {
																width: '60%',
															},
															'@media (min-width:1100px)': {
																width: '40%',
															},
														}}
													>
														<LineChart
															key={getCurves()}
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
														filename={
															experiment.name +
															'-Activity' +
															selectedActivity +
															'-Data.csv'
														}
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
															<Typography
																color='white.main'
																variant='buttonsExperiments'
															>
																Download Data
															</Typography>
														</Button>
													</CSVLink>
												</Grid>
												<Grid item xxs={12} align='center' ml={2} mb={3}>
													<Box key={getCurves()}>
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
								</Grid>
							) : (
								<Grid container justify='center' rowSpacing={2}>
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
											This Student has not done any Experiment yet
										</Typography>
									</Grid>
								</Grid>
							)}
						</Box>
					</Card>
				</Box>
			</Box>
		</main>
	);
}
