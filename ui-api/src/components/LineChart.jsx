import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { useState, useEffect } from 'react';
import { Typography, Box, Grid } from '@mui/material';

export default function LineChart({
	chartData,
	minimize,
	names,
	selectedActivity,
}) {
	const [data, setData] = useState({ datasets: [] });
	const [colors, setColors] = useState([
		'#F3D646',
		'#CB971D',
		'#01596D',
		'#01306D',
		'#001D44',
		'#600049',
		'#173F5F',
		'#20639B',
		'#3CAEA3',
		'#F6D55C',
		'#ED553B',
		'#9CFFFA',
	]);
	useEffect(() => {
		setData({
			datasets: getDatasets(),
		});
	}, []);

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'bottom',
			},
		},
		scales: {
			y: {
				ticks: {
					// forces step size to be 50 units
					stepSize: 1,
				},
			},
			x: {
				type: 'linear',
				ticks: {
					// forces step size to be 50 units
					stepSize: 5,
				},
			},
		},
	};

	const getColor = (name) => {
		if (name === 'Cochabamba') {
			return '#F6BD2B';
		} else if (name === 'La Paz') {
			return '#3E55A2';
		} else {
			return '#1E4B09';
		}
	};

	const getDatasets = () => {
		var datasets = [];
		for (let i = 0; i < chartData.length; i++) {
			if (chartData[0]) {
				if (chartData[i].length > 0) {
					let color = getColor(names[i]);
					if (selectedActivity > 1 && selectedActivity < 5) {
						color = colors[i % 12];
					}
					const dataset = {
						label: names[i],
						data: chartData[i].map((data) => {
							return { x: data.voltage, y: data.current };
						}),
						backgroundColor: [color],
						borderColor: color,
						cubicInterpolationMode: 'monotone',
						borderWidth: 3,
						showLine: true,
					};
					datasets.push(dataset);
				}
			}
		}
		return datasets;
	};

	return (
		<Grid container justify='center'>
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
						width: '100%',
						'@media (min-width:900px)': {
							height: '32vh',
						},
						'@media (min-width:1100px)': {
							height: '32vh',
						},
						height: '23vh',
					}}
				>
					<Line data={data} options={options}></Line>
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
				<Typography variant='header3' color='blacky.main'>
					X: Voltage (V)
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
				<Typography variant='header3' color='blacky.main'>
					Y: Current (A)
				</Typography>
			</Grid>
		</Grid>
	);
}
