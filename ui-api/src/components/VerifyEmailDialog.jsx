import { Box, Dialog, Grid, Typography, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';

export default function VerifyEmailDialog({ open, handleClose }) {
	const { data: session, status } = useSession();
	const [authenticated, setAuthenticated] = useState(false);

	useEffect(() => {
		checkSession();
	}, [status]);

	const checkSession = async () => {
		if (status === 'authenticated') {
			setAuthenticated(true);
		} else if (status === 'loading') {
		} else {
			setAuthenticated(false);
		}
	};

	const refreshVerified = async () => {
		const response = await fetch(`/solar-lab/api/users/read`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({ email: session.user.email }),
		});
		const answer = await response.json();

		if (!answer.status) {
			toast.error('Something Went Wrong, Please Try Again');
		} else {
			if (answer.user.isVerified) {
				handleClose();
			} else {
				toast.error('Not Verified yet, go to your Email');
			}
		}
	};

	return (
		<Box>
			{authenticated ? (
				<Dialog
					open={open}
					onClose={handleClose}
					PaperProps={{
						sx: {
							borderRadius: '24px',
							maxWidth: '660px',
						},
					}}
				>
					<Box
						m={{ xxs: 3, xs: 4, sm: 5 }}
						sx={{
							alignItems: 'center',
						}}
					>
						<Grid
							container
							justify='center'
							rowSpacing={{ xxs: 1, xs: 1, s: 1, sm: 2, md: 2 }}
							sx={{
								display: 'flex',
								justifyContent: 'center',
							}}
						>
							<Grid
								item
								sx={{
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<Typography variant='header1' color='secondary' mr={1}>
									Solar
								</Typography>
								<Typography variant='header1' color='primary.700'>
									Remote Lab
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
							>
								<Typography variant='header2' color='blacky.main'>
									To continue you Must Verify your Email
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
							>
								<Typography variant='header3' mr={1}>
									Go to {session.user.email} and Click the provided Link to
									verify it, then you can come back Here.
								</Typography>
							</Grid>
							<Grid
								item
								xxs={12}
								xs={12}
								mb={{ xxs: 1, xs: 1, sm: 2 }}
								sx={{
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<Button
									fullWidth
									variant='contained'
									sx={{
										color: 'white',
										textTransform: 'none',
										padding: '1px',
										bgcolor: 'primary.700',
									}}
									onClick={refreshVerified}
								>
									<Typography variant='buttons4'>Already Done</Typography>
								</Button>
							</Grid>
						</Grid>
					</Box>
				</Dialog>
			) : null}
		</Box>
	);
}
