#!/bin/bash
#brew cask install mactex

if [[ -z $(command -v brew) ]]; then
	echo "Installing Homebrew"
	/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
fi

brew tap homebrew/cask
brew cask install basictex


cp ~/.bash_profile ~/.bash_profile_backup
cmd="export PATH=\"/usr/local/texlive/2016basic/bin/x86_64-darwin:$PATH\""
if [[ $(cat ~/.bash_profile) =~ $cmd ]]; then
	echo 'adding PATH line to bash profile'
	echo  >> ~/.bash_profile
	source ~/.bash_profile
fi

sudo tlmgr update --self
sudo tlmgr install texliveonfly
brew install imagemagick ghostscript poppler