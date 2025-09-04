import pool from './db.js'; // adapte le chemin si besoin

(async () => {
  try {
    const res = await pool.query('SELECT * FROM users LIMIT 1;'); // récupère un utilisateur
    if (res.rows.length > 0) {
      console.log('Connexion OK, voici un utilisateur :', res.rows[0]);
    } else {
      console.log('Connexion OK, mais aucun utilisateur trouvé.');
    }
    await pool.end(); // ferme la connexion proprement
  } catch (err) {
    console.error('Erreur de connexion :', err);
  }
})();
