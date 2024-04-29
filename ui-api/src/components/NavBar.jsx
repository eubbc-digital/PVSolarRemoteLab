/*Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
MIT License - See LICENSE file in the root directory
Andres Gamboa, Alex Villazon*/

import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import UserButtonsNavBar from '../components/UserButtonsNavBar';
import UserMenu from '../components/UserMenu';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function NavBar() {
	const router = useRouter();
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

	return (
		<Box>
			<AppBar position='fixed' sx={{ bgcolor: 'primary.700' }}>
				<Toolbar sx={{ px: { xxs: 2, xs: 2, s: 4, sm: 6 } }}>
					<Image
						src='/solar-lab/logoYellow.png'
						alt='Upb Logo White'
						width={32}
						height={32}
					/>

					<Typography
						color='white.main'
						variant='header2'
						sx={{
							flexGrow: 1,
							cursor: 'pointer',
						}}
						ml={{ xxs: 1, xs: 1, sm: 3 }}
						onClick={() => router.push('/')}
					>
						Solar Remote Lab
					</Typography>

					{authenticated ? (
						<Box sx={{ flexGrow: 0 }}>
							<UserMenu email={session.user.email}></UserMenu>
						</Box>
					) : (
						<Box>
							<UserButtonsNavBar></UserButtonsNavBar>
						</Box>
					)}
				</Toolbar>
			</AppBar>
		</Box>
	);
}
