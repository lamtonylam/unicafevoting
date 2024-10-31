import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata = {
  title: 'Unicafe voting app',
  description: 'Unicafe voting app, for voting where to eat',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
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
      </body>
    </html>
  );
}
