//------------------------- Import Toastify -----------------------
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

//-------------------------- Import Global CSS --------------------
import "./../styles/globals.css";

//-------------------------- Metadata ----------------------
export const metadata = {
  title: "Igniculuss - CRM",
  description: "Igniculuss - CRM - Solution",
  icons: {
    icon: "/images/IgniculussLogo.png", // Or your own logo
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body  >
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
