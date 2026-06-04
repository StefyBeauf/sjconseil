# Site SJ Conseil

Homepage statique premium pour SJ Conseil, compatible GitHub Pages.

## Structure

- `index.html` : homepage complete en one-page
- `styles.css` : charte dark editorial premium
- `script.js` : menu mobile, ancres, effets discrets
- `assets/` : photo et logos partenaires

## Test local simple

Ouvrir `index.html` dans un navigateur suffit.

Pour tester comme un vrai site :

```bash
python3 -m http.server 8080
```

Puis ouvrir `http://localhost:8080`.

## Deploiement GitHub Pages

1. Creer un depot GitHub.
2. Envoyer tous les fichiers du dossier.
3. Dans GitHub : `Settings > Pages`.
4. Choisir la branche `main`, dossier `/root`.
5. Pour un test simple, ne pas ajouter de fichier `CNAME`.
6. Quand le site sera valide et que le domaine devra pointer vers GitHub Pages, renommer `CNAME.example` en `CNAME`.

Le contact utilise des liens email et telephone. Pour un vrai formulaire, utiliser ensuite Formspree, Tally ou un webhook Zapier.
