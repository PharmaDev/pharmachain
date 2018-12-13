#!/bin/bash

eval "~/fabric-dev-servers/stopFabric.sh"
eval "~/fabric-dev-servers/tearDownFabric.sh"
eval "~/fabric-dev-servers/startFabric.sh"
eval "~/fabric-dev-servers/createPeerAdminCard.sh"

eval "composer archive create -t dir -n ."

FILE=$1
echo $FILE
IFS=’@’ read -ra SPLIT <<< "$FILE"
BNA=${SPLIT[0]}
VER=${SPLIT[1]::-4}
echo $FILE
echo $BNA
echo $VER

eval "composer network install --card PeerAdmin@hlfv1 --archiveFile $FILE" 
eval "composer network start --networkName $BNA --networkVersion $VER --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card"
eval "composer card delete --card admin@$BNA"
eval "composer card import --file networkadmin.card"
eval "composer network ping --card admin@$BNA"
