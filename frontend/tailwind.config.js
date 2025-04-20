const { platformSelect, platformColor } = require("nativewind/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
	// NOTE: Update this to include the paths to all of your component files.
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			primary: platformSelect({
				ios: platformColor("systemBlue"),
				android: platformColor("blue"),
				default: platformColor("blue"),
			})
		},
	},
	plugins: [],
}