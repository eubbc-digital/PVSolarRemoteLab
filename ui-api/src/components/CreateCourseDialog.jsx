import {
	Box,
	Dialog,
	Grid,
	TextField,
	Typography,
	Button,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function CreateCourseDialog({ open, handleClose }) {
	const { data: session, status } = useSession();
	const [name, setName] = useState('');
	const [nameError, setNameError] = useState(false);
	const [nameMessage, setNameMessage] = useState('');
	const [description, setDescription] = useState('');
	const [descriptionError, setDescriptionError] = useState(false);
	const [descriptionMessage, setDescriptionMessage] = useState('');
	const [startDate, setStartDate] = useState(dayjs());
	const [endDate, setEndDate] = useState(dayjs().add(1, 'day'));
	const [endDateError, setEndDateError] = useState(false);

	const endDateMessage = React.useMemo(() => {
		switch (endDateError) {
			case 'minDate': {
				return 'End Date should be after Start Date';
			}

			case 'invalidDate': {
				return 'Your date is not valid';
			}

			default: {
				return '';
			}
		}
	}, [endDateError]);

	const handleNameChange = (event) => {
		setName(event.target.value);
		if (event.target.value.length < 5) {
			setNameMessage('Course Name should contain at least 5 characters');
			setNameError(true);
		} else {
			setNameMessage('');
			setNameError(false);
		}
	};

	const handleDescriptionChange = (event) => {
		setDescription(event.target.value);
		if (event.target.value.length < 5) {
			setDescriptionMessage('Description should contain at least 5 characters');
			setDescriptionError(true);
		} else {
			setDescriptionMessage('');
			setDescriptionError(false);
		}
	};

	const handleEndDateChange = (value) => {
		setEndDate(value);
	};

	const saveCourse = async () => {
		if (validateFields()) {
			const response = await fetch(`/solar-lab/api/teacher/courses/create`, {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify({
					email: session.user.email,
					name: name,
					startDate: startDate
						.toDate()
						.toLocaleString(navigator.language)
						.split(',')[0],
					endDate: endDate
						.toDate()
						.toLocaleString(navigator.language)
						.split(',')[0],
					description: description,
				}),
			});
			const answer = await response.json();

			if (!answer.status) {
				toast.error('Something Went Wrong, Please Try Again');
			} else {
				toast.success('Created Successfully!');
				setName('');
				setDescription('');
				setStartDate(dayjs());
				setEndDate(dayjs().add(1, 'day'));
				handleClose();
			}
		} else {
			toast.error('Please Review Fields and Try Again');
		}
	};
	const validateFields = () => {
		return (
			!nameError && name && !descriptionError && description && !endDateError
		);
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
				<Grid
					container
					justifyContent='center'
					rowSpacing={2}
					columnSpacing={2}
				>
					<Grid item>
						<Typography variant='header1' color='secondary'>
							Solar{' '}
						</Typography>
						<Typography variant='header1' color='primary.700'>
							Remote Lab
						</Typography>
					</Grid>

					<Grid item xxs={12} xs={12}>
						<Typography variant='header3'>Course Name:</Typography>
					</Grid>

					<Grid item xxs={12} xs={12}>
						<TextField
							required
							fullWidth
							size='small'
							variant='outlined'
							value={name}
							error={nameError}
							onChange={handleNameChange}
							helperText={nameMessage}
						/>
					</Grid>
					<Grid item xxs={6} xs={6}>
						<Typography variant='header3'>Start Date:</Typography>
					</Grid>
					<Grid item xxs={6} xs={6}>
						<Typography variant='header3'>End Date:</Typography>
					</Grid>
					<Grid item xxs={6}>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker
								minDate={dayjs()}
								sx={{ width: '100%' }}
								value={startDate}
								onChange={(value) => setStartDate(value)}
							/>
						</LocalizationProvider>
					</Grid>
					<Grid item xxs={6}>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker
								onError={(newError) => setEndDateError(newError)}
								sx={{ width: '100%' }}
								value={endDate}
								minDate={startDate}
								slotProps={{
									textField: {
										helperText: endDateMessage,
									},
								}}
								onChange={handleEndDateChange}
							/>
						</LocalizationProvider>
					</Grid>
					<Grid item xxs={12} xs={12}>
						<Typography variant='header3'>Description:</Typography>
					</Grid>

					<Grid item xxs={12} xs={12}>
						<TextField
							required
							fullWidth
							size='small'
							variant='outlined'
							value={description}
							error={descriptionError}
							onChange={handleDescriptionChange}
							helperText={descriptionMessage}
						/>
					</Grid>
					<Grid item xxs={12} my={{ xxs: 1, xs: 1, sm: 1 }}>
						<Button
							fullWidth
							variant='contained'
							sx={{
								textTransform: 'none',
								bgcolor: 'primary.700',
							}}
							onClick={saveCourse}
						>
							<Typography color='white.main' variant='buttonsExperiments'>
								Create Course
							</Typography>
						</Button>
					</Grid>
				</Grid>
			</Box>
		</Dialog>
	);
}
