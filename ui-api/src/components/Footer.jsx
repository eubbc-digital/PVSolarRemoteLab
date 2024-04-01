import { Grid, Box, Typography } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

export default function Footer() {
	return (
		<Box py={{ xxs: '8px', xs: '8px' }} mb={1}>
			<Grid
				container
				justify='center'
				sx={{
					height: '80px',
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<Grid
					item
					xxs={12}
					xs={12}
					sx={{
						display: 'flex',
						alignItems: 'left',
						textAlign: 'center',
					}}
					justifyContent='center'
				>
					<Image
						priority={true}
						src='/solar-lab/erasmus.jpg'
						alt='Erasmus Logo'
						width={200}
						height={57}
					/>
				</Grid>
				<Grid
					item
					xxs={12}
					xs={12}
					sx={{
						display: 'flex',
						alignItems: 'left',
						textAlign: 'center',
					}}
					justifyContent='center'
				>
					<Typography>
						<strong>UPB</strong> - Copyright © 2023
					</Typography>
				</Grid>
			</Grid>
		</Box>
	);
}
