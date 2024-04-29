/*Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Andres Gamboa, Alex Villazon*/

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Grid } from '@mui/material';
import { toast } from 'react-toastify';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

export default function Verifyemail() {
	const router = useRouter();
	const [token, setToken] = useState('');
	const [loading, setLoading] = useState(true);
	const [verified, setVerified] = useState(false);
	const [message, setMessage] = useState('Invalid Token, Try Again');

	const verifyUserEmail = async () => {
		try {
			const request = await fetch(`/solar-lab/api/verifyemail`, {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify({ token: token }),
			});
			const response = await request.json();
			setLoading(false);
			if (response.status) {
				setVerified(true);
				setMessage('Verified! Redirecting...');
				router.push('/');
				toast.success('Email Verified!');
			}
		} catch (error) {}
	};
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		setToken(urlParams.get('token') || '');
	}, []);
	useEffect(() => {
		if (token.length > 0) {
			verifyUserEmail();
		}
	}, [token]);

	return (
		<div>
			{loading ? (
				<Grid
					container
					justify='center'
					rowSpacing={{ xxs: 1, xs: 1, s: 1, sm: 2, md: 2 }}
					sx={{
						minWidth: '100%',
						minHeight: '100vh',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
					}}
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
						<HourglassBottomIcon
							sx={{
								fontSize: { xxs: '48px', xs: '64px', sm: '72px' },
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
						<Typography variant='header2' color='blacky.main'>
							Loading...
						</Typography>
					</Grid>
				</Grid>
			) : (
				<Grid
					container
					justify='center'
					rowSpacing={{ xxs: 1, xs: 1, s: 1, sm: 2, md: 2 }}
					sx={{
						minWidth: '100%',
						minHeight: '100vh',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
					}}
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
								fontSize: { xxs: '48px', xs: '64px', sm: '72px' },
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
						<Typography variant='header2' color='blacky.main'>
							{message}
						</Typography>
					</Grid>
				</Grid>
			)}
		</div>
	);
}
