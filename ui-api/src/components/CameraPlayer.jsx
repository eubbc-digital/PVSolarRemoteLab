import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { Box } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

export default function StreamPlayer({ name }) {
	let player;
	const [env, setEnv] = useState(null);

	const handlerPlayer = () => {
		if (env) {
			if (name === 'Cochabamba') {
				const { JSMpeg } = require('../scripts/jsmpeg.min.js');
				player = new JSMpeg.Player(
					`ws://${env.NEXT_PUBLIC_HOST}:${env.NEXT_PUBLIC_WSPORTCBBA}`,
					{
						canvas: streamRef.current,
						audio: false,
					}
				);
			} else if (name === 'Santa Cruz') {
				const { JSMpeg } = require('../scripts/jsmpeg.min.js');
				player = new JSMpeg.Player(
					`ws://${env.NEXT_PUBLIC_HOST}:${env.NEXT_PUBLIC_WSPORTSCZ}`,
					{
						canvas: streamRef.current,
						audio: false,
					}
				);
			} else {
				const { JSMpeg } = require('../scripts/jsmpeg.min.js');
				player = new JSMpeg.Player(
					`ws://${env.NEXT_PUBLIC_HOST}:${env.NEXT_PUBLIC_WSPORTLPZ}`,
					{
						canvas: streamRef.current,
						audio: false,
					}
				);
			}
		}
	};

	const getEnvVariables = async () => {
		const request = await fetch(`/solar-lab/api/env`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'GET',
		});

		const response = await request.json();
		if (response.status) {
			setEnv(response.variables);
		}
	};

	const streamRef = useRef(null);

	useEffect(() => {
		if (env) {
			handlerPlayer();
			return () => {
				player.destroy();
			};
		}
	}, [env]);

	useEffect(() => {
		getEnvVariables();
	}, []);

	return (
		<Box maxWidth='100%'>
			<canvas
				ref={streamRef}
				id='stream-canvas'
				width='240px'
				height='264px'
			></canvas>
		</Box>
	);
}
