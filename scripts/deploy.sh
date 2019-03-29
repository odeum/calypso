#!/bin/bash

if [[ "$1" == "master" ]]; then 
	echo
	echo Deploying Calypso Admin App Frontend $1 ... 
	rsync -r --quiet $2/ deploy@organa.webhouse.net:/srv/odeumcode/admin.calypso.watsonc.dk
	rsync -r --quiet $2/ deploy@rey.webhouse.net:/srv/www/odeumcode/admin.calypso.watsonc.dk
	echo
	curl -X POST -H 'Content-type: application/json' --data '{"text":"Calypso Admin App MASTER updated!"}' https://hooks.slack.com/services/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
	echo Deployment to production done!
#	exit 0
fi 

# if [[ "$1" == "dev" ]]; then 
# 	echo
# 	echo Deploying Calypso Frontend $1 ... 
# 	rsync -r --quiet $2/ deploy@organa.webhouse.net:/srv/odeumcode/dev.admin.calypso.watsonc.dk
# 	echo
# 	echo Deployment to dev done!
# #	exit 0
# fi