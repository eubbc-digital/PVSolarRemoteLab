import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
export default function SessionTimer() {
	const [remaingTime, setRemainingTime] = useState({
		minutes: 14,
		seconds: 59,
	});
	const router = useRouter();
	useEffect(() => {
		const timer = setTimeout(() => {
			if (remaingTime.minutes != 0 || remaingTime.seconds != 0) {
				setRemainingTime(
					calculateTimeLeft(
						JSON.parse(window.localStorage.getItem('SESSION_DATA')).end_date
					)
				);
			}
		}, 900);
		if (
			remaingTime.hours <= 0 &&
			remaingTime.minutes <= 0 &&
			remaingTime.seconds <= 0
		) {
			window.localStorage.removeItem('SESSION_DATA');
			toast.warn('Your Session has Ended');
			router.push('/');
		} else if (
			remaingTime.hours <= 0 &&
			remaingTime.minutes == 5 &&
			remaingTime.seconds <= 0
		) {
			toast.warn('5 Minutes Remaining... Save your progress', {
				autoClose: 10000,
			});
		}
		return () => clearTimeout(timer);
	}, [remaingTime]);

	const calculateTimeLeft = (endDate) => {
		let difference = +new Date(endDate) - +new Date();
		let timeLeft = {
			hours: 0,
			minutes: 0,
			seconds: 0,
		};

		if (difference > 0) {
			timeLeft = {
				hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
				minutes: Math.floor((difference / 1000 / 60) % 60),
				seconds: Math.floor((difference / 1000) % 60),
			};
		}

		return timeLeft;
	};

	return (
		<Box>
			<Typography variant='buttonsExperiments' color='primary.700'>
				Remaining Time:
			</Typography>
			{remaingTime.seconds < 10 ? (
				<Typography
					ml={{ xxs: 1, xs: 1, s: 2, sm: 1 }}
					variant='buttonsExperiments'
					color='blacky.main'
				>
					{remaingTime.minutes}:0{remaingTime.seconds}
				</Typography>
			) : (
				<Typography
					ml={{ xxs: 1, xs: 1, s: 2, sm: 1 }}
					variant='buttonsExperiments'
					color='blacky.main'
				>
					{remaingTime.minutes}:{remaingTime.seconds}
				</Typography>
			)}
		</Box>
	);
}
