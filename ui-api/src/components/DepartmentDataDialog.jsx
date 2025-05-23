/*Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Andres Gamboa, Alex Villazon*/

import { Grid, Typography, Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
const gridDataStyle = {
	display: 'inline-block',
	verticalAlign: 'middle',
	lineHeight: 'normal',
};

export default function DepartmentDataDialog({ activity }) {
	const [angle, setAngle] = useState(0);
	const [radiation, setRadiation] = useState(0);
	const [power, setPower] = useState(0);
	const [uvaRadiation, setUvaRadiation] = useState(0);
	const [pvEfficiency, setPVEfficiency] = useState(0);
	const [temperature, setTemperature] = useState(0);
	useEffect(() => {
		setAngle(activity.data.panelAngle);
		setPower(activity.data.power);
		setUvaRadiation(activity.data.uvaRadiation);
		setRadiation(activity.data.radiation);
		setPVEfficiency(activity.data.efficiencyPorcentaje);
		setTemperature(activity.data.temperature);
	}, []);
	return (
		<Box>
			{activity.data.radiation || activity.data.temperature ? (
				<Grid container columnSpacing={1} my={2}>
					<Grid item xxs={12} xs={12}>
						<Typography variant='titleDialog' color='secondary.main'>
							{activity.departmentName}
						</Typography>
					</Grid>

					<Grid
						item
						sx={{ gridDataStyle }}
						xxs={12}
						xs={6}
						s={6}
						sm={6}
						md={4}
						mt={{ xxs: 1, xs: 1, sm: 2 }}
					>
						<Typography variant='buttonsExperiments' color='primary.700'>
							Radiation:
						</Typography>
						<Typography
							ml={{ xxs: 1, xs: 1, sm: 1 }}
							variant='body3'
							color='blacky.main'
						>
							{radiation} W/m2
						</Typography>
					</Grid>
					<Grid
						item
						xxs={12}
						xs={6}
						s={6}
						sm={6}
						md={4}
						sx={{ gridDataStyle }}
						mt={{ xxs: 1, xs: 1, sm: 2 }}
					>
						<Typography variant='buttonsExperiments' color='primary.700'>
							UVA:
						</Typography>
						<Typography
							ml={{ xxs: 1, xs: 1, sm: 1 }}
							variant='body3'
							color='blacky.main'
						>
							{uvaRadiation} W/m2
						</Typography>
					</Grid>
					<Grid
						item
						sx={{ gridDataStyle }}
						xxs={12}
						xs={6}
						sm={6}
						md={4}
						mt={{ xxs: 1, xs: 1, sm: 2 }}
					>
						<Typography variant='buttonsExperiments' color='primary.700'>
							Panel Temperature:
						</Typography>
						<Typography
							ml={{ xxs: 1, xs: 1, sm: 1 }}
							variant='body3'
							color='blacky.main'
						>
							{temperature} °C
						</Typography>
					</Grid>
					{activity.data.activityNumber == 1 ? (
						<Grid
							item
							xxs={12}
							xs={6}
							s={6}
							sm={6}
							md={4}
							sx={{ gridDataStyle }}
							mt={{ xxs: 1, xs: 1, sm: 2 }}
						>
							<Typography variant='buttonsExperiments' color='primary.700'>
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
					) : null}
					{activity.data.activityNumber == 1 ? (
						<Grid
							item
							xxs={12}
							xs={6}
							s={6}
							sm={6}
							md={4}
							sx={{ gridDataStyle }}
							mt={{ xxs: 1, xs: 1, sm: 2 }}
						>
							<Typography variant='buttonsExperiments' color='primary.700'>
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
					) : null}

					{activity.data.activityNumber == 1 ? (
						<Grid
							item
							xxs={12}
							xs={6}
							s={6}
							sm={6}
							md={4}
							sx={{ gridDataStyle }}
							mt={{ xxs: 1, xs: 1, sm: 2 }}
						>
							<Typography variant='buttonsExperiments' color='primary.700'>
								PV Efficiency:
							</Typography>
							<Typography
								ml={{ xxs: 1, xs: 1, sm: 1 }}
								variant='dataDialog'
								color='blacky.main'
							>
								{pvEfficiency} %
							</Typography>
						</Grid>
					) : null}
				</Grid>
			) : null}
		</Box>
	);
}
