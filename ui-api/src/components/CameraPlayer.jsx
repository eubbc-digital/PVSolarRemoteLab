import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { Box } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

export default function StreamPlayer({ name }) {
	let player;

	const handlerPlayer = () => {
		if (name === 'Cochabamba') {
			const { JSMpeg } = require('../scripts/jsmpeg.min.js');
			player = new JSMpeg.Player(
				`ws://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_WSPORTCBBA}`,
				{
					canvas: streamRef.current,
					audio: false,
				}
			);
		} else if (name === 'Santa Cruz') {
			const { JSMpeg } = require('../scripts/jsmpeg.min.js');
			player = new JSMpeg.Player(
				`ws://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_WSPORTSCZ}`,
				{
					canvas: streamRef.current,
					audio: false,
				}
			);
		} else {
			const { JSMpeg } = require('../scripts/jsmpeg.min.js');
			player = new JSMpeg.Player(
				`ws://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_WSPORTLPZ}`,
				{
					canvas: streamRef.current,
					audio: false,
				}
			);
		}
	};

	const streamRef = useRef(null);

	useEffect(() => {
		handlerPlayer();
		return () => {
			player.destroy();
		};
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
