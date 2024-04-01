import { Grid, Typography, Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import 'react-circular-progressbar/dist/styles.css';

const gridDataStyle = {
	display: 'inline-block',
	verticalAlign: 'middle',
	lineHeight: 'normal',
};

export default function ShowDepartamentData({ departmentData, name }) {
	const [angle, setAngle] = useState(0);
	const [radiation, setRadiation] = useState(0);

	const [power, setPower] = useState(0);
	const [uvaRadiation, setUvaRadiation] = useState(0);
	const [temperature, setTemperature] = useState(0);
	const [optimalAngle, setOptimalAngle] = useState(0);
	const [pvEfficiency, setPVEfficiency] = useState(0);
	const [time, setTime] = useState('');
	const [date, setDate] = useState('');
	const [timezone, setTimezone] = useState('America/La_Paz');
	useEffect(() => {
		departmentData.forEach((department) => {
			if (department.departmentName === name) {
				setAngle(department.panelangle);
				setPower(department.power);
				setUvaRadiation(department.uvaRadiation);
				setRadiation(department.radiation);
				setDate(department.experimentDate);
				setTime(department.experimentTime);
				setTimezone(department.timeZone);
				setOptimalAngle(department.optimalAngle);
				setPVEfficiency(department.efficiencyPorcentaje);
				setTemperature(department.temperature);
			}
		});
	}, []);
	return (
		<Grid
			container
			rowSpacing={{ xxs: 1, xs: 1, s: 2, sm: 2 }}
			columnSpacing={2}
		>
			<Grid
				item
				xxs={12}
				xs={12}
				sx={{
					display: 'flex',
					alignItems: 'center',
				}}
				justifyContent={'left'}
			>
				<Typography variant='header12' color='blacky.main'>
					{name}
				</Typography>
			</Grid>
			<Grid
				item
				xxs={12}
				xs={12}
				s={12}
				sm={6}
				md={4}
				sx={{ gridDataStyle }}
				mb={{ xxs: 0, xs: 0, s: 0, sm: 1 }}
			>
				<Typography variant='titleDialog' color='primary.700'>
					PV Efficiency:
				</Typography>
				<Typography
					ml={{ xxs: 1, xs: 1, sm: 2 }}
					variant='dataDialog'
					color='blacky.main'
				>
					{pvEfficiency} %
				</Typography>
			</Grid>
			<Grid
				item
				xxs={12}
				xs={12}
				s={12}
				sm={6}
				md={4}
				sx={{ gridDataStyle }}
				mb={{ xxs: 0, xs: 0, s: 0, sm: 1 }}
			>
				<Typography variant='titleDialog' color='primary.700'>
					Maximum Power:
				</Typography>
				<Typography
					ml={{ xxs: 1, xs: 1, sm: 2 }}
					variant='dataDialog'
					color='blacky.main'
				>
					{power} W
				</Typography>
			</Grid>
			<Grid
				item
				xxs={12}
				xs={12}
				s={12}
				sm={6}
				md={4}
				sx={{ gridDataStyle }}
				mb={{ xxs: 0, xs: 0, s: 0, sm: 1 }}
			>
				<Typography variant='titleDialog' color='primary.700'>
					Optimal Angle:
				</Typography>
				<Typography
					ml={{ xxs: 1, xs: 1, sm: 2 }}
					variant='dataDialog'
					color='blacky.main'
				>
					{optimalAngle} °
				</Typography>
			</Grid>

			<Grid
				item
				xxs={12}
				xs={12}
				s={12}
				sm={6}
				md={4}
				sx={{ gridDataStyle }}
				mb={{ xxs: 0, xs: 0, s: 0, sm: 1 }}
			>
				<Typography variant='titleDialog' color='primary.700'>
					UVA Radiation:
				</Typography>
				<Typography
					ml={{ xxs: 1, xs: 1, sm: 2 }}
					variant='dataDialog'
					color='blacky.main'
				>
					{uvaRadiation} W/m2
				</Typography>
			</Grid>
			<Grid
				item
				xxs={12}
				xs={12}
				s={12}
				sm={6}
				md={4}
				sx={{ gridDataStyle }}
				mb={{ xxs: 0, xs: 0, s: 0, sm: 1 }}
			>
				<Typography variant='titleDialog' color='primary.700'>
					Radiation:
				</Typography>
				<Typography
					ml={{ xxs: 1, xs: 1, sm: 2 }}
					variant='dataDialog'
					color='blacky.main'
				>
					{radiation} W/m2
				</Typography>
			</Grid>
			<Grid item xxs={12} xs={12} s={12} sm={12} md={4} sx={{ gridDataStyle }}>
				<Typography variant='titleDialog' color='primary.700'>
					Panel Angle:
				</Typography>
				<Typography
					ml={{ xxs: 1, xs: 1, sm: 1 }}
					variant='dataDialog'
					color='blacky.main'
				>
					{angle} °
				</Typography>
			</Grid>
			<Grid item xxs={12} xs={12} s={12} sm={12} md={12} sx={{ gridDataStyle }}>
				<Typography variant='titleDialog' color='primary.700'>
					Panel Temperature:
				</Typography>
				<Typography
					ml={{ xxs: 1, xs: 1, sm: 1 }}
					variant='dataDialog'
					color='blacky.main'
				>
					{temperature} °
				</Typography>
			</Grid>
		</Grid>
	);
}
