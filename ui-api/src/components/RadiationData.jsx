import React, { useEffect, useState } from 'react';
import { Typography, Box, IconButton, Popover } from '@mui/material';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import RadiationChart from './RadiationChart';
export default function RadiationData({ name, value, radiationType }) {
	const [anchorElRadiation, setAnchorElRadiation] = React.useState(null);
	const [sensorRadiation, setSensorRadiation] = useState('');
	const [radiation, setRadiation] = useState(value);
	const open = Boolean(anchorElRadiation);

	const handleClickRadiation = (event) => {
		setAnchorElRadiation(event.currentTarget);
	};

	const handleCloseRadiation = () => {
		setAnchorElRadiation(null);
	};

	useEffect(() => {
		if (name == 'Cochabamba') {
			if (radiationType == 'UVA') {
				setSensorRadiation('uvaRadiationLPAvg');
			} else {
				setSensorRadiation('solarRadiationCMPAvg');
			}
		} else {
			if (radiationType == 'UVA') {
				setSensorRadiation('uvaRadiationSU202Avg');
			} else {
				setSensorRadiation('solarRadiationCS320Avg');
			}
		}
	}, []);

	useEffect(() => {
		const timerRefresh = setInterval(() => {
			setRadiation(value);
		}, 1000);

		return () => clearTimeout(timerRefresh);
	}, [radiation]);

	return (
		<Box>
			<Typography variant='titleDepartment' color='primary.700'>
				Actual Radiation:
			</Typography>
			<Typography ml={1} variant='dataDepartment' color='blacky.main'>
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
					type={sensorRadiation}
				></RadiationChart>
			</Popover>
		</Box>
	);
}
