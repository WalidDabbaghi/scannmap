// Chargement du fichier XML
var xhr = new XMLHttpRequest();
xhr.open('GET', './resultttt.xml', true);
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
        // Récupération du contenu XML
        var xmlData = xhr.responseXML;
  

        // Extraction des données nécessaires
        var startstr = xmlData.getElementsByTagName('nmaprun')[0].getAttribute('startstr');
        var addr = xmlData.getElementsByTagName('address')[0].getAttribute('addr');
        var name = xmlData.getElementsByTagName('hostname')[0].getAttribute('name');
        var protocol = xmlData.getElementsByTagName('port')[0].getAttribute('protocol');
        var protocol1 = xmlData.getElementsByTagName('port')[1].getAttribute('protocol');
        var portid = xmlData.getElementsByTagName('port')[0].getAttribute('portid');
        var portid1 = xmlData.getElementsByTagName('port')[1].getAttribute('portid');
        // var ports = xmlData.getElementsByTagName('port');
        var state = xmlData.getElementsByTagName('state')[0].getAttribute('state');

        // Affichage des données
        console.log("Date de début de l'analyse: " + startstr);
        console.log("Adresse IP: " + addr);
        console.log("Nom d'hôte: " + name);
        console.log("ID du port1: " + portid);
        console.log("Protocole1: " + protocol);
        console.log("ID du port2: " + portid1);
        console.log("Protocole2: " + protocol1);
        console.log("État du port: " + state);
      

        //  document.getElementById('infosPorts').innerHTML = portsInfo;
       
        // Vous pouvez utiliser ces données comme bon vous semble, comme les insérer dans un modèle HTML, par exemple.
                // Insérer les données dans le modèle HTML
                var balisestartstr = document.querySelectorAll('.time');
                balisestartstr.forEach(function(balise) {
                    balise.textContent = startstr ;
                });
                var baliseAdresse = document.querySelectorAll('.adresse');
                baliseAdresse.forEach(function(balise) {
                    balise.textContent = addr;
                });
                var balisename = document.querySelectorAll('.nomHote');
                balisename.forEach(function(balise) {
                    balise.textContent = name;
                });
                var baliseprotocol = document.querySelectorAll('.protocole');
                baliseprotocol.forEach(function(balise) {
                    balise.textContent = protocol;
                });
                var baliseportid = document.querySelectorAll('.port');
                baliseportid.forEach(function(balise) {
                    balise.textContent = portid;
                });
                var baliseprotocol1 = document.querySelectorAll('.protocole1');
                baliseprotocol1.forEach(function(balise) {
                    balise.textContent = protocol1;
                });
                var baliseportid1 = document.querySelectorAll('.port1');
                baliseportid1.forEach(function(balise) {
                    balise.textContent = portid1;
                });
                var balisestate= document.querySelectorAll('.etatPort');
                balisestate.forEach(function(balise) {
                    balise.textContent = state;
                });

                document.getElementsByClassName('time').textContent = startstr;
                document.getElementsByClassName('adresse').textContent = addr;
                document.getElementsByClassName('nomHote').textContent =  name;
                document.getElementsByClassName('protocole').textContent = protocol
                document.getElementsByClassName('Port').textContent = portid;
                document.getElementsByClassName('protocole1').textContent = protocol1
                document.getElementsByClassName('Port1').textContent = portid1;
                document.getElementsByClassName('etatPort').textContent =  state;
                // document.getElementsByClassName('.titre').textContent = "Titre modifié";
    }
};
xhr.send();