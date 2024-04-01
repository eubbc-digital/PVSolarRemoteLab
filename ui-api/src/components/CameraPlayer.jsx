import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { Box } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

export default function StreamPlayer({ name }) {
	let player;

	const handlerPlayer = () => {
		if (name === 'Cochabamba') {
			//envvariable
			const { JSMpeg } = require('../scripts/jsmpeg.min.js');
			player = new JSMpeg.Player(`ws://research.upb.edu:8888`, {
				canvas: streamRef.current,
				audio: false,
			});
		} else if (name === 'Santa Cruz') {
			const { JSMpeg } = require('../scripts/jsmpeg.min.js');
			player = new JSMpeg.Player(`ws://research.upb.edu:9999`, {
				canvas: streamRef.current,
				audio: false,
			});
		} else {
			const { JSMpeg } = require('../scripts/jsmpeg.min.js');
			player = new JSMpeg.Player(`ws://research.upb.edu:7777`, {
				canvas: streamRef.current,
				audio: false,
			});
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
