import { Line } from 'react-chartjs-2';
import { Typography, Box, Grid, AppBar, Tabs, Tab } from '@mui/material';
import { Chart as ChartJS } from 'chart.js/auto';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import Image from 'next/image';

function TabPanel(props) {
	const { children, value, index } = props;

	return (
		<div role='tabpanel' hidden={value !== index}>
			{value === index && (
				<Box p={3} pt={0}>
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

export default function RadiationChart({ title, city, type }) {
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	const [loadedData, setLoadedData] = useState(false);
	const [loadedSeasonalData, setLoadedSeasonalData] = useState(false);
	const [todayData, setTodayData] = useState([]);
	const [seasonalData, setSeasonalData] = useState([]);
	const [grafanaLink, setGrafanaLink] = useState([]);

	useEffect(() => {
		//envvariable
		setGrafanaLink(
			'http://research.upb.edu:8000/d/BFHsoFzIz/upb-remote-solar-lab?orgId=1&from=now-2d&to=now'
		);

		loadTodayData();
		loadSeasonalData();
	}, []);

	const loadTodayData = async () => {
		let data = [];
		let todayData = [];
		const todayDate = new Date(
			new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000
		)
			.toISOString()
			.split('T')[0];
		const optimalDate = getOptimalDate(todayDate);
		const dates = [
			{
				name: 'Today',
				date: todayDate,
			},
			{
				name: 'Optimal',
				date: optimalDate,
			},
		];
		for (const date of dates) {
			const request = await fetch(`/solar-lab/api/datalogger/readfiltered`, {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify({ date: date.date, city: city }),
			});
			const response = await request.json();
			if (response.status) {
				if (response.data.length > 0) {
					data.push(response.data);
					if (date.name == 'Today') {
						todayData = response.data;
					}
				} else {
					data.push(todayData);
				}
			}
		}
		setTodayData({
			labels: getLabels(data),
			datasets: getDatasets(data, dates),
		});
		setLoadedData(true);
	};

	const loadSeasonalData = async () => {
		let data = [];
		const seasons = [
			{
				name: 'Spring',
				date: new Date('11/30/2022').toISOString().split('T')[0],
			},
			{
				name: 'Summer',
				date: new Date('02/28/2023').toISOString().split('T')[0],
			},
			{
				name: 'Autumn',
				date: new Date('05/21/2023').toISOString().split('T')[0],
			},
			{
				name: 'Winter',
				date: new Date('09/09/2023').toISOString().split('T')[0],
			},
		];
		for (const season of seasons) {
			const request = await fetch(`/solar-lab/api/datalogger/readfiltered`, {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify({ date: season.date, city: city }),
			});
			const response = await request.json();
			if (response.status) {
				if (response.data.length > 0) {
					data.push(response.data);
				}
			}
		}
		setSeasonalData({
			labels: getLabels(data),
			datasets: getSeasonalDatasets(data, seasons),
		});
		setLoadedSeasonalData(true);
	};

	const getOptimalDate = (todayDate) => {
		if (
			dayjs(todayDate).isAfter('3/20/2023') &&
			dayjs(todayDate).isBefore('6/21/2023')
		) {
			return new Date('5/21/2023').toISOString().split('T')[0];
		} else if (
			dayjs(todayDate).isAfter('6/20/2023') &&
			dayjs(todayDate).isBefore('9/21/2023')
		) {
			return new Date('09/09/2023').toISOString().split('T')[0];
		} else if (
			dayjs(todayDate).isAfter('9/20/2023') &&
			dayjs(todayDate).isBefore('12/21/2023')
		) {
			return new Date('11/30/2022').toISOString().split('T')[0];
		} else {
			return new Date('2/28/2023').toISOString().split('T')[0];
		}
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'right',
				labels: { boxWidth: 10 },
			},
		},
		scales: {
			x: {
				grid: {
					display: false,
				},
			},
			y: {
				grid: {
					display: false,
				},
				min: 0,
				max: 1500,
			},
		},
	};

	const UVAOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'right',
				labels: { boxWidth: 10 },
			},
		},
		scales: {
			x: {
				grid: {
					display: false,
				},
			},
			y: {
				min: 0,
				max: 100,
				grid: {
					display: false,
				},
			},
		},
	};

	const getOptions = () => {
		if (type == 'solarRadiationCMPAvg' || type == 'solarRadiationCS320Avg') {
			return options;
		} else {
			return UVAOptions;
		}
	};

	const getDatasets = (data, dates) => {
		var datasets = [];
		for (let i = 0; i < data.length; i++) {
			if (data[i].length > 0) {
				const dataset = {
					label: dates[i].name,
					data: data[i].map((data) => data[type]),
					backgroundColor: getTodayColor(dates[i].name),
					borderColor: getTodayColor(dates[i].name),
					cubicInterpolationMode: 'monotone',
					pointStyle: 'circle',
					borderWidth: 1,
					pointRadius: 1,
					pointHoverRadius: 5,
				};
				datasets.push(dataset);
			}
		}
		return datasets;
	};

	const getTodayColor = (name) => {
		var color;
		if (name === 'Today') {
			color = '#000000';
		} else {
			color = '#b30000';
		}
		return color;
	};

	const getSeasonalDatasets = (data, seasons) => {
		var datasets = [];
		for (let i = 0; i < data.length; i++) {
			if (data[i].length > 0) {
				const dataset = {
					label: seasons[i].name,
					data: data[i].map((data) => data[type]),
					backgroundColor: getColor(seasons[i].name),
					borderColor: getColor(seasons[i].name),
					cubicInterpolationMode: 'monotone',
					pointStyle: 'circle',
					borderWidth: 1,
					pointRadius: 1,
					pointHoverRadius: 5,
				};
				datasets.push(dataset);
			}
		}
		return datasets;
	};

	const getColor = (season) => {
		var color;
		if (season === 'Winter') {
			color = '#1aa3ff';
		} else if (season === 'Spring') {
			color = '#00e600';
		} else if (season === 'Summer') {
			color = '#ffd11a';
		} else {
			color = '#b37700';
		}
		return color;
	};

	const getLabels = (data) => {
		if (data.length == 1) {
			return data[0].map(
				(data) =>
					data.datetime.split(' ')[1].split('.')[0].split(':')[0] + //to just display HH:00
					':' +
					data.datetime.split(' ')[1].split('.')[0].split(':')[1]
			);
		} else if (data.length > 1) {
			return data[1].map(
				(data) =>
					data.datetime.split(' ')[1].split('.')[0].split(':')[0] + //to just display HH:00
					':' +
					data.datetime.split(' ')[1].split('.')[0].split(':')[1]
			);
		} else {
			return [];
		}
	};

	return (
		<Box
			sx={{
				flexGrow: 1,
				bgcolor: 'background.paper',
				display: 'flex',
				maxWidth: '46vh',
			}}
		>
			<AppBar position='static' color='white'>
				<Tabs
					variant='scrollable'
					scrollButtons='auto'
					value={value}
					onChange={handleChange}
					textColor='secondary'
					indicatorColor='secondary'
					allowScrollButtonsMobile
				>
					<Tab
						label='24 Hrs'
						sx={{
							textTransform: 'none',
						}}
					/>
					<Tab
						label='Seasonal'
						sx={{
							textTransform: 'none',
						}}
					/>
					<Tab
						label='Historic'
						sx={{
							textTransform: 'none',
						}}
					/>
				</Tabs>
				<TabPanel value={value} index={0}>
					<Grid container rowSpacing={1}>
						<Grid
							item
							xxs={12}
							xs={12}
							mt={2}
							sx={{
								display: 'flex',
								alignItems: 'center',
							}}
							justifyContent='center'
						>
							<Typography variant='titleDepartment' color='primary.700'>
								24 Hrs {title}
							</Typography>
						</Grid>
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
							<Box
								sx={{
									width: '26vh',
									height: '18vh',
									'@media (min-width:300px)': {
										width: '31vh',
										height: '22vh',
									},
									'@media (min-width:400px)': {
										width: '36vh',
										height: '26vh',
									},
									'@media (min-width:570px)': {
										width: '41vh',
										height: '32vh',
									},
								}}
							>
								{loadedData ? (
									<Line data={todayData} options={getOptions()}></Line>
								) : null}
							</Box>
						</Grid>
						<Grid
							item
							xxs={6}
							xs={6}
							sx={{
								display: 'flex',
							}}
							justifyContent='center'
						>
							<Typography variant='body3' color='blacky.main'>
								X: Time (HH:MM)
							</Typography>
						</Grid>
						<Grid
							item
							xxs={6}
							xs={6}
							sx={{
								display: 'flex',
							}}
							justifyContent='center'
						>
							<Typography variant='body3' color='blacky.main'>
								Y: Radiation (W/m2)
							</Typography>
						</Grid>
					</Grid>
				</TabPanel>
				<TabPanel value={value} index={1}>
					<Grid container rowSpacing={1}>
						<Grid
							item
							xxs={12}
							xs={12}
							mt={2}
							sx={{
								display: 'flex',
								alignItems: 'center',
							}}
							justifyContent='center'
						>
							<Typography variant='titleDepartment' color='primary.700'>
								Optimal {title} by Seasons
							</Typography>
						</Grid>
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
							<Box
								sx={{
									width: '26vh',
									height: '18vh',
									'@media (min-width:300px)': {
										width: '31vh',
										height: '22vh',
									},
									'@media (min-width:400px)': {
										width: '36vh',
										height: '26vh',
									},
									'@media (min-width:570px)': {
										width: '41vh',
										height: '32vh',
									},
								}}
							>
								{loadedSeasonalData ? (
									<Line data={seasonalData} options={getOptions()}></Line>
								) : null}
							</Box>
						</Grid>
						<Grid
							item
							xxs={6}
							xs={6}
							sx={{
								display: 'flex',
							}}
							justifyContent='center'
						>
							<Typography variant='body3' color='blacky.main'>
								X: Time (HH:MM)
							</Typography>
						</Grid>
						<Grid
							item
							xxs={6}
							xs={6}
							sx={{
								display: 'flex',
							}}
							justifyContent='center'
						>
							<Typography variant='body3' color='blacky.main'>
								Y: Radiation (W/m2)
							</Typography>
						</Grid>
					</Grid>
				</TabPanel>
				<TabPanel value={value} index={2}>
					<Grid container rowSpacing={1}>
						<Grid
							item
							xxs={12}
							xs={12}
							mt={2}
							sx={{
								display: 'flex',
								alignItems: 'center',
							}}
							justifyContent='center'
						>
							<Typography variant='titleDepartment' color='primary.700'>
								Historic Data
							</Typography>
						</Grid>

						<Grid
							item
							xxs={12}
							xs={12}
							mb={1}
							sx={{
								display: 'flex',
							}}
							justifyContent='center'
						>
							<Typography variant='body3' color='blacky.main'>
								If you want to interact with our historic data, click the image
								below!
							</Typography>
						</Grid>
						<Grid
							item
							xxs={12}
							xs={12}
							mb={2}
							sx={{
								display: 'flex',
								alignItems: 'center',
							}}
							justifyContent='center'
						>
							<Image
								onClick={() => window.open(grafanaLink, '_blank')}
								src='/solar-lab/grafana2.png'
								alt='Historic Data'
								width={360}
								height={264}
								style={{ cursor: 'pointer' }}
							/>
						</Grid>
					</Grid>
				</TabPanel>
			</AppBar>
		</Box>
	);
}
