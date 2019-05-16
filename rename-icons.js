const fs = require('fs');
const args = process.argv.slice(2);

if (args[0]) {
	const iconDirectory = args[0].slice(-1) == '/' ? args[0].slice(0, args[0].length - 1) : args[0];

	let iconCounter = 0,
		iconSetName = iconDirectory.split('/').pop();

	fs.readdirSync(iconDirectory).forEach(file => {
		const fileExtension = file.split('.').pop();
		if (
			fileExtension == 'png' ||
			fileExtension == 'jpeg' ||
			fileExtension == 'jpg' ||
			fileExtension == 'gif' ||
			fileExtension == 'svg'
		) {
			const sourceFile = `${iconDirectory}/${file}`,
				newFile = `${iconDirectory}/${iconSetName}_${iconCounter}.${fileExtension}`;
			console.log('Renaming ', sourceFile, ' -> ', newFile);
			fs.renameSync(sourceFile, newFile);
			iconCounter++;
		}
	});
} else {
	console.log('Please include the icon folder path (e.g. Icons/FC) as first argument after filename');
}
