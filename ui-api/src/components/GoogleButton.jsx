/*Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Andres Gamboa, Alex Villazon*/

import { SvgIcon, Typography, Button } from '@mui/material';
import { signIn } from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
export default function GoogleButton() {
	const handleGoogleAuth = async () => {
		signIn('google', { redirect: false })
			.then((response) => {
				if (response.ok) {
					toast.success('Success!, Go to your Email and Verify it!');
					setEmail('');
					setPassword('');
					setConfirmPassword('');
					setName('');
				}
			})
			.catch((error) => {
				toast.info(error);
			});
	};
	return (
		<Button
			fullWidth
			variant='outlined'
			size='large'
			sx={{
				borderColor: 'gray',
				color: 'black',
				textTransform: 'none',
				'&:hover': {
					backgroundColor: '#F2F2F2',
				},
			}}
			onClick={handleGoogleAuth}
		>
			<SvgIcon sx={{ fontSize: { xxs: 16, xs: 20, sm: 32 }, mr: 2 }}>
				<path
					d='M23.001 12.2332C23.001 11.3699 22.9295 10.7399 22.7748 10.0865H12.7153V13.9832H18.62C18.501 14.9515 17.8582 16.4099 16.4296 17.3898L16.4096 17.5203L19.5902 19.935L19.8106 19.9565C21.8343 18.1249 23.001 15.4298 23.001 12.2332'
					fill='#4285F4'
				/>
				<path
					d='M12.714 22.5C15.6068 22.5 18.0353 21.5666 19.8092 19.9567L16.4282 17.3899C15.5235 18.0083 14.3092 18.4399 12.714 18.4399C9.88069 18.4399 7.47596 16.6083 6.61874 14.0766L6.49309 14.0871L3.18583 16.5954L3.14258 16.7132C4.90446 20.1433 8.5235 22.5 12.714 22.5Z'
					fill='#34A853'
				/>
				<path
					d='M6.62046 14.0767C6.39428 13.4234 6.26337 12.7233 6.26337 12C6.26337 11.2767 6.39428 10.5767 6.60856 9.92337L6.60257 9.78423L3.25386 7.2356L3.14429 7.28667C2.41814 8.71002 2.00146 10.3084 2.00146 12C2.00146 13.6917 2.41814 15.29 3.14429 16.7133L6.62046 14.0767'
					fill='#FBBC05'
				/>
				<path
					d='M12.7141 5.55997C14.7259 5.55997 16.083 6.41163 16.8569 7.12335L19.8807 4.23C18.0236 2.53834 15.6069 1.5 12.7141 1.5C8.52353 1.5 4.90447 3.85665 3.14258 7.28662L6.60686 9.92332C7.47598 7.39166 9.88073 5.55997 12.7141 5.55997'
					fill='#EB4335'
				/>
			</SvgIcon>
			<Typography variant='header3' color='blacky'>
				Continue with Google
			</Typography>
		</Button>
	);
}
