#!/bin/bash
#!/bin/bash

# Vérifiez que deux arguments sont passés : fichier HTML en entrée et fichier PDF en sortie
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 input.html output123.pdf"
    exit 1
fi

# Variables pour les fichiers d'entrée et de sortie
INPUT_HTML=$1
OUTPUT_PDF=$2

# Exécuter wkhtmltopdf avec les fichiers spécifiés
wkhtmltopdf "$INPUT_HTML" $OUTPUT_PDF

# Chemin vers le fichier HTML d'entrée
input_file="./nmap/templatee.html"

# Définir les options pour wkhtmltopdf
page_format="A4"

border="2mm"


# Commande pour générer le PDF avec wkhtmltopdf
sudo wkhtmltopdf \
    --page-size $page_format \
    --margin-top $border \
    --margin-right $border \
    --margin-bottom $border \
    --margin-left $border \
    --enable-javascript
   
   
    "$input_file" output123.pdf

