import { Typography, Box } from '@mui/material';
export default function CitiesTypography() {
	return (
		<Box>
			<Typography
				variant='header2'
				color='primary.700'
				sx={{
					display: 'flex',

					'@media (min-width:960px)': {
						display: 'none',
					},
				}}
			>
				Cities:
			</Typography>
			<Typography
				variant='header2'
				color='primary.700'
				sx={{
					display: 'none',

					'@media (min-width:960px)': {
						display: 'flex',
					},
				}}
			>
				Cities to Display:
			</Typography>
		</Box>
	);
}
