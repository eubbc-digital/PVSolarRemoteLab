import {
	Box,
	Grid,
	Card,
	Typography,
	FormControl,
	Select,
	MenuItem,
	Button,
	IconButton,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import BlockIcon from '@mui/icons-material/Block';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import CreateCourseDialog from '../../components/CreateCourseDialog';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { DataGrid } from '@mui/x-data-grid';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import VerifyEmailDialog from '@/components/VerifyEmailDialog';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';

import Head from 'next/head';

export default function Courses() {
	const { data: session, status } = useSession();

	const [loading, setLoading] = React.useState(false);
	const [teacherCourses, setTeacherCourses] = useState([]);
	const [openCreateCourseDialog, setOpenCreateCourseDialog] = useState(false);
	const [selectedCourse, setSelectedCourse] = useState({});
	const [courseStudents, setCourseStudents] = useState({});
	const [courseRequests, setCourseRequests] = useState({});
	const [reRender, setReRender] = useState(false);

	useEffect(() => {
		checkSession();
	}, [status, openCreateCourseDialog, reRender]);

	const checkSession = async () => {
		if (status === 'authenticated') {
			await loadCourses();
		} else if (status === 'loading') {
		} else {
		}
	};

	const loadCourses = async () => {
		if (await isVerified()) {
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
				toast.error('Something Went Wrong, Please Try Again');
			} else {
				setTeacherCourses(answer.courses);
				if (
					!window.localStorage.getItem('COURSE') &&
					answer.courses.length > 0
				) {
					setSelectedCourse(answer.courses[0]);
					loadCourseStudents(answer.courses[0].id);
					loadCourseRequests(answer.courses[0].id);
					window.localStorage.setItem(
						'COURSE',
						JSON.stringify({
							name: answer.courses[0].name,
							id: answer.courses[0].id,
							startDate: answer.courses[0].startDate,
							endDate: answer.courses[0].endDate,
							description: answer.courses[0].description,
						})
					);
				} else if (answer.courses.length > 0) {
					setSelectedCourse(JSON.parse(window.localStorage.getItem('COURSE')));
					loadCourseStudents(
						JSON.parse(window.localStorage.getItem('COURSE')).id
					);
					loadCourseRequests(
						JSON.parse(window.localStorage.getItem('COURSE')).id
					);
				}
			}
		} else {
			setOpenVerifyEmail(true);
		}
	};

	const loadCourseStudents = async (id) => {
		const response = await fetch(`/solar-lab/api/teacher/courses/read`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({ id: id }),
		});
		const answer = await response.json();

		if (!answer.status) {
			toast.error('Something Went Wrong, Please Try Again');
		} else {
			if (answer.course) {
				setCourseStudents(answer.course.students);
			}
		}
	};

	const loadCourseRequests = async (id) => {
		const response = await fetch(`/solar-lab/api/teacher/requests/read`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({ id: id }),
		});
		const answer = await response.json();

		if (!answer.status) {
			toast.error('Something Went Wrong, Please Try Again');
		} else {
			if (answer.requests) {
				setCourseRequests(answer.requests);
			}
		}
	};

	const handleChange = (event) => {
		teacherCourses.forEach((course) => {
			if (course.name === event.target.value) {
				loadCourseStudents(course.id);
				loadCourseRequests(course.id);
				window.localStorage.setItem(
					'COURSE',
					JSON.stringify({
						name: event.target.value,
						id: course.id,
						startDate: course.startDate,
						endDate: course.endDate,
						description: course.description,
					})
				);
				setSelectedCourse(course);
			}
		});
	};

	const handleRequest = async (params, status) => {
		setLoading(true);
		if (status == 'Denied') {
			const response = await fetch(`/solar-lab/api/request/update`, {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify({ id: params.id, status: status }),
			});
			const answer = await response.json();
			setLoading(false);
			if (answer.status) {
				toast.success('Request Denied');
			} else {
				toast.error("'Something Went Wrong, Please Try Again Later'");
			}
		} else if (status == 'Aproved') {
			const response = await fetch(`/solar-lab/api/request/aprove`, {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify({
					id: params.id,
					studentId: params.row.student.id,
					courseId: params.row.courseId,
				}),
			});
			const answer = await response.json();
			setLoading(false);
			if (answer.status) {
				toast.success('Student Joined!');
			} else {
				toast.error("'Something Went Wrong, Please Try Again Later'");
			}
		}
		setReRender(!reRender);
	};

	const [openVerifyEmail, setOpenVerifyEmail] = useState(false);

	const handleCloseVerifyEmail = (event, reason) => {
		if (reason && reason == 'backdropClick') {
			toast.error('Not Verified yet');
		} else {
			setOpenVerifyEmail(false);
		}
	};

	const isVerified = async () => {
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
			if (answer.user.isVerified) {
				return true;
			} else {
				return false;
			}
		}
	};

	const columns = [
		{ field: 'id', headerName: 'ID', width: 70, visible: true },

		{
			field: 'name',
			headerName: 'Name',
			width: 200,
			valueGetter: (params) => params.row?.user?.name,
		},

		{
			field: 'experiments',
			headerName: 'Experiments',
			width: 130,
			valueGetter: (params) => {
				return params.row.experiments.filter(
					(experiment) => experiment.courseId == selectedCourse.id
				).length;
			},
		},
	];

	const requestColumns = [
		{ field: 'id', headerName: 'ID', width: 70, visible: true },

		{
			field: 'name',
			headerName: 'Name',
			width: 200,
			valueGetter: (params) => params.row?.student.user?.name,
		},

		{
			field: 'actions',
			headerName: '',
			width: 250,
			renderCell: (params) => {
				return (
					<Box>
						<Grid container>
							<Grid
								item
								mr={{ xxs: 1, xs: 1, s: 1, sm: 4 }}
								sx={{
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<IconButton
									onClick={() => handleRequest(params, 'Aproved')}
									sx={{
										color: 'success.main',
									}}
								>
									{' '}
									{loading ? (
										<CircularProgress
											size={24}
											sx={{
												color: 'secondary.main',
											}}
										/>
									) : (
										<CheckIcon
											sx={{
												fontSize: { xxs: '16px', xs: '20px', sm: '30px' },
											}}
										/>
									)}
								</IconButton>
								<Typography color='blacky.main'>Aprove</Typography>
							</Grid>
							<Grid
								onClick={() => {
									handleRequest(params, 'Denied');
								}}
								item
								sx={{
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<IconButton
									sx={{
										color: 'error.main',
									}}
								>
									<BlockIcon
										sx={{
											fontSize: { xxs: '16px', xs: '20px', sm: '30px' },
										}}
									/>
								</IconButton>
								<Typography color='blacky.main'>Deny</Typography>
							</Grid>
						</Grid>
					</Box>
				);
			},
		},
	];

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
					<Grid
						container
						rowSpacing={2}
						columnSpacing={{ sm: 0, md: 4, lg: 5, xl: 6 }}
					>
						<Grid
							item
							xs={12}
							s={6}
							sm={6}
							sx={{
								display: 'flex',
								alignItems: 'center',
							}}
							order={1}
						>
							<Typography variant='header2' color='primary.700'>
								Course:
							</Typography>
							<Box ml={2}>
								{teacherCourses.length > 0 ? (
									<FormControl size='small'>
										<Select value={selectedCourse.name} onChange={handleChange}>
											{teacherCourses.map((course) => (
												<MenuItem key={course.id} value={course.name}>
													<Typography variant='header3' color='blacky.main'>
														{course.name}
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
							xxs={12}
							xs={12}
							s={6}
							sm={6}
							sx={{
								display: 'flex',
								alignItems: 'center',
							}}
							justifyContent={{ xs: 'left', s: 'flex-end' }}
							order={2}
						>
							<LoadingButton
								loading={loading}
								variant='contained'
								sx={{
									textTransform: 'none',
									bgcolor: 'primary.700',
									ml: { xxs: 0, xs: 0, s: 0, sm: 3 },
								}}
								onClick={() => setOpenCreateCourseDialog(true)}
							>
								<Typography color='white.main' variant='buttonsExperiments'>
									Create New Course
								</Typography>
							</LoadingButton>
						</Grid>
					</Grid>
				</Box>
				<Box
					my={2}
					mx={{ xxs: 1, xs: 1, s: 1, sm: 2 }}
					sx={{
						height: '100%',
						width: 'auto',
					}}
				>
					<Card
						elevation={5}
						sx={{
							height: '100%',
						}}
					>
						<Box
							my={{ xxs: 2, xs: 3, s: 3, sm: 4 }}
							mx={{ xxs: 3, xs: 3, s: 4, sm: 5 }}
						>
							<Grid
								container
								rowSpacing={{ xxs: 1, xs: 1, s: 1, sm: 2, md: 2 }}
								columnSpacing={{ sm: 0, md: 4, lg: 5, xl: 6 }}
							>
								<Grid
									item
									xxs={12}
									xs={12}
									s={6}
									sx={{
										display: 'inline-block',
										verticalAlign: 'middle',
										lineHeight: 'normal',
									}}
									order={1}
								>
									<Typography variant='buttons1' color='primary.700'>
										Start Date:
									</Typography>
									<Typography variant='header3' color='blacky.main' ml={2}>
										{selectedCourse.startDate}
									</Typography>
								</Grid>
								<Grid
									item
									xxs={12}
									xs={12}
									s={6}
									sx={{
										display: 'inline-block',
										verticalAlign: 'middle',
										lineHeight: 'normal',
									}}
									order={2}
								>
									<Typography variant='buttons1' color='primary.700'>
										End Date:
									</Typography>
									<Typography variant='header3' color='blacky.main' ml={2}>
										{selectedCourse.endDate}
									</Typography>
								</Grid>
								<Grid
									item
									xxs={12}
									xs={12}
									sx={{
										display: 'inline-block',
										verticalAlign: 'middle',
										lineHeight: 'normal',
									}}
									order={3}
								>
									<Typography variant='buttons1' color='primary.700'>
										Description:
									</Typography>
									<Typography variant='header3' color='blacky.main' ml={2}>
										{selectedCourse.description}
									</Typography>
								</Grid>
								<Grid
									item
									xs={12}
									s={12}
									sm={12}
									md={6}
									sx={{
										display: 'flex',
										alignItems: 'center',
									}}
									order={4}
								>
									<Typography variant='buttons1' color='primary.700'>
										List of Students:
									</Typography>
								</Grid>
								<Grid
									item
									xs={12}
									s={12}
									sm={12}
									md={6}
									sx={{
										display: 'flex',
										alignItems: 'center',
									}}
									order={{ xxs: 6, xs: 6, s: 6, sm: 6, md: 5 }}
								>
									<Typography variant='buttons1' color='primary.700'>
										Join Requests:
									</Typography>
								</Grid>
								<Grid
									item
									xs={12}
									s={12}
									sm={12}
									md={6}
									sx={{
										display: 'flex',
										alignItems: 'center',
									}}
									order={{ xxs: 5, xs: 5, s: 5, sm: 5, md: 6 }}
								>
									{courseStudents.length > 0 ? (
										<Box height='100%' width='100%'>
											<DataGrid
												rowHeight={40}
												columnVisibilityModel={{
													id: false,
												}}
												rows={courseStudents}
												columns={columns}
												initialState={{
													pagination: {
														paginationModel: { page: 0, pageSize: 10 },
													},
												}}
												pageSizeOptions={[5, 10]}
												getRowSpacing={(params) => ({
													top: params.isFirstVisible ? 0 : 5,
													bottom: params.isLastVisible ? 0 : 5,
												})}
												getRowId={(row) => row.id}
												rowsPerPageOptions={[10, 20]}
												disableColumnSelector={true}
												sx={{
													display: 'flex',

													boxShadow: 0,
													border: 'none',
													'& .MuiDataGrid-cellContent': {
														color: 'blacky.main',
														fontFamily: 'Lato',
														fontSize: '0.8rem',
														'@media (min-width:306px)': {
															fontSize: '0.8rem',
														},
														'@media (min-width:412px)': {
															fontSize: '0.8rem',
														},
														'@media (min-width:512px)': {
															fontSize: '0.9rem',
														},
														'@media (min-width:644px)': {
															fontSize: '1.0rem',
														},
														'@media (min-width:900px)': {
															fontSize: '1.1rem',
														},
													},
													'& .MuiDataGrid-columnHeader': {
														color: 'blacky.main',
														borderBottom: 3,
													},
													'& .MuiDataGrid-columnHeaderTitle': {
														fontFamily: 'Lato',
														fontWeight: 700,
														fontSize: '0.7rem',
														'@media (min-width:306px)': {
															fontSize: '1.0rem',
														},
														'@media (min-width:412px)': {
															fontSize: '1.1rem',
														},
														'@media (min-width:644px)': {
															fontSize: '1.2rem',
														},
														'@media (min-width:900px)': {
															fontSize: '1.3rem',
														},
													},
													'& .MuiDataGrid-virtualScroller': {
														color: 'primary.700',
													},
													'& .MuiDataGrid-footerContainer': {
														boxShadow: 0,
														borderBottom: 'none',
													},
												}}
											/>
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
													There are no Students in this Course
												</Typography>
											</Grid>
										</Grid>
									)}
								</Grid>

								<Grid
									item
									xs={12}
									s={12}
									sm={12}
									md={6}
									sx={{
										display: 'flex',
										alignItems: 'center',
									}}
									order={7}
								>
									{courseRequests.length > 0 ? (
										<Box height='100%' width='100%'>
											<DataGrid
												rowHeight={40}
												columnVisibilityModel={{
													id: false,
												}}
												rows={courseRequests}
												columns={requestColumns}
												initialState={{
													pagination: {
														paginationModel: { page: 0, pageSize: 10 },
													},
												}}
												pageSizeOptions={[5, 10]}
												getRowSpacing={(params) => ({
													top: params.isFirstVisible ? 0 : 5,
													bottom: params.isLastVisible ? 0 : 5,
												})}
												getRowId={(row) => row.id}
												rowsPerPageOptions={[10, 20]}
												disableColumnSelector={true}
												sx={{
													display: 'flex',

													boxShadow: 0,
													border: 'none',
													'& .MuiDataGrid-cellContent': {
														color: 'blacky.main',
														fontFamily: 'Lato',
														fontSize: '0.8rem',
														'@media (min-width:306px)': {
															fontSize: '0.8rem',
														},
														'@media (min-width:412px)': {
															fontSize: '0.8rem',
														},
														'@media (min-width:512px)': {
															fontSize: '0.9rem',
														},
														'@media (min-width:644px)': {
															fontSize: '1.0rem',
														},
														'@media (min-width:900px)': {
															fontSize: '1.1rem',
														},
													},
													'& .MuiDataGrid-columnHeader': {
														color: 'blacky.main',
														borderBottom: 3,
													},
													'& .MuiDataGrid-columnHeaderTitle': {
														fontFamily: 'Lato',
														fontWeight: 700,
														fontSize: '0.7rem',
														'@media (min-width:306px)': {
															fontSize: '1.0rem',
														},
														'@media (min-width:412px)': {
															fontSize: '1.1rem',
														},
														'@media (min-width:644px)': {
															fontSize: '1.2rem',
														},
														'@media (min-width:900px)': {
															fontSize: '1.3rem',
														},
													},
													'& .MuiDataGrid-virtualScroller': {
														color: 'primary.700',
													},
													'& .MuiDataGrid-footerContainer': {
														boxShadow: 0,
														borderBottom: 'none',
													},
												}}
											/>
										</Box>
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
													There are no Join Requests in this Course
												</Typography>
											</Grid>
										</Grid>
									)}
								</Grid>
							</Grid>
						</Box>
					</Card>
				</Box>
				<VerifyEmailDialog
					open={openVerifyEmail}
					handleClose={handleCloseVerifyEmail}
				/>

				<CreateCourseDialog
					open={openCreateCourseDialog}
					handleClose={() => setOpenCreateCourseDialog(false)}
				/>
			</Box>
		</main>
	);
}
