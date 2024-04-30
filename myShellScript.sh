#!/bin/bash


# Exécute la commande nmap pour scanner facebook.com et enregistrer les résultats dans resultttt.xml

sudo sh -c "nmap google.com -oX resultttt.xml"

# Exécute la commande xsltproc pour convertir le fichier XML en HTML
xsltproc resultttt.xml -o res.html
# Supprimer les lignes contenant les ports et les services dans le fichier XML
# sed -i '/services\/verbose\/level\/debugging\/services\|ports/d' resultttt.xml
wkhtmltopdf -n res.html pdf_file_name.pdf

# # Utiliser xmlstarlet pour supprimer les attributs numservices et services de la balise scaninfo
# xmlstarlet ed -L -d '//scaninfo/@numservices' -d '//scaninfo/@services' resultttt.xml
# xmlstarlet ed -L -d '//nmaprun/@args' -d '//nmaprun/@start' resultttt.xml
# xmlstarlet ed -L -d '//verbose' resultttt.xml
# xmlstarlet ed -L -d '//debugging' resultttt.xml  
# xmlstarlet ed -L -d '//hosthint//status' resultttt.xml
# xmlstarlet ed -L -d '//hostnames//hostname/@type' resultttt.xml
# xmlstarlet ed -L -d '//host/@starttime' -d '//host/@endtime' resultttt.xml
# xmlstarlet ed -L -d '//host//status/@state' -d '//host//status/@reason' -d '//host//status/@reason_ttl' resultttt.xml
# xmlstarlet ed -L -d '//host//hostnames//hostname' resultttt.xml
# xmlstarlet ed -L -d '//ports//extraports/@count' -d '//ports//extraports//extrareasons'  resultttt.xml
# xmlstarlet ed -L -d '//ports//port//state/@reason_ttl' -d '//ports//port//service/@method' -d '//ports//port//service/@conf'  resultttt.xml
# xmlstarlet ed -L -d '//host//times'  resultttt.xml
# xmlstarlet ed -L -d '//runstats//finished/@time' -d '//runstats//finished/@timestr' -d '//runstats//hosts/@down'  resultttt.xml
# # Supprimer la balise <hosthint> en conservant ses attributs
# xmlstarlet ed -L -d '//hosthint' resultttt.xml 
# xmlstarlet ed -L -d '//status' resultttt.xml 

# xmlstarlet ed -d '//host' resultttt.xml | xmlstarlet fo 


# xmlstarlet ed -L -u '//hosthint' -v '<>' resultttt.xml
# Remplacer le fichier d'origine par le fichier nettoyé


