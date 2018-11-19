/**
 * Patients wants to use a receipt and adds his current position
 * @param {de.pharmachain.PositionSelection} input - transaction
 * @transaction
 */
async function selectPosition(input) {
  
  	// add position and set receipt in progress
    input.receipt.deliveryStreet = input.deliveryStreet
    input.receipt.deliveryCity = input.deliveryCity
    input.receipt.deliveryPostal = input.deliveryPostal
    input.receipt.state = "progress"
    
  	// update receipt
    let assetRegistry = await getAssetRegistry('de.pharmachain.Receipt');
    await assetRegistry.update(input.receipt);
}

/**
 * Patient accepts an offer by a Pharmacy
 * @param {de.pharmachain.OfferAccepted} input - transaction
 * @transaction
 */
async function acceptOffer(input) {
  
    // add accepted offer to receipt & close receipt 
    input.receipt.offer = input.acceptedOffer
    input.receipt.state = "closed"
    
  	// update receipt
    let assetRegistry = await getAssetRegistry('de.pharmachain.Receipt');
    await assetRegistry.update(input.receipt);
  
    // remove money from patient and update patient
  	let patientRegistry = await getParticipantRegistry('de.pharmachain.Patient'); 
    let patient = input.receipt.patient;
    patient.money -= input.acceptedOffer.patientCost
  	await patientRegistry.update(patient);

  	// remove money from insurance and update insurance
    let insuranceRegistry = await getParticipantRegistry('de.pharmachain.Insurance'); 
  	let insurance  = input.receipt.patient.insurance;
    insurance.money -= input.acceptedOffer.insuranceCost
  	await insuranceRegistry.update(insurance);
  
  	// add money to pharmacy and add pharmacy
    let pharmacyRegistry = await getParticipantRegistry('de.pharmachain.Pharmacy'); 
  	let pharmacy  = input.acceptedOffer.pharmacy;
    pharmacy.money += input.acceptedOffer.insuranceCost
    pharmacy.money += input.acceptedOffer.patientCost
  	await pharmacyRegistry.update(pharmacy);
}




