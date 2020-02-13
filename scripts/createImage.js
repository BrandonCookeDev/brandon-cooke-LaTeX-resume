'use strict';
require('colors')

const fs = require('fs');
const path = require('path');
const latex = require('node-latex');
const pbytes = require('pretty-bytes');
const PDFImage = require("pdf-image").PDFImage;
const handlebars = require('handlebars');

/** FILENAMES **/
const PDF_FILENAME = 'BrandonCookeResume.pdf';
const LATEX_FILENAME = 'deedy_resume-openfont.tex';
const LATEX_CLS_FILENAME = 'deedy_resume-openfont.cls';
const IMAGE_FILENAME = 'BrandonCookeResume.png';
const README_FILENAME = 'README.md';

/** PATH VARIABLES **/
const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const PDF_FILEPATH = path.join(ROOT_DIR, PDF_FILENAME);
const LATEX_FILEPATH = path.join(SRC_DIR, LATEX_FILENAME);
const LATEX_CLS_FILEPATH = path.join(SRC_DIR, LATEX_CLS_FILENAME);
const IMAGE_FILEPATH = path.join(ROOT_DIR, IMAGE_FILENAME);
const README_FILEPATH = path.join(ROOT_DIR, README_FILENAME);

const CMD = 'xelatex';
const FONTS_DIR = path.join(SRC_DIR, 'fonts');
const INPUTS_DIR = path.join(SRC_DIR, 'inputs');

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

async function convertPdfToPng(){
	stopCalculateFile(PDF_FILEPATH);
	printFilesize(PDF_FILEPATH);
	startCalculateFile(IMAGE_FILEPATH);
	try{
		console.log(`latex converted to pdf successfully. File at: ${PDF_FILEPATH.magenta}`.blue);
		
		console.log(`converting pdf to png at ${IMAGE_FILEPATH}`.blue);
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
		
		console.log(`completed converting pdf into png! File at: ${(IMAGE_FILEPATH.magenta)}`.blue);
		console.log(`LaTeX to PNG conversion complete! Adding image to README`.green);

		let imageReadmeContent = `![Brandon Cooke, Software Developer](./${IMAGE_FILENAME})`;
		fs.writeFileSync(README_FILEPATH, imageReadmeContent);

		console.log(`README content written! (${imageReadmeContent.magenta})`.green)
		stopCalculateFile(IMAGE_FILEPATH);
		process.exit(0);
	} catch(e){
		stopCalculateFile(IMAGE_FILEPATH);
		throw e;
	}
}

function formatClsFile(){
	let clsSkeletonFilepath = path.join(SRC_DIR, 'deedy-resume-openfont.skeleton.cls');
	let clsSkeletonFileContent = fs.readFileSync(clsSkeletonFilepath, 'utf8');
	let clsFilepath = path.join(INPUTS_DIR, 'deedy-resume-openfont.cls');

	let params = {
		fontDir: FONTS_DIR
	}
	let merged = handlebars.compile(clsSkeletonFileContent)(params);
	fs.writeFileSync(clsFilepath, merged, 'utf8');
}

function printFilesize(filepath){
	let size = fs.statSync(filepath).size;
	let bytes = pbytes(size);
	console.log(`${filepath}... ${bytes} (${size})`.green);
}

function getFilesize(filepath){
	let size = fs.statSync(filepath).size;
	let bytes = pbytes(size);
	console.log(`writing to ${filepath}... ${bytes} (${size})`.blue);
}
function startCalculateFile(filepath){
	files[filepath] = setInterval(() => getFilesize(filepath), 500)
}
function stopCalculateFile(filepath){
	if(files[filepath]){
		clearInterval(files[filepath]);
	}
}

/** MAIN **/
try{
	console.log('Beginning conversion of LaTeX to PNG...'.green);
	let pdfWriteStream = fs.createWriteStream(PDF_FILEPATH);

	pdfWriteStream.on('error', writeStreamError);
	pdfWriteStream.on('finish', async function(){
		try{
			await convertPdfToPng();
		} catch(e){
			console.error(e);
			process.exit(1);
		}
	})

	console.log(`formatting Cls file with fonts filepath`.blue);
	formatClsFile();
	console.log(`formatted Cls file!`.green);

	console.log(`Fonts: ${FONTS_DIR.yellow}`.blue);
	console.log(`Inputs: ${path.join(__dirname, '..').yellow}`.blue);


	let latexContentReadStream = fs.createReadStream(LATEX_FILEPATH, 'utf8');
	console.log(`collected latex content from file: ${LATEX_FILEPATH.magenta}`.blue);
	console.log(`converting to PDF...`.blue);

	let pdfContent = latex(latexContentReadStream, {
		fonts: FONTS_DIR,
		inputs: INPUTS_DIR,
		cmd: CMD
	});

	console.log(`PDF Content: ${JSON.stringify(pdfContent).magenta}`.blue);
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