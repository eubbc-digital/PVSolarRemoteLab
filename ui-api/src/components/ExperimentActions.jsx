/*Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Andres Gamboa, Alex Villazon*/

import { Box, IconButton, Typography, Grid } from '@mui/material';
import { Close, Launch } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
export default function ExperimentActions({
	params,
	handleClose,
	setExperiment,
}) {
	const deleteExperiment = async () => {
		const response = await fetch(`/solar-lab/api/experiments/delete`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({ id: params.id }),
		});
		const deleted = await response.json();
		if (deleted.error) {
			toast.error("'Something Went Wrong, Please Try Again Later'");
		} else {
			toast.success('Deleted Successfully!');
			if (
				window.localStorage.getItem('EXPERIMENT') &&
				JSON.parse(window.localStorage.getItem('EXPERIMENT')).id == params.id
			) {
				window.localStorage.removeItem('EXPERIMENT');
			}

			handleClose();
		}
	};

	const loadExperiment = async () => {
		const request = await fetch(`/solar-lab/api/experiments/readid`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({ id: params.id }),
		});
		const response = await request.json();
		if (!response.status) {
			toast.error("'Something Went Wrong, Please Try Again Later'");
		} else {
			setExperiment(response.experiment);
			handleClose();
		}
	};
	const openExperiment = async () => {
		await loadExperiment();
	};
	return (
		<Box>
			<Grid container>
				<Grid
					item
					mr={{ xxs: 0, xs: 0, s: 1, sm: 4 }}
					sx={{
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<IconButton
						onClick={openExperiment}
						sx={{
							color: 'secondary.main',
						}}
					>
						<Launch
							sx={{
								fontSize: { xxs: '16px', xs: '20px', sm: '30px' },
							}}
						/>
					</IconButton>
					<Typography color='blacky.main'>Open</Typography>
				</Grid>
				<Grid
					onClick={deleteExperiment}
					item
					sx={{
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<IconButton
						sx={{
							color: 'secondary.main',
						}}
					>
						<Close
							sx={{
								fontSize: { xxs: '20px', xs: '24px', sm: '30px' },
							}}
						/>
					</IconButton>
					<Typography color='blacky.main'>Delete</Typography>
				</Grid>
			</Grid>
		</Box>
	);
}
