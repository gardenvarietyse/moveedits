const fs = require('fs');

// Constants & utils
const EDITED_DIR = './edited';
const MOVE_EXTENSIONS = [ 'CR2', 'xmp' ];

const withoutExtension = (filename) => filename.split('.')[0];
const getExtension = (filename) => filename.split('.').slice(-1)[0];
const includesAll = (arr, values) => values.reduce((success, value) => arr.includes(value) && success, true);

// Ensure target dir exists
try {
	fs.accessSync(EDITED_DIR);
} catch(e) {
	try {
		fs.mkdirSync(EDITED_DIR);
	} catch(e) {
		console.log(`Failed to make ${EDITED_DIR}: `, e);
		process.exit();
	}
}

// Find files
let files;
try {
	files = fs.readdirSync('./');
} catch(e) {
	console.log('Failed to read files: ', e);
	process.exit();
}

// Split by extension
const filesMap = {};
files.map((filename) => {
	const name = withoutExtension(filename);
	filesMap[name] = filesMap[name] || [];
	filesMap[name].push(getExtension(filename))
});

// Move relevant files
let movedCount = 0;

for(const baseName in filesMap) {
	const extensions = filesMap[baseName];
	if(includesAll(extensions, MOVE_EXTENSIONS)) {
		for(const extension of extensions) {
			fs.renameSync(
				`./${baseName}.${extension}`,
				`./${EDITED_DIR}/${baseName}.${extension}`
			);
			++movedCount;
		}
	}
}

console.log(`Moved ${movedCount/2} pairs`);