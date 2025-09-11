import fs from "fs";
import PDFDocument from "pdfkit";

function generateReceipt(filename = "recu_test.pdf") {
  const doc = new PDFDocument();

  // Créer le fichier PDF
  doc.pipe(fs.createWriteStream(filename));

  // Contenu du reçu factice
  doc.fontSize(20).text("Reçu de Test", { align: "center" });
  doc.moveDown();
  doc.fontSize(14).text("Nom de l'utilisateur : Test User");
  doc.text(`Date : ${new Date().toLocaleDateString()}`);
  doc.text("Montant : 123,45 €");
  doc.text("Description : Dépense factice pour tests");

  doc.end();
  console.log(`PDF généré : ${filename}`);
}

// Générer un PDF
generateReceipt();
