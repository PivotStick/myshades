const { join } = require("path");
const { writeFile } = require("fs").promises;
const { generateTailwindColorFamily } = require("./functions/generateTailwindColorFamily");
const { tailwindColors3 } = require("./colors/tailwind3");

/**
 * @param {Record<string, string>} args
 * @returns {Promise<import("vite").Plugin>}
 */
exports.palettes = async (args = {}) => {
	return {
		name: "tailwind-palettes-generator",
		async config(config) {
			let scss = "";
			let keys = Object.entries(args);
			let [defaultPalette] = keys[0] || [];

			for (const [key, hex] of keys) {
				const shades = generateTailwindColorFamily(hex, tailwindColors3);

				scss += `${key === defaultPalette ? `:root,\n.${key}` : `.${key}`} {\n`;

				shades.forEach((shade) => {
					scss += `\t--color-${shade.number}: ${shade.hexcode};\n`;
				});

				scss += "\n";

				shades.forEach((shade) => {
					scss += `\t--on-color-${shade.number}: ${
						shade.luminance < 40 ? "var(--color-100)" : "var(--color-900)"
					};\n`;
				});

				scss += "}\n\n";
			}

			await writeFile(join(config.root, "src/_palettes.scss"), scss);
		}
	};
};
