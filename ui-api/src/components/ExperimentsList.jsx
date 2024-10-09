/*Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Andres Gamboa, Alex Villazon*/

import { Box, Button, Dialog, Grid, Typography, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect } from 'react';
import ExperimentActions from '../components/ExperimentActions';
import { useSession } from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

export default function ExperimentList({
	open,
	handleClose,
	email,
	setExperiment,
	courseId,
}) {
	const columns = [
		{ field: 'id', headerName: 'ID', width: 70 },
		{
			field: 'name',
			headerName: 'Name',
			width: 140,
		},
		{
			field: 'experimentDate',
			headerName: 'Date',
			width: 110,
		},
		{
			field: 'modified',
			headerName: 'Modified',
			width: 110,
			valueFormatter: (params) =>
				new Date(params?.value).toLocaleDateString('en-US'),
		},

		{
			field: 'actions',
			headerName: '',
			type: 'actions',
			width: 250,
			renderCell: (params) => (
				<ExperimentActions
					params={params}
					handleClose={handleClose}
					setExperiment={setExperiment}
				/>
			),
		},
	];

	const columnsMobile = [
		{ field: 'id', headerName: 'ID', width: 70 },
		{
			field: 'name',
			headerName: 'Name',
			width: 110,
		},
		{
			field: 'experimentDate',
			headerName: 'Date',
			width: 95,
		},

		{
			field: 'actions',
			headerName: '',
			type: 'actions',
			width: 185,
			renderCell: (params) => (
				<ExperimentActions
					params={params}
					handleClose={handleClose}
					setExperiment={setExperiment}
				/>
			),
		},
	];

	const [isMobile, setIsMobile] = useState(false);
	const { data: session } = useSession();
	const [experimentsList, setExperimentList] = useState([]);
	//choose the screen size
	const handleResize = () => {
		if (window.innerWidth < 644) {
			setIsMobile(true);
		} else {
			setIsMobile(false);
		}
	};

	const loadData = async () => {
		const response = await fetch(`/solar-lab/api/experiments/readSimple`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({ email: email, courseId: courseId }),
		});
		const experiments = await response.json();
		if (!experiments.status) {
			toast.error('Something Went Wrong, Please Try Again');
		} else {
			setExperimentList(experiments.experiments);
		}
	};

	useEffect(() => {
		handleResize();
		window.addEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		checkSession();
	}, [open]);

	const checkSession = () => {
		if (session) {
			loadData();
		}
	};

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
				my={{ xxs: 3, xs: 3, s: 4, sm: 5 }}
				mx={{ xxs: 3, xs: 4, s: 5, sm: 6 }}
				sx={{
					height: '100%',
					minWidth: '660px',
				}}
			>
				<Grid container>
					<Grid item xxs={12} xs={12} mb={{ xxs: 1, xs: 2, s: 2, sm: 4 }}>
						<Typography variant='header1' color='secondary'>
							Saved{' '}
						</Typography>
						<Typography variant='header1' color='primary.700'>
							Experiments
						</Typography>
					</Grid>
				</Grid>
				<Box height='100%'>
					{isMobile ? (
						<DataGrid
							rowHeight={40}
							disableColumnSelector={true}
							columnVisibilityModel={{
								id: false,
							}}
							rows={experimentsList}
							columns={columnsMobile}
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
								},
								'& .MuiDataGrid-footerContainer': {
									boxShadow: 0,
									borderBottom: 'none',
								},
							}}
						/>
					) : (
						<DataGrid
							rowHeight={40}
							disableColumnSelector={true}
							columnVisibilityModel={{
								id: false,
							}}
							rows={experimentsList}
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
					)}
				</Box>
				<Stack
					direction='row'
					justifyContent='end'
					mt={{ xxs: 1, xs: 1, sm: 3 }}
					mb={1}
				>
					<Button
						color='white'
						variant='contained'
						sx={{
							border: 1,
							textTransform: 'none',
							borderColor: 'primary.700',
						}}
						onClick={() => {
							handleClose();
						}}
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
							Go Back
						</Typography>
					</Button>
				</Stack>
			</Box>
		</Dialog>
	);
}
