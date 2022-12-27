// import stripAnsi from 'strip-ansi';
import eastAsianWidth from 'eastasianwidth';
import emojiRegex from 'emoji-regex';

const SPECIAL_CHARS = ['à', 'ó'];

export function stringWidth(string, options = {}) {
	if (typeof string !== 'string' || string.length === 0) {
		return 0;
	}

	// options = Object.assign({
	// 	ambiguousIsNarrow: false
	// }, options);

	// string = stripAnsi(string);

	if (string.length === 0) {
		return 0;
	}

	const ambiguousCharacterWidth = options.ambiguousIsNarrow ? 1 : 2;
	let width = 0;

	for (let i = 0, len = string.length; i < len; i++) {
		const character = string[i];
		const codePoint = character.codePointAt(0);

		// Ignore control characters
		// if (codePoint <= 0x1F || (codePoint >= 0x7F && codePoint <= 0x9F)) {
		// 	continue;
		// }

		// Ignore combining characters
		if (codePoint >= 0x300 && codePoint <= 0x36F) {
			continue;
		}
		if (SPECIAL_CHARS.indexOf(character) >= 0) {
			width += 1;
			continue;
		}

		const code = eastAsianWidth.eastAsianWidth(character);
		switch (code) {
			case 'F':
			case 'W':
				width += 2;
				break;
			case 'A':
				width += ambiguousCharacterWidth;
				break;
			default:
				width += 1;
		}
	}

	return width;
}

export function hasEmoji(string) {
	const oLen = string.length;
	string = string.replace(emojiRegex(), '');
	const nLen = string.length;
	return oLen - nLen > 0;
}

export function hasArabic(string) {
	for (let i = 0, len = string.length; i < len; i++) {
		const codePoint = string[i].codePointAt(0);
		if (codePoint >= 0x0600 && codePoint <= 0x06FF) {
			return true;
		}
	}
	return false;
}
