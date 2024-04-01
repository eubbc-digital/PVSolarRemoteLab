import { Typography, Button, Box } from '@mui/material';

import React, { useState } from 'react';

import SignInDialog from '../components/SignInDialog';
import SignUpDialog from '../components/SignUpDialog';
export default function UserButtonsNavBar() {
	const [openSignIn, setOpenSignIn] = useState(false);
	const [openSignup, setOpenSignUp] = useState(false);
	const handleOpenSignUpFromSignIn = () => {
		setOpenSignIn(false);
		setOpenSignUp(true);
	};

	const handleOpenSignInFromSignUp = () => {
		setOpenSignUp(false);
		setOpenSignIn(true);
	};

	return (
		<Box>
			<Button
				color='white'
				variant='text'
				sx={{
					mr: { xxs: 0, xs: 2, sm: 4 },
					py: 0,
					textTransform: 'none',
				}}
				onClick={() => setOpenSignUp(true)}
			>
				<Typography
					sx={{
						mx: { xxs: 0, xs: 0, md: 3 },
					}}
					variant='header3'
				>
					Sign Up
				</Typography>
			</Button>

			<Button
				color='white'
				variant='contained'
				sx={{
					py: 0,
					textTransform: 'none',
				}}
				onClick={() => setOpenSignIn(true)}
			>
				<Typography
					sx={{
						mx: { xxs: 0, xs: 0, sm: 3 },
						'&:hover': {
							color: '#fff',
						},
					}}
					variant='buttons1'
					color='primary.700'
				>
					Sign In
				</Typography>
			</Button>

			<SignUpDialog
				open={openSignup}
				handleClose={() => setOpenSignUp(false)}
				onClickSignIn={handleOpenSignInFromSignUp}
			/>
			<SignInDialog
				open={openSignIn}
				handleClose={() => setOpenSignIn(false)}
				onClickSignup={handleOpenSignUpFromSignIn}
			/>
		</Box>
	);
}
