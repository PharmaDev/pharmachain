#!/bin/bash

# TODO add console params
IP="localhost"
PORT="3000"
ADDR="http://$IP:$PORT"

FOLDER="demodata"
echo "Sending model build requests to $ADDR"

SUF_insurance="/api/de.pharmachain.Insurance"
SUF_doctor="/api/de.pharmachain.Doctor"
SUF_patient="/api/de.pharmachain.Patient"
SUF_pharmacy="/api/de.pharmachain.Pharmacy"


# doctor
eval "curl -d @$FOLDER/doc_0001.json $ADDR$SUF_doctor -H 'Content-Type: application/json'" 
eval "curl -d @$FOLDER/doc_0002.json $ADDR$SUF_doctor -H 'Content-Type: application/json'" 
# pharmacy
eval "curl -d @$FOLDER/pha_0001.json $ADDR$SUF_pharmacy -H 'Content-Type: application/json'" 
eval "curl -d @$FOLDER/pha_0002.json $ADDR$SUF_pharmacy -H 'Content-Type: application/json'" 
# insurance 
eval "curl -d @$FOLDER/i_0001.json $ADDR$SUF_insurance -H 'Content-Type: application/json'" 
eval "curl -d @$FOLDER/i_0002.json $ADDR$SUF_insurance -H 'Content-Type: application/json'" 
# patient
eval "curl -d @$FOLDER/p_0001.json $ADDR$SUF_patient -H 'Content-Type: application/json'" 
eval "curl -d @$FOLDER/p_0002.json $ADDR$SUF_patient -H 'Content-Type: application/json'" 
