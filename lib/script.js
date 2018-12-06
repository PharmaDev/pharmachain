/**
 * Patients wants to use a receipt and adds his current position
 * @param {de.pharmachain.PositionSelection} input - transaction
 * @transaction
 */
async function selectPosition(input) {
  
  	// add position
    input.receipt.deliveryStreet = input.deliveryStreet;
    input.receipt.deliveryCity = input.deliveryCity;
    input.receipt.deliveryPostal = input.deliveryPostal;

    // update receipt state to progress
    input.receipt.state = "progress";
    input.receipt.stateChangeAt = input.ts;

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
  
    // add accepted offer to receipt 
    input.receipt.offer = input.acceptedOffer
    
    // update receipt state to closed
    input.receipt.state = "closed"
    input.receipt.stateChangeAt = input.ts;

    // update offer state to accepted 
    input.acceptOffer.state = "accepted";
    input.acceptOffer.stateChangeAt = input.ts;

    // update accepted offer
    let offerRegistry = await getAssetRegistry('de.pharmachain.Offer');
    await offerRegistry.update(input.receipt);

    // update offer state of all other receipts to declined
    let declinedOffers = getAssetRegistry('de.pharmachain.Offer')
      .then(function(offerRegistry){
        return offerRegistry.getAll;
      })
      .then(function(offers){
      offers.forEach(function(offer){
        if(offer.receipt.id == input.receipt.id){
          if(offer.id = input.acceptOffer.id){
            offer.state = "declined";
          }
        }
      });
      return offers;
      });

    // update declined offers
    await offerRegistry.updateAll(declinedOffers);

  	// update receipt
    let receiptRegistry = await getAssetRegistry('de.pharmachain.Receipt');
    await receiptRegistry.update(input.receipt);
  
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




