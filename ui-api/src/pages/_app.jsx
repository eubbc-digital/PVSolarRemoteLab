import '@/styles/globals.scss';
import { SessionProvider } from 'next-auth/react';
import theme from '../styles/theme';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Lato } from 'next/font/google';
import NavBar from '../components/NavBar';
import Footer from '@/components/Footer';
import React from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer, toast } from 'react-toastify';
import { config } from 'dotenv';

config();

const lato = Lato({
	subsets: ['latin'],
	weight: ['300', '400', '700'],
});

export default function App({ Component, pageProps }) {
	return (
		<>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<SessionProvider
					session={pageProps.session}
					basePath='/solar-lab/api/auth'
				>
					<NavBar />
					<Component {...pageProps} />
					<Footer />
				</SessionProvider>
			</ThemeProvider>
			<ToastContainer
				theme='dark'
				position='bottom-center'
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable={false}
				pauseOnHover
				style={{ minWidth: 'fit-content' }}
			/>
		</>
	);
}
