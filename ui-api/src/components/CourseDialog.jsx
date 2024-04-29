/*Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Andres Gamboa, Alex Villazon*/

import {
	Box,
	Dialog,
	Grid,
	TextField,
	Typography,
	Button,
	IconButton,
} from '@mui/material';
import { Send } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import BlockIcon from '@mui/icons-material/Block';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CircularProgress from '@mui/material/CircularProgress';

export default function CoursesDialog({ open, handleClose, user }) {
	const [loading, setLoading] = React.useState(false);
	const { data: session, status } = useSession();
	const [studentCourses, setStudentCourses] = useState([]);
	const [availableCourses, setAvailableCourses] = useState([]);
	const [studentRequests, setStudentRequests] = useState([]);
	const [reRender, setReRender] = useState(false);

	const requestToJoin = async (params) => {
		setLoading(true);
		const response = await fetch(`/solar-lab/api/request/create`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({ courseId: params.id, email: session.user.email }),
		});
		const answer = await response.json();
		setLoading(false);
		if (!answer.status) {
			toast.error("'Something Went Wrong, Please Try Again Later'");
		} else {
			toast.success('Request Sent Successfully!');
			setReRender(!reRender);
		}
	};

	const loadStudentCourses = async () => {
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
	};
	const loadAvailableCourses = async () => {
		const response = await fetch(`/solar-lab/api/courses/readnotcontains`, {
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
			setAvailableCourses(answer.courses);
		}
	};
	const loadStudentRequests = async () => {
		const response = await fetch(`/solar-lab/api/request/readfiltered`, {
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
			setStudentRequests(answer.requests);
		}
	};

	useEffect(() => {
		if (session) {
			loadStudentCourses();
			loadAvailableCourses();
			loadStudentRequests();
		}
	}, [open, reRender]);

	const columns = [
		{ field: 'id', headerName: 'ID', width: 70 },
		{
			field: 'name',
			headerName: 'Name',
			minWidth: 185,
		},
		{
			field: 'teacherId',
			headerName: 'Teacher',
			minWidth: 170,
			valueGetter: (params) => params.row?.teacher?.user?.name,
		},
		{
			field: 'startDate',
			headerName: 'Start Date',
			minWidth: 110,
		},
		{
			field: 'actions',
			headerName: 'Status',
			minWidth: 180,
			renderCell: (params) => {
				var checkRequest;
				studentRequests.forEach((request) => {
					if (request.courseId == params.id) {
						checkRequest = request;
					}
				});

				if (checkRequest) {
					return (
						<Box>
							<Grid container>
								{checkRequest.status == 'Pending' ? (
									<Grid
										item
										sx={{
											display: 'flex',
											alignItems: 'center',
										}}
										ml={1}
									>
										<HourglassTopIcon
											sx={{
												fontSize: { xxs: '20px', xs: '24px', sm: '30px' },
												color: '#F6BD2B',
											}}
										/>
										<Typography color='blacky.main' ml={1}>
											{checkRequest.status}
										</Typography>
									</Grid>
								) : (
									<Grid
										item
										sx={{
											display: 'flex',
											alignItems: 'center',
										}}
										ml={1}
									>
										<BlockIcon
											sx={{
												fontSize: { xxs: '20px', xs: '24px', sm: '30px' },
												color: '#DF2E21',
											}}
										/>
										<Typography color='blacky.main' ml={1}>
											{checkRequest.status}
										</Typography>
									</Grid>
								)}
							</Grid>
						</Box>
					);
				} else {
					return (
						<Box>
							<Grid container>
								<Grid
									onClick={() => {
										requestToJoin(params);
									}}
									item
									sx={{
										display: 'flex',
										alignItems: 'center',
										cursor: 'pointer',
									}}
								>
									<IconButton
										sx={{
											color: 'primary.700',
										}}
									>
										{loading ? (
											<CircularProgress
												size={24}
												sx={{
													color: 'secondary.main',
												}}
											/>
										) : (
											<Send
												sx={{
													fontSize: { xxs: '20px', xs: '24px', sm: '30px' },
												}}
											/>
										)}
									</IconButton>
									<Typography color='blacky.main'>Request To Join</Typography>
								</Grid>
							</Grid>
						</Box>
					);
				}
			},
		},
	];

	const columnsStudentCourses = [
		{ field: 'id', headerName: 'ID', width: 70 },
		{
			field: 'name',
			headerName: 'Name',
			minWidth: 185,
		},
		{
			field: 'teacherId',
			headerName: 'Teacher',
			minWidth: 170,
			valueGetter: (params) => params.row?.teacher?.user?.name,
		},
	];

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			PaperProps={{
				sx: {
					borderRadius: '24px',
					maxWidth: '100%',
				},
			}}
		>
			<Box
				m={{ xxs: 3, xs: 4, sm: 5 }}
				sx={{
					alignItems: 'center',
				}}
			>
				<Grid container justifyContent='center' rowSpacing={2}>
					<Grid item>
						<Typography variant='header1' color='secondary'>
							Solar{' '}
						</Typography>
						<Typography variant='header1' color='primary.700'>
							Remote Lab
						</Typography>
					</Grid>

					<Grid item xxs={12} xs={12}>
						<Typography variant='header2'>My Courses:</Typography>
					</Grid>
					{studentCourses.length > 0 ? (
						<Box height='80%' width='100%' mt={{ xxs: 1, xs: 1, s: 2, sm: 2 }}>
							<DataGrid
								rowHeight={40}
								columnVisibilityModel={{
									id: false,
								}}
								rows={studentCourses}
								columns={columnsStudentCourses}
								initialState={{
									pagination: {
										paginationModel: { page: 0, pageSize: 5 },
									},
								}}
								pageSizeOptions={[5, 10]}
								getRowSpacing={(params) => ({
									top: params.isFirstVisible ? 0 : 5,
									bottom: params.isLastVisible ? 0 : 5,
								})}
								getRowId={(row) => row.id}
								rowsPerPageOptions={[5, 10, 20]}
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
									You are not member of any course
								</Typography>
							</Grid>
						</Grid>
					)}
				</Grid>
				<Grid item xxs={12} xs={12} mt={1}>
					<Typography variant='header2'>Available Courses:</Typography>
				</Grid>
				{availableCourses.length > 0 ? (
					<Box height='80%' width='100%' mt={{ xxs: 1, xs: 1, s: 2, sm: 2 }}>
						<DataGrid
							rowHeight={40}
							disableColumnSelector={true}
							columnVisibilityModel={{
								id: false,
							}}
							rows={availableCourses}
							columns={columns}
							initialState={{
								pagination: {
									paginationModel: { page: 0, pageSize: 5 },
								},
							}}
							pageSizeOptions={[5, 10]}
							getRowSpacing={(params) => ({
								top: params.isFirstVisible ? 0 : 5,
								bottom: params.isLastVisible ? 0 : 5,
							})}
							getRowId={(row) => row.id}
							rowsPerPageOptions={[5, 10, 20]}
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
								There are no available courses to join
							</Typography>
						</Grid>
					</Grid>
				)}
			</Box>
		</Dialog>
	);
}
