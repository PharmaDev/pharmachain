# pharmachain

A project putting the transactions between patients, doctors, pharmacies and insurances on the blockchain.

## Installation

Snippets um Projekt auf Ubuntu 18.04 zu installieren:

### Vorbedingungen/Depedencies:
```
curl -O https://hyperledger.github.io/composer/latest/prereqs-ubuntu.sh
chmod u+x prereqs-ubuntu.sh
./prereqs-ubuntu.sh
```

### Hyperledger Composer:
Wichtig: Exakte Version, mit aktuelleren kann das BNA nicht depolyed werden.
```
npm install -g composer-cli@0.20
npm install -g composer-rest-server@0.20
```

### Hyperledger Fabric:
```
mkdir ~/fabric-dev-servers && cd ~/fabric-dev-servers
curl -O https://raw.githubusercontent.com/hyperledger/composer-tools/master/packages/fabric-dev-servers/fabric-dev-servers.tar.gz
tar -xvf fabric-dev-servers.tar.gz
cd ~/fabric-dev-servers
export FABRIC_VERSION=hlfv12
./downloadFabric.sh
```

## Deployen

Hyperledger Fabric starten, neue PeerAdminCard erstellen:  
```
cd ~/fabric-dev-servers
export FABRIC_VERSION=hlfv12
./startFabric.sh
./createPeerAdminCard.sh
```

Um das Projekt zu deployen, zunächst Business Network Archive aus Source-Dateien erstellen. 
Ergebnis ist eine .bna Datei. Der Dateiname hat den Aufbau pharmachain@<Versionsnummer>.bna.
  
```
composer archive create -t dir -n .

```

Zum Installieren:

```
composer network install --card PeerAdmin@hlfv1 --archiveFile tutorial-network@<Versionsnummer>.bna  
composer network start --networkName pharmachain --networkVersion <Versionsnummer> --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card
composer card import --file networkadmin.card
composer network ping --card admin@pharmachain

```

Rest API generieren und starten, Endpunkte beginnen mit http://localhost:3000.  

```
composer-rest-server -c admin@pharmachain -n always -u true -w true
```

## Entwickeln mit Composer Playground

Composer Playground installieren:  
```
npm install -g generator-hyperledger-composer@0.20
```

Composer Playground starten:
```
composer-playground
```

Zur Bedienung von Composer Playground:  
https://hyperledger.github.io/composer/latest/tutorials/playground-tutorial.html

Nachdem ein Update deployed wurde, muss die REST-API neu generiert und gestartet werden.  
Dazu mglw noch laufende Instanz beenden und wie oben starten. 

## Entwickeln ohne Composer Playground

TODO  

## Anmerkungen

Man kann Business Networks nicht über Composer deinstallieren:
https://github.com/hyperledger/composer/issues/3235

Falls ein Problem auftritt (z.B. Installation unterbrochen), Fabric ausschalten, zerstören, neustarten:
```
cd ~/fabric-dev-servers
./stopFabric.sh
./teardownFabric.sh
./startFabric.sh
./createPeerAdminCard.sh
```

## Quellen

Source: https://hyperledger.github.io/composer/latest/installing/installing-prereqs.html
Source: https://hyperledger.github.io/composer/latest/installing/development-tools.html
Source: https://hyperledger.github.io/composer/latest/tutorials/developer-tutorial.html  




