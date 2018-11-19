/**
 * Track the trade of a commodity from one trader to another
 * @param {org.example.mynetwork.PharamcySelection} trade - the trade to be processed
 * @transaction
 */
async function selectPharmacy(pharmacySelected) {
    pharmacySelected.receipt.pharmacy = pharmacySelected.selectedPharmacy;
    let assetRegistry = await getAssetRegistry('org.example.mynetwork.Receipt');
    await assetRegistry.update(pharmacySelected.receipt);
}
