#!/bin/bash

# TODO add console params
IP="localhost"
PORT="3000"
ADDR="http://$IP:$PORT/api/"

echo "Sending model build requests to $ADDR"

TO_DELETE=(
    "de.pharmachain.Pharmacy/pha_0001"
    "de.pharmachain.Pharmacy/pha_0002"
    "de.pharmachain.Insurance/i_0001"
    "de.pharmachain.Insurance/i_0002"
    "de.pharmachain.Patient/p_0001"
    "de.pharmachain.Patient/p_0002"
    "de.pharmachain.Doctor/doc_0001"
    "de.pharmachain.Doctor/doc_0002"
)

for DELETE in "${TO_DELETE[@]}"
do
    echo "curl -X DELETE $ADDR$DELETE"
    eval "curl -X DELETE $ADDR$DELETE"
done
