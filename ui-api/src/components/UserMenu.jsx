import {
	Box,
	Menu,
	MenuItem,
	Typography,
	Divider,
	IconButton,
	Tooltip,
} from '@mui/material';
import React, { useState, useEffect } from 'react';

import ScienceIcon from '@mui/icons-material/Science';
import GroupsIcon from '@mui/icons-material/Groups';
import AccountCircle from '@mui/icons-material/AccountCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut } from 'next-auth/react';
import SignUpDialog from './SignUpDialog';
import UpdatePasswordDialog from './UpdatePasswordDialog';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import CoursesDialog from './CourseDialog';
import FinishGoogleRegister from './FinishGoogleRegister';
import VerifiedIcon from '@mui/icons-material/Verified';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

export default function UserMenu({ email }) {
	const router = useRouter();
	const [openSignup, setOpenSignUp] = useState(false);
	const [isTeacher, setIsTeacher] = useState(false);
	const [openCourses, setOpenCourses] = useState(false);
	const [openUpdatePassword, setOpenUpdatePassword] = useState(false);
	const [openFinishGoogleRegister, setOpenFinishGoogleRegister] =
		useState(false);

	const [user, setUser] = useState('');

	const [anchorElUser, setAnchorElUser] = useState(null);

	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const handleOpenUpdate = () => {
		handleCloseUserMenu();
		setOpenSignUp(true);
	};

	const handleSignOut = async () => {
		setAnchorElUser(null);
		window.localStorage.removeItem('EXPERIMENT');
		window.localStorage.removeItem('COURSE');
		await signOut({ callbackUrl: '/solar-lab' });
	};

	const handleCourses = () => {
		if (user.teacher) {
			router.push('/courses');
		} else if (user.student) {
			setOpenCourses(true);
		}
	};

	const handleExperiments = () => {
		router.push('/experiments');
	};

	const handleCloseFinishGoogle = (event, reason) => {
		if (reason && reason == 'backdropClick') {
			toast.error('Please Finish the Register');
		} else {
			setOpenFinishGoogleRegister(false);
		}
	};

	const loadData = async () => {
		const response = await fetch(`/solar-lab/api/users/read`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({ email: email }),
		});
		const answer = await response.json();

		if (!answer.status) {
			toast.error('Something Went Wrong, Please Try Again');
		} else {
			setUser(answer.user);
			if (answer.user.teacher) {
				setIsTeacher(true);
			} else {
				setIsTeacher(false);
			}
			if (!answer.user.student && !answer.user.teacher) {
				setOpenFinishGoogleRegister(true);
			}
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	return (
		<Box>
			<Tooltip
				title='Courses'
				enterTouchDelay={0}
				arrow
				sx={{
					mr: { xxs: 0, xs: 0, sm: 1 },
				}}
			>
				<IconButton onClick={handleCourses}>
					<GroupsIcon
						sx={{
							fontSize: { xxs: '20px', xs: '24px', sm: '32px' },
						}}
						color='white'
					/>
				</IconButton>
			</Tooltip>
			<Tooltip
				title='Experiments'
				enterTouchDelay={0}
				arrow
				sx={{
					mr: { xxs: 0, xs: 0, sm: 1 },
				}}
			>
				<IconButton onClick={handleExperiments}>
					<ScienceIcon
						sx={{
							fontSize: { xxs: '20px', xs: '24px', sm: '32px' },
						}}
						color='white'
					/>
				</IconButton>
			</Tooltip>

			<IconButton onClick={handleOpenUserMenu}>
				<AccountCircle
					sx={{
						fontSize: { xxs: '20px', xs: '24px', sm: '32px' },
					}}
					color='white'
				/>
			</IconButton>

			{isTeacher ? (
				<Box
					sx={{
						display: 'inline-flex',
						verticalAlign: 'middle',
						lineHeight: 'normal',
					}}
				>
					{user.teacher.authorized ? (
						<Tooltip
							title='Verified Teacher'
							enterTouchDelay={0}
							arrow
							sx={{
								mr: { xxs: 0, xs: 0, sm: 1 },
							}}
						>
							<VerifiedIcon
								sx={{
									fontSize: { xxs: '16px', xs: '18px', sm: '22px' },
									color: '#059142',
								}}
							/>
						</Tooltip>
					) : (
						<Tooltip
							title='Pending Teacher Verification'
							enterTouchDelay={0}
							arrow
							sx={{
								mr: { xxs: 0, xs: 0, sm: 1 },
							}}
						>
							<AccessTimeFilledIcon
								sx={{
									mt: '2px',
									fontSize: { xxs: '12px', xs: '16px', sm: '20px' },
									color: '#F6D015',
								}}
							/>
						</Tooltip>
					)}
				</Box>
			) : null}

			<Box
				sx={{
					verticalAlign: 'middle',
					display: 'none',
					lineHeight: 'normal',
					'@media (min-width:700px)': {
						display: 'inline-flex',
					},
				}}
			>
				<Typography variant='body1' ml={1}>
					{user.name}
				</Typography>

				<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
					<KeyboardArrowDownIcon
						sx={{
							fontSize: { xxs: '16px', xs: '20px', sm: '24px' },
							display: 'none',

							'@media (min-width:700px)': {
								display: 'inline-flex',
							},
						}}
						color='white'
					/>
				</IconButton>
			</Box>

			<Menu
				sx={{ mt: '45px' }}
				id='menu-appbar'
				anchorEl={anchorElUser}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				keepMounted
				transformOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				open={Boolean(anchorElUser)}
				onClose={handleCloseUserMenu}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: 'visible',
						filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
						mt: 1.5,
					},
				}}
			>
				<MenuItem onClick={handleOpenUpdate}>
					<AccountCircle
						sx={{
							fontSize: { xxs: '20px', xs: '24px', sm: '32px' },
							mr: 1,
							color: 'primary.700',
						}}
					/>
					<Typography variant='body1'>My Account</Typography>
				</MenuItem>
				<Divider />
				<MenuItem onClick={() => setOpenUpdatePassword(true)}>
					<SettingsIcon
						sx={{
							fontSize: { xxs: '20px', xs: '24px', sm: '24px' },
							mr: 1,
							color: 'primary.700',
						}}
					/>
					<Typography variant='body2'>Update Password</Typography>
				</MenuItem>
				<MenuItem onClick={handleSignOut}>
					<LogoutIcon
						sx={{
							fontSize: { xxs: '20px', xs: '24px', sm: '24px' },
							mr: 1,
							color: 'primary.700',
						}}
					/>
					<Typography variant='body2'>Logout</Typography>
				</MenuItem>

				<SignUpDialog
					open={openSignup}
					handleClose={() => setOpenSignUp(false)}
				/>
				<UpdatePasswordDialog
					open={openUpdatePassword}
					handleClose={() => setOpenUpdatePassword(false)}
				/>
				{user ? (
					<Box>
						<CoursesDialog
							open={openCourses}
							handleClose={() => setOpenCourses(false)}
							user={user}
						/>
						<FinishGoogleRegister
							open={openFinishGoogleRegister}
							handleClose={handleCloseFinishGoogle}
							user={user}
						></FinishGoogleRegister>
					</Box>
				) : null}
			</Menu>
		</Box>
	);
}
