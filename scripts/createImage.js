'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const latex = require('node-latex');
const pbytes = require('pretty-bytes');
const PDFImage = require("pdf-image").PDFImage;

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

const CMD = 'xelatex';
const ROOT = path.join(__dirname, '..');
const FONTS_DIR = path.join(ROOT, 'fonts');
const INPUTS_DIR = path.join(ROOT, 'inputs');

let files = {};

function getFontPaths(){
	return fs.readdirSync(FONTS_DIR).map(fontDir => {
		return fs.readdirSync(path.join(FONTS_DIR, fontDir)).map(fontFile => {
			return path.join(FONTS_DIR, fontDir, fontFile);
		})
	});
}

function writeStreamError(e){
	console.error('Error writing to %s: %s', PDF_FILEPATH, e);
	process.exit(1);
}

/** MAIN **/
try{
	console.log(chalk.green('Beginning conversion of LaTeX to PNG...'));
	let pdfWriteStream = fs.createWriteStream(PDF_FILEPATH);

	pdfWriteStream.on('error', writeStreamError);
	pdfWriteStream.on('finish', async function(){
		try{
			stopCalculateFile(PDF_FILEPATH);
			console.log(chalk.blue(`latex converted to pdf successfully. File at: ${chalk.magenta(PDF_FILEPATH)}`));
			
			console.log(chalk.blue(`converting pdf to png at ${IMAGE_FILEPATH}`));
			/*
			pdfToPng({
				input: PDF_FILEPATH,
				output: IMAGE_FILEPATH
			}, function(err){
				*/

			var pdfImage = new PDFImage(PDF_FILEPATH, { 
				combinedImage: true,
				convertOptions: {
					'-density': '300',
					'-depth': '8',
					'-background': 'white',
					'-flatten': ''
				} 
			});
			await pdfImage.convertFile();
			
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

	console.log(chalk.blue(`Fonts: ${chalk.yellow(FONTS_DIR)}`));
	console.log(chalk.blue(`Inputs: ${chalk.yellow(path.join(__dirname, '..'))}`));

	let latexContentReadStream = fs.createReadStream(LATEX_FILEPATH, 'utf8');
	console.log(chalk.blue(`collected latex content from file: ${chalk.magenta(LATEX_FILEPATH)}`));
	console.log(chalk.blue(`converting to PDF...`));

	let pdfContent = latex(latexContentReadStream, {
		fonts: FONTS_DIR,
		inputs: INPUTS_DIR,
		cmd: CMD
	});

	console.log(chalk.blue(`PDF Content: ${chalk.magenta(JSON.stringify(pdfContent))}`));
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

function getFilesize(filepath){
	let size = fs.statSync(filepath).size;
	let bytes = pbytes(size);
	console.log(chalk.blue(`writing to ${filepath}... ${bytes} (${size})`));
}
function startCalculateFile(filepath){
	files[filepath] = setInterval(() => getFilesize(filepath), 500)
}
function stopCalculateFile(filepath){
	if(files[filepath]){
		clearInterval(files[filepath]);
	}
}