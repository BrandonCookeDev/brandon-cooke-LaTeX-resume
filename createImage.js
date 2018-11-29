'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const latex = require('latex');
const pdfToPng = require('pdf-to-png');

/** FILENAMES **/
const PDF_FILENAME = 'BrandonCookeResume.pdf';
const LATEX_FILENAME = 'deedy_resume-openfont.tex';
const IMAGE_FILENAME = 'BrandonCookeResume.png';

/** PATH VARIABLES **/
const PDF_FILEPATH = path.join(__dirname, PDF_FILENAME);
const LATEX_FILEPATH = path.join(__dirname, LATEX_FILENAME);
const IMAGE_FILEPATH = path.join(__dirname, IMAGE_FILENAME);

/** MAIN **/
console.log(chalk.green('Beginning conversion of LaTeX to PNG...'));
let pdfWriteStream = fs.createWriteStream(PDF_FILEPATH);

pdfWriteStream.on('error', function(e){
	console.error('Error writing to %s: %s', PDF_FILEPATH, e);
	process.exit(1);
})

pdfWriteStream.on('finish', function(){
	console.log(chalk.blue(`latex converted to pdf successfully. File at: ${chalk.magenta(PDF_FILEPATH)}`));
	pdfToPng({
		input: PDF_FILEPATH,
		output: IMAGE_FILEPATH
	})
	console.log(chalk.blue(`completed converting pdf into png! File at: ${chalk.magenta(IMAGE_FILEPATH)}`));
	console.log(chalk.green(`LaTeX to PNG conversion complete!`));
	process.exit(0);
})

let latexContent = fs.readFileSync(LATEX_FILEPATH);
console.log(chalk.blue(`collected latex content from file: ${chalk.magenta(LATEX_FILEPATH)}`));
console.log(chalk.blue(`converting to PDF...`));
latex(latexContent.split('\n')).pipe(pdfWriteStream);