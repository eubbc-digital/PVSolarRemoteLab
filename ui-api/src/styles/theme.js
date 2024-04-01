import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			50: '#E2ECFF',
			100: '#BDC7E4',
			200: '#90A5D7',
			300: '#637BBC',
			400: '#4F68AF',
			500: '#3E55A2',
			600: '#2E4594',
			700: '#203587',
			800: '#14287A',
			900: '#02115F',
		},
		secondary: {
			main: '#F6BD2B',
		},
		error: {
			main: '#DF2E21',
		},
		info: {
			main: '#006DD3',
		},
		warning: {
			main: '#F6D015',
		},
		success: {
			main: '#05BD00',
		},
		white: {
			main: '#FFFFFF',
		},
		blacky: {
			main: '#000000',
		},
	},
	typography: {
		header1: {
			fontFamily: 'Lato',
			fontWeight: 700,
			fontSize: '1.5rem',
			'@media (min-width:200px)': {
				fontSize: '1.3rem',
			},
			'@media (min-width:372px)': {
				fontSize: '1.6rem',
			},
			'@media (min-width:538px)': {
				fontSize: '1.8rem',
			},
			'@media (min-width:664px)': {
				fontSize: '2.3rem',
			},
		},
		header12: {
			fontFamily: 'Lato',
			fontWeight: 700,
			fontSize: '1.5rem',
			'@media (min-width:200px)': {
				fontSize: '1.2rem',
			},
			'@media (min-width:372px)': {
				fontSize: '1.4rem',
			},
			'@media (min-width:538px)': {
				fontSize: '1.6rem',
			},
			'@media (min-width:664px)': {
				fontSize: '2.0rem',
			},
		},
		header2: {
			fontFamily: 'Lato',
			fontWeight: 700,
			fontSize: '0.6rem',
			'@media (min-width:306px)': {
				fontSize: '0.8rem',
			},
			'@media (min-width:326px)': {
				fontSize: '0.9rem',
			},
			'@media (min-width:388px)': {
				fontSize: '1.0rem',
			},
			'@media (min-width:538px)': {
				fontSize: '1.4rem',
			},
			'@media (min-width:664px)': {
				fontSize: '1.6rem',
			},
		},
		titleDialog: {
			fontFamily: 'Lato',
			fontWeight: 700,
			fontSize: '0.7rem',
			'@media (min-width:318px)': {
				fontSize: '0.8rem',
			},
			'@media (min-width:341px)': {
				fontSize: '0.9rem',
			},
			'@media (min-width:360px)': {
				fontSize: '0.9rem',
			},
			'@media (min-width:386px)': {
				fontSize: '1.0rem',
			},
			'@media (min-width:472px)': {
				fontSize: '1.2rem',
			},
			'@media (min-width:538px)': {
				fontSize: '1.0rem',
			},
			'@media (min-width:573px)': {
				fontSize: '1.2rem',
			},
			'@media (min-width:664px)': {
				fontSize: '1.4rem',
			},
			'@media (min-width:712px)': {
				fontSize: '1.6rem',
			},
		},
		dataDialog: {
			fontFamily: 'Lato',
			fontSize: '0.6rem',
			'@media (min-width:318px)': {
				fontSize: '0.8rem',
			},
			'@media (min-width:360px)': {
				fontSize: '0.9rem',
			},
			'@media (min-width:472px)': {
				fontSize: '1.1rem',
			},
			'@media (min-width:538px)': {
				fontSize: '1.0rem',
			},
			'@media (min-width:664px)': {
				fontSize: '1.2rem',
			},
		},

		body1: {
			fontFamily: 'Lato',
			fontSize: '0.4rem',
			'@media (min-width:200px)': {
				fontSize: '0.6rem',
			},
			'@media (min-width:372px)': {
				fontSize: '0.8rem',
			},
			'@media (min-width:664px)': {
				fontSize: '1.0rem',
			},
		},
		body2: {
			fontFamily: 'Lato',
			fontSize: '0.5rem',
			'@media (min-width:200px)': {
				fontSize: '0.6rem',
			},
			'@media (min-width:372px)': {
				fontSize: '0.7rem',
			},
			'@media (min-width:664px)': {
				fontSize: '0.9rem',
			},
		},
		header3: {
			fontFamily: 'Lato',
			fontSize: '0.7rem',
			'@media (min-width:303px)': {
				fontSize: '0.8rem',
			},
			'@media (min-width:318px)': {
				fontSize: '0.8rem',
			},
			'@media (min-width:538px)': {
				fontSize: '0.9rem',
			},
			'@media (min-width:664px)': {
				fontSize: '1.2rem',
			},
		},

		buttons1: {
			fontFamily: 'Lato',
			fontSize: '0.6rem',
			fontWeight: '700',
			'@media (min-width:281px)': {
				fontSize: '0.6rem',
			},
			'@media (min-width:298px)': {
				fontSize: '0.7rem',
			},
			'@media (min-width:314px)': {
				fontSize: '0.7rem',
			},
			'@media (min-width:454px)': {
				fontSize: '0.8rem',
			},
			'@media (min-width:496px)': {
				fontSize: '0.8rem',
			},
			'@media (min-width:538px)': {
				fontSize: '1.0rem',
			},
			'@media (min-width:664px)': {
				fontSize: '1.2rem',
			},
		},
		buttonsExperiments: {
			fontFamily: 'Lato',
			fontSize: '0.6rem',
			fontWeight: '700',
			'@media (min-width:281px)': {
				fontSize: '0.6rem',
			},
			'@media (min-width:298px)': {
				fontSize: '0.7rem',
			},
			'@media (min-width:314px)': {
				fontSize: '0.8rem',
			},
			'@media (min-width:380px)': {
				fontSize: '0.9rem',
			},
			'@media (min-width:496px)': {
				fontSize: '0.9rem',
			},
			'@media (min-width:538px)': {
				fontSize: '1.0rem',
			},
			'@media (min-width:664px)': {
				fontSize: '1.2rem',
			},
		},

		body3: {
			fontFamily: 'Lato',
			fontSize: '0.6rem',
			'@media (min-width:326px)': {
				fontSize: '0.7rem',
			},
			'@media (min-width:373px)': {
				fontSize: '0.7rem',
			},
			'@media (min-width:428px)': {
				fontSize: '0.8rem',
			},
			'@media (min-width:664px)': {
				fontSize: '0.9rem',
			},
			'@media (min-width:800px)': {
				fontSize: '1.0rem',
			},
		},
		titleDepartment: {
			fontFamily: 'Lato',
			fontSize: '0.6rem',
			fontWeight: '700',
			fontSize: '0.8rem',
			'@media (min-width:326px)': {
				fontSize: '0.9rem',
			},
			'@media (min-width:373px)': {
				fontSize: '1.0rem',
			},

			'@media (min-width:496px)': {
				fontSize: '1.2rem',
			},
		},

		dataDepartment: {
			fontFamily: 'Lato',
			fontSize: '0.8rem',
			'@media (min-width:326px)': {
				fontSize: '0.9rem',
			},
			'@media (min-width:373px)': {
				fontSize: '1.0rem',
			},
			'@media (min-width:998px)': {
				fontSize: '1.1rem',
			},
		},
		buttons2: {
			fontFamily: 'Lato',
			fontSize: '0.6rem',
			fontWeight: 700,
			'@media (min-width:326px)': {
				fontSize: '0.7rem',
			},
			'@media (min-width:373px)': {
				fontSize: '0.7rem',
			},
			'@media (min-width:428px)': {
				fontSize: '0.8rem',
			},
			'@media (min-width:664px)': {
				fontSize: '0.9rem',
			},
		},

		buttons4: {
			fontFamily: 'Lato',
			fontWeight: 700,
			fontSize: '1.0rem',

			'@media (min-width:372px)': {
				fontSize: '1.1rem',
			},

			'@media (min-width:664px)': {
				fontSize: '1.6rem',
			},
		},
		headerHome: {
			fontFamily: 'Lato',
			fontWeight: 700,
			fontSize: '1.8rem',
			'@media (min-width:200px)': {
				fontSize: '1.8rem',
			},
			'@media (min-width:338px)': {
				fontSize: '1.9rem',
			},
			'@media (min-width:372px)': {
				fontSize: '2.1rem',
			},
			'@media (min-width:538px)': {
				fontSize: '2.3rem',
			},
			'@media (min-width:664px)': {
				fontSize: '2.5rem',
			},
			'@media (min-width:900px)': {
				fontSize: '2.7rem',
			},
			'@media (min-width:1100px)': {
				fontSize: '3.2rem',
			},
		},
		buttonsHome: {
			fontFamily: 'Lato',
			fontWeight: 700,
			fontSize: '1.0rem',

			'@media (min-width:200px)': {
				fontSize: '1.1rem',
			},
			'@media (min-width:338px)': {
				fontSize: '1.2rem',
			},
			'@media (min-width:372px)': {
				fontSize: '1.3rem',
			},
			'@media (min-width:664px)': {
				fontSize: '1.3rem',
			},
			'@media (min-width:900px)': {
				fontSize: '1.6rem',
			},
			'@media (min-width:1100px)': {
				fontSize: '1.8rem',
			},
		},
		buttonsPages: {
			fontFamily: 'Lato',
			fontWeight: 700,
			fontSize: '1.0rem',

			'@media (min-width:200px)': {
				fontSize: '0.6rem',
			},
			'@media (min-width:372px)': {
				fontSize: '0.8rem',
			},
			'@media (min-width:664px)': {
				fontSize: '1.1rem',
			},
			'@media (min-width:900px)': {
				fontSize: '1.3rem',
			},
			'@media (min-width:1100px)': {
				fontSize: '1.6rem',
			},
		},
	},
	breakpoints: {
		values: {
			xxs: 0,
			xs: 372,
			s: 538,
			sm: 664,
			md: 900,
			lg: 1100,
			xl: 1536,
		},
	},
	shape: {
		borderRadius: 8,
	},
	components: {
		MuiTooltip: {
			styleOverrides: {
				tooltip: {
					backgroundColor: 'white',
					color: 'black',
					border: '1px solid #dadde9',
					'& .MuiTooltip-arrow': {
						color: 'white',
					},
					fontFamily: 'Lato',
					fontSize: '1.0rem',
				},
			},
		},
		MuiSlider: {
			styleOverrides: {
				root: {
					'& .MuiSlider-thumb': {
						height: 28,
						width: 28,
						backgroundColor: '#fff',
						boxShadow:
							'0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)',
						'&:focus, &:hover, &.Mui-active': {
							boxShadow:
								'0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
							// Reset on touch devices, it doesn't add specificity
							'@media (hover: none)': {
								boxShadow:
									'0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)',
							},
						},
					},
					'& .MuiSlider-valueLabel': {
						fontSize: 20,
						fontWeight: 'normal',
						top: -6,
						backgroundColor: '#000',
						color: '#203587',
						'&:before': {
							display: 'none',
						},
						'& *': {
							background: 'transparent',
							color: '#FFF',
						},
					},
					'& .MuiSlider-track': {
						border: 'none',
					},
					'& .MuiSlider-rail': {
						opacity: 0.5,
						backgroundColor: '#bfbfbf',
					},
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					'&:hover': {
						backgroundColor: '#637BBC',
					},
					'.MuiTypography:hover': {
						color: '#FFFFFF',
					},
				},
			},
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					'& p': {
						fontFamily: 'lato',
						fontSize: '0.6rem',
						'@media (min-width:200px)': {
							fontSize: '0.8rem',
						},
						'@media (min-width:700px)': {
							fontSize: '16px',
						},
						marginLeft: 0,
					},
					'& .MuiInputBase-input': {
						padding: '8px',
						fontFamily: 'lato',
					},
				},
			},
		},
		MuiTabs: {
			styleOverrides: {
				root: {
					'.MuiTabs-scrollButtons.Mui-disabled': {
						opacity: '0.3',
					},
				},
			},
		},
	},
});

export default theme;
