import { Inter } from "next/font/google";
import { getSEOTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import config from "@/config";
import {
	ClerkProvider,
	SignInButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";
import "./globals.css";

const font = Inter({ subsets: ["latin"] });

export const viewport = {
	themeColor: config.colors.main,
	width: "device-width",
	initialScale: 1,
};

export const metadata = getSEOTags();

export default function RootLayout({ children }) {
	return (
		<ClerkProvider>
			<html
				lang="en"
				data-theme={config.colors.theme}
				className={font.className}
			>
				<body>
					<ClientLayout>{children}</ClientLayout>
				</body>
			</html>
		</ClerkProvider>
	);
}
