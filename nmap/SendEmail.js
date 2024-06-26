const nodemailer = require('nodemailer');


async function sendEmailWithAttachment(email, attachmentPath) {
    try {
      // Créer un transporteur SMTP
      let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'dabbaghi.walid1@gmail.com', // Remplacez par votre adresse email Gmail
          pass: 'izsm ytap wocy uzmq' // Remplacez par votre mot de passe Gmail
        }
      });
  
      // Options de l'email
      let mailOptions = {
        from: 'dabbaghi.walid1@gmail.com', // Adresse email de l'expéditeur
        to: email, // Adresse email du destinataire
        subject: 'Fichier PDF en pièce jointe', // Sujet de l'email
        text: 'Veuillez trouver le fichier PDF en pièce jointe.', // Corps de l'email
        attachments: [
          {
            filename: 'nmapscan.pdf', // Nom du fichier PDF en pièce jointe
            path: attachmentPath // Chemin du fichier PDF
          }
        ]
      };
  
      // Envoyer l'email
      let info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ', info.messageId);
      return true; // Indication de succès
    } catch (error) {
      console.error('Error sending email: ', error);
      return false; // Indication d'échec
    }
  }
  
  

module.exports = sendEmailWithAttachment;