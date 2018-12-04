'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const latex = require('node-latex');
const pbytes = require('pretty-bytes');
const pdfToPng = require('pdf-to-png');

/** FILENAMES **/
const PDF_FILENAME = 'BrandonCookeResume.pdf';
const LATEX_FILENAME = 'deedy_resume-openfont.tex';
const LATEX_CLS_FILENAME = 'deedy_resume-openfont.cls';
const IMAGE_FILENAME = 'BrandonCookeResume.png';
const README_FILENAME = 'README.md';

/** PATH VARIABLES **/
const PDF_FILEPATH = path.join(__dirname, '..', PDF_FILENAME);
const LATEX_FILEPATH = path.join(__dirname, '..', LATEX_FILENAME);
const LATEX_CLS_FILEPATH = path.join(__dirname, '..', LATEX_CLS_FILENAME);
const IMAGE_FILEPATH = path.join(__dirname, '..', IMAGE_FILENAME);
const README_FILEPATH = path.join(__dirname, '..', README_FILENAME);

const FONTS_DIR = path.join(__dirname, '..', 'fonts');
const INPURTS_DIR = path.join(__dirname, '..');

let files = {};

/** MAIN **/
console.log(chalk.green('Beginning conversion of LaTeX to PNG...'));
let pdfWriteStream = fs.createWriteStream(PDF_FILEPATH);

pdfWriteStream.on('error', function(e){
	console.error('Error writing to %s: %s', PDF_FILEPATH, e);
	process.exit(1);
})

pdfWriteStream.on('finish', function(){
	try{
		stopCalculateFile(PDF_FILEPATH);
		console.log(chalk.blue(`latex converted to pdf successfully. File at: ${chalk.magenta(PDF_FILEPATH)}`));
		pdfToPng({
			input: PDF_FILEPATH,
			output: IMAGE_FILEPATH
		})
		console.log(chalk.blue(`completed converting pdf into png! File at: ${chalk.magenta(IMAGE_FILEPATH)}`));
		console.log(chalk.green(`LaTeX to PNG conversion complete! Adding image to README`));

		let imageReadmeContent = `![Brandon Cooke, Software Developer](./${IMAGE_FILENAME})`;
		fs.writeFileSync(README_FILEPATH, imageReadmeContent);

		console.log(chalk.green(`README content written! (${chalk.magenta(imageReadmeContent)})`))
		process.exit(0);
	} catch(e){
		console.error(e);
		process.exit(1);
	}
})

try{
	let latexContent = fs.createReadStream(LATEX_FILEPATH, 'utf8');
	latexContent.on('data', console.log);
	console.log(chalk.blue(`collected latex content from file: ${chalk.magenta(LATEX_FILEPATH)}`));
	console.log(chalk.blue(`converting to PDF...`));
	let pdfContent = latex(latexContent, {
		fonts: FONTS_DIR,
		inputs: path.join(__dirname, '..'),
		cmd: 'xetex'
	});
	pdfContent.pipe(pdfWriteStream);
	pdfContent.on('error', function(e){
		console.error('Error writing to %s: %s', PDF_FILEPATH, e);
		process.exit(1);
	})
	startCalculateFile(PDF_FILEPATH);
} catch(e){
	console.error(e);
	process.exit(1);
}

function startCalculateFile(filepath){
	files[filepath] = setInterval(function(){
		let size = fs.statSync(filepath).size;
		let bytes = pbytes(size);
		console.log(chalk.blue(`writing to ${filepath}... ${bytes}`));
	}, 
	1000)
}
function stopCalculateFile(filepath){
	if(files[filepath])
		clearInterval(files[filepath]);
}