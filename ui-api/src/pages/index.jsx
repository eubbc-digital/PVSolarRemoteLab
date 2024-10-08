/*Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Andres Gamboa, Alex Villazon*/

import Head from 'next/head';
import styles from '@/styles/Home.module.scss';
import React, { useEffect, useState } from 'react';
import {
	Card,
	CardContent,
	CardMedia,
	Grid,
	Typography,
	Button,
} from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import VerifyEmailDialog from '@/components/VerifyEmailDialog';
import LoadingButton from '@mui/lab/LoadingButton';

export default function Home() {
	const [openVerifyEmail, setOpenVerifyEmail] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleCloseVerifyEmail = (event, reason) => {
		if (reason && reason == 'backdropClick') {
			toast.error('Not Verified yet');
		} else {
			setOpenVerifyEmail(false);
		}
	};

	useEffect(() => {
		reviewAccess();
	}, []);

	const handleEnterRemoteLab = () => {
		if (!window.localStorage.getItem('SESSION_DATA')) {
			toast.error('You dont have an active Session. Book one!');
		} else {
			router.push('/laboratory');
		}
	};

	const router = useRouter();

	const reviewAccess = async () => {
		const urlParams = new URLSearchParams(window.location.search);
		const accessKey = urlParams.get('access_key');
		if (accessKey != null) {
			setLoading(true);
			if (accessKey == 'admin') {
				window.localStorage.setItem(
					'SESSION_DATA',
					JSON.stringify({
						start_date: '10/10/2023',
						end_date: '12/12/2024',
						isPrivate: true,
					})
				);
				setLoading(false);
				toast.info(
					'Welcome! It looks like you have a privileged link, so you wont have to worry about the remaining time. Enjoy the experience!',
					{ autoClose: 15000 }
				);
			} else {
				var isPrivateSession = true;
				const pwd = urlParams.get('pwd');
				if (!pwd) {
					isPrivateSession = false;
				}
				const message = { access_key: accessKey, pwd: pwd };
				const response = await fetch(`/solar-lab/api/booking`, {
					headers: {
						'Content-Type': 'application/json',
					},
					method: 'POST',
					body: JSON.stringify(message),
				});
				const data = await response.json();
				setLoading(false);
				if (data.status) {
					toast.info('Your Session has started');
					window.localStorage.setItem(
						'SESSION_DATA',
						JSON.stringify({
							start_date: data.data.start_date,
							end_date: data.data.end_date,
							isPrivate: isPrivateSession,
						})
					);
				} else {
					toast.warn('Your Session has not started yet', {
						autoClose: 10000,
					});
				}
			}
		}
	};

	return (
		<main className={styles.main}>
			<div className={styles.container}>
				<Head>
					<title>UPB Solar Remote Lab</title>
					<meta
						name='description'
						content='Remote Laboratory for Solar Energy'
					/>
					<link rel='icon' href='/solar-lab/logoYellow.png' />
				</Head>
			</div>

			<Card
				sx={{
					height: 'calc(100vh - 160px)',
					width: '100%',
					borderRadius: 0,
				}}
			>
				<CardContent sx={{ p: 0, m: 0, borderRadius: 0 }}>
					<div
						style={{
							position: 'relative',
						}}
					>
						<CardMedia
							sx={{
								height: 'calc(100vh - 100px)',
								width: '100%',
								objectFit: 'cover',
							}}
							component='video'
							image='/solar-lab/panels3.mp4'
							alt='solar panel wps'
							autoPlay
							loop
							muted
						/>
						<div
							style={{
								position: 'absolute',
								color: 'white',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
							}}
						>
							<Grid
								container
								justify='center'
								rowSpacing={{ xxs: 1, xs: 1, s: 1, sm: 2, md: 2 }}
								sx={{
									minWidth: '90vw',
									minHeight: '100vh',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									paddingTop: '32px',
								}}
							>
								<Grid
									item
									container
									justify='center'
									rowSpacing={{ xxs: 1, xs: 1, s: 1, sm: 2, md: 2 }}
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
										<Typography variant='headerHome' color='white.main'>
											UPB Solar Remote Lab
										</Typography>
									</Grid>

									<Grid
										item
										xxs={12}
										xs={12}
										s={12}
										sm={6}
										mt={2}
										sx={{
											display: 'flex',
											alignItems: 'center',
											textAlign: 'center',
										}}
										justifyContent={{
											xxs: 'center',
											xs: 'left',
											s: 'left',
											sm: 'center',
										}}
									>
										<LoadingButton
											loading={loading}
											variant='contained'
											sx={{
												bgcolor: 'white.main',
												border: 1,
												textTransform: 'none',
												borderColor: 'primary.700',
												py: { xxs: '2px', xs: 'auto' },
											}}
											onClick={() => router.push('/experiments')}
										>
											<Typography
												sx={{
													mx: { xxs: 0, xs: 1, s: 3, sm: 3, md: 4, lg: 5 },

													'&:hover': {
														color: '#fff',
													},
												}}
												variant='buttonsHome'
												color='primary.700'
											>
												Manage Experiments
											</Typography>
										</LoadingButton>
									</Grid>
									<Grid
										item
										xxs={12}
										xs={12}
										s={12}
										sm={6}
										mt={{ xxs: 1, xs: 1, s: 1, sm: 2 }}
										sx={{
											display: 'flex',
											alignItems: 'center',
											textAlign: 'center',
										}}
										justifyContent={{
											xxs: 'center',
											xs: 'center',
											s: 'center',
											sm: 'center',
										}}
									>
										<LoadingButton
											loading={loading}
											variant='contained'
											sx={{
												bgcolor: 'white.main',
												border: 1,
												textTransform: 'none',
												borderColor: 'primary.700',
												py: { xxs: '2px', xs: 'auto' },
											}}
											onClick={(e) =>
												(window.location.href =
													'https://eubbc-digital.upb.edu/booking/lab-structure;id=3')
											}
										>
											<Typography
												sx={{
													mx: { xxs: 3, xs: 4, s: 6, sm: 5, md: 5, lg: 7 },
													'&:hover': {
														color: '#fff',
													},
												}}
												variant='buttonsHome'
												color='primary.700'
											>
												Book a Session
											</Typography>
										</LoadingButton>
									</Grid>
									<Grid
										item
										xxs={12}
										xs={12}
										mt={{ xxs: 1, xs: 1, s: 1, sm: 2 }}
										sx={{
											display: 'flex',
											alignItems: 'center',
											textAlign: 'center',
										}}
										justifyContent={{
											xxs: 'center',
											xs: 'right',
											s: 'right',
											sm: 'center',
										}}
									>
										<LoadingButton
											loading={loading}
											variant='contained'
											sx={{
												textTransform: 'none',
												bgcolor: 'primary.700',
												py: { xxs: '4px', xs: 'auto' },
											}}
											onClick={handleEnterRemoteLab}
										>
											<Typography
												sx={{
													mx: { xxs: 2, xs: 3, s: 4, sm: 4, md: 4, lg: 5 },
												}}
												variant='buttonsHome'
												color='white.main'
											>
												Go to Remote Lab
											</Typography>
										</LoadingButton>
									</Grid>
								</Grid>
							</Grid>
						</div>
					</div>
				</CardContent>
				<VerifyEmailDialog
					open={openVerifyEmail}
					handleClose={handleCloseVerifyEmail}
				/>
			</Card>
		</main>
	);
}
