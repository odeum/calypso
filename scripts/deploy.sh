#!/bin/bash

if [[ "$1" == "master" ]]; then 
	echo
	echo Deploying Calypso Frontend $1 ... 
	rsync -r --quiet $2/ deploy@organa.webhouse.net:/srv/odeumcode/admin.calypso.watsonc.dk
	echo
	echo Deployment to production done!
#	exit 0
fi 

if [[ "$1" == "dev" ]]; then 
	echo
	echo Deploying Senti API $1 ... 
	rsync -r --quiet $2/ deploy@organa.webhouse.net:/srv/odeumcode/dev.admin.calypso.watsonc.dk
	echo
	echo Deployment to dev done!
#	exit 0
fi