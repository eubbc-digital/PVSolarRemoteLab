import {
	Box,
	Dialog,
	Grid,
	TextField,
	Typography,
	Button,
	FormControlLabel,
	Checkbox,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

export default function FinishGoogleRegister({ open, handleClose, user }) {
	const [emailDisable, setEmailDisable] = useState(true);
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [isTeacher, setIsTeacher] = useState(false);

	const handleChange = (event) => {
		setIsTeacher(event.target.checked);
	};

	useEffect(() => {
		setEmail(user.email);
		setName(user.name);
	}, []);

	const finish = async () => {
		if (validateFields()) {
			const updateUser = {
				email: email,
				name: name,
				isTeacher: isTeacher,
			};
			try {
				const response = await fetch(`/solar-lab/api/google/update`, {
					headers: {
						'Content-Type': 'application/json',
					},
					method: 'POST',
					body: JSON.stringify(updateUser),
				});
				const answer = await response.json();

				if (answer.status) {
					toast.success('Updated Successfully');
					handleClose();
				} else {
					toast.error('Error, Please Try Again');
				}
			} catch (error) {
				toast.error('Error, Please Try Again');
			}
		} else {
			toast.error('Missing Fields, Verify and Retry');
		}
	};

	const validateFields = () => {
		return email && name;
	};

	return (
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
				<Grid container justifyContent='center' rowSpacing={1}>
					<Grid item>
						<Typography variant='header1' color='secondary'>
							Solar{' '}
						</Typography>
						<Typography variant='header1' color='primary.700'>
							Remote Lab
						</Typography>
					</Grid>
					<Grid item xxs={12} xs={12} mb={2}>
						<Typography variant='titleDialog' color='blacky.main'>
							Almost Done! Complete the Missing Information
						</Typography>
					</Grid>
				</Grid>
				<Grid container rowSpacing={{ xxs: 1, xs: 1, sm: 2 }} columnSpacing={2}>
					<Grid item xxs={12} xs={12}>
						<Typography variant='header3'>Email</Typography>{' '}
					</Grid>

					<Grid item xxs={12} xs={12}>
						<TextField
							required
							fullWidth
							size='small'
							variant='outlined'
							autoComplete='email'
							value={email}
							disabled={emailDisable}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</Grid>
					<Grid item xxs={12} xs={12}>
						<Typography variant='header3'>Full Name</Typography>
					</Grid>

					<Grid item xxs={12} xs={12}>
						<TextField
							required
							fullWidth
							size='small'
							variant='outlined'
							autoComplete='name'
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</Grid>
					<Grid item xxs={12} xs={12} mt={1}>
						<Typography variant='header2' color='blacky.main'>
							Are you a Teacher?
						</Typography>
					</Grid>

					<Grid item xxs={12} xs={12}>
						<FormControlLabel
							control={
								<Checkbox
									checked={isTeacher}
									onChange={handleChange}
									color='primary'
								/>
							}
							label={<Typography variant='header3'>I am a Teacher</Typography>}
						/>
					</Grid>
					<Grid item xxs={12} xs={12} mb={{ xxs: 2, xs: 2, sm: 3 }}>
						<Button
							fullWidth
							variant='contained'
							sx={{
								color: 'white',
								textTransform: 'none',
								padding: '1px',
								bgcolor: 'primary.700',
							}}
							onClick={finish}
						>
							<Typography variant='buttons4'>Finish my Account</Typography>
						</Button>
					</Grid>
				</Grid>
			</Box>
		</Dialog>
	);
}
