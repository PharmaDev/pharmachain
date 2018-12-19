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

  // get all asset registrys
  let receiptRegistry = await getAssetRegistry('de.pharmachain.Receipt');
  let offerRegistry = await getAssetRegistry('de.pharmachain.Offer');
  let patientRegistry = await getParticipantRegistry('de.pharmachain.Patient');
  let insuranceRegistry = await getParticipantRegistry('de.pharmachain.Insurance');
  let pharmacyRegistry = await getParticipantRegistry('de.pharmachain.Pharmacy');
  
  // add accepted offer to receipt 
  input.receipt.acceptedOffer = input.acceptedOffer;

  // update receipt state to closed
  input.receipt.state = "closed";
  input.receipt.stateChangeAt = input.ts;

  // update receipt in registry
  await receiptRegistry.update(input.receipt);

  // update accpted offer state to accepted 
  input.acceptedOffer.state = "accepted";
  input.acceptedOffer.stateChangeAt = input.ts;

  // update accepted offer in registry
  await offerRegistry.update(input.acceptedOffer);

    // update offer state of all other receipts to declined
  // get all offers
  await offerRegistry.getAll()
    .then(function (offers) {
      let declinedOffers = []
      offers.forEach(function (offer) {
        // select all offers to the given receipt
        // TODO found the error, offer is a relation, not an asset
        // TODO this is a hotfix
        if (offer.receipt.$identifier == input.receipt.id) {
          // ignore accepted offer
          if (offer.id !== input.acceptedOffer.id) {
            offer.state = "declined";
            declinedOffers.push(offer);
          }
        }
      });
      return declinedOffers;
    })
    .then(function (offers) {
      offerRegistry.updateAll(offers);
    });
  
  // remove money from patient and update patient
  let patient = input.receipt.patient;
  patient.money -= input.acceptedOffer.patientCost
  await patientRegistry.update(patient);

  // remove money from insurance and update insurance
  let insurance = input.receipt.patient.insurance;
  insurance.money -= input.acceptedOffer.insuranceCost
  await insuranceRegistry.update(insurance);

  // add money to pharmacy and add pharmacy
  let pharmacy = input.acceptedOffer.pharmacy;
  pharmacy.money += input.acceptedOffer.insuranceCost
  pharmacy.money += input.acceptedOffer.patientCost
  await pharmacyRegistry.update(pharmacy);
}