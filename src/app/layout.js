import localFont from 'next/font/local';
import './globals.css';
import { IBM_Plex_Mono } from 'next/font/google';
import styles from './page.module.css';

export const metadata = {
  title: 'Unicafe voting app',
  description: 'Unicafe voting app, for voting where to eat',
};

const IBMFont = IBM_Plex_Mono({ weight: '300', subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${IBMFont.className} `}>
        <div className={`${styles.container}`}>
          {children}
          <br />
          <br />
          <br />
          <br />
          <p>
            <a
              href='https://www.cs.helsinki.fi/u/tonylam/'
              target='_blank'
              rel='noopener noreferrer'
            >
              Tony Lam
            </a>
          </p>
          <a href='https://open-meteo.com/'>Weather data by Open-Meteo.com</a>
        </div>
      </body>
    </html>
  );
}
