document.getElementById("afficherTemplate").addEventListener("click", function() {
    // Créer une nouvelle requête XMLHttpRequest
    var xhr = new XMLHttpRequest();
    
    // Définir la fonction de rappel à exécuter lorsque la requête est terminée
    xhr.onreadystatechange = function() {
        // Vérifier si la requête est terminée et si elle a réussi
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Insérer le contenu du fichier template.html dans la div #contenuTemplate
            document.getElementById("contenuTemplate").innerHTML = xhr.responseText;
        }
    };
    
    // Ouvrir la requête pour charger le fichier template.html
    xhr.open("GET", "template.html", true);
    
    // Envoyer la requête
    xhr.send();
});
