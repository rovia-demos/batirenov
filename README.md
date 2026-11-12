# Bâtirénov · maquette

Maquette du site de Bâtirénov, rénovation de l'habitat à Font-Romeu (66).

En ligne : https://rovia-demos.github.io/batirenov/

Site statique (HTML, CSS, JS). Polices et scripts d'animation (GSAP, Lenis) hébergés dans le site, aucune requête externe.
Page non indexée (`noindex` + `robots.txt`) tant que c'est une maquette. Le formulaire n'envoie rien : il affiche seulement une confirmation.

## Infos réelles utilisées

- SARL Bâtirénov, SIREN 922 075 734, créée le 1er janvier 2023 (registre officiel), gérant Michael / Mikaël Gonzalez (« Mika »), siège social à Égat
- Premiers chantiers publiés sur Instagram : 2022 (affiché « Depuis 2022 »)
- 13 salles de bain rénovées en 2024 (sa publication Instagram du 22/12/2024)
- 82A avenue du Maréchal Joffre, 66120 Font-Romeu-Odeillo-Via
- 06 71 52 60 96, WhatsApp https://wa.me/33671526096
- Horaires (fiche Google) : lundi au jeudi 8h à 18h, vendredi 8h à 17h, week-end fermé
- Google : 5,0 sur 20 avis. Les 8 avis affichés sont recopiés mot pour mot.
- Instagram : https://www.instagram.com/batirenovv/ (1 108 abonnés, 28 publications au 12/11/2026, chiffres affichés dans la section Instagram : à mettre à jour)
- Section Instagram : 6 de ses vraies publications, chaque vignette ouvre la publication
- Photos : toutes les photos de la galerie, des services, du bloc « Pourquoi » et les 4 paires avant / après viennent de son Instagram et de sa fiche Google. Les avant / après sont des images extraites de ses vidéos (Bolquère, Targasonne, Font-Romeu).
- Vidéo du téléphone (section Résidences secondaires) : sa vraie vidéo avant / après de la salle de bain de Bolquère (déc. 2024), raccourcie et sans le son.

## Contenus d'EXEMPLE à remplacer

Repérés dans le code par le commentaire `EXEMPLE – à remplacer`.

| Où | Quoi | Fichier |
|---|---|---|
| Hero | Image et vidéo du séjour de chalet : visuels d'illustration, pas un chantier du client | `assets/img/hero-*`, `assets/video/hero-*.mp4` (versions HEVC et H.264) |
| En-tête, pied de page, favicon | Logo redessiné en vectoriel d'après l'enseigne de la boutique : à remplacer par le fichier original s'il le fournit | `index.html`, `favicon.svg`, `apple-touch-icon.png` |
| Avant / après cuisine | La photo « après » est une version retouchée en haute définition de sa vraie photo (Targasonne) | `assets/img/ap-cuisine-targasonne-apres.webp` |
| Pourquoi nous | Phrase de Mika (« Je suis votre seul interlocuteur… ») : texte rédigé pour la maquette, à valider avec lui | `index.html` (section `#pourquoi`) |
| Formulaire, pied de page | Email `contact@batirenov.fr` | `index.html` |
| Zone | Communes « Autres communes du secteur » (Égat, Mont-Louis, Matemale, Formiguères, Saillagouse, Angoustrine, Bourg-Madame, Err) | `index.html` (carte) |

## À vérifier avec le client

- Son adresse email
- Les communes où il accepte d'intervenir
- L'autorisation d'utiliser ses photos et vidéos Instagram / Google sur le site
- Les photos de l'appartement de Font-Romeu de 2022 ont été prises par un photographe (@bzieglerpro) : crédit ou accord à prévoir
- La commune du chantier « WC bois et pierre » (non précisée sur Instagram)
- Ses années d'expérience dans le métier (avant la création de la SARL en 2023)
- L'orthographe de son prénom : « Michael » au registre, « Mikaël » dans le brief
- Services cités sur son Instagram mais pas sur la maquette : électroménager, bardage bois. Faut-il les ajouter ?

## Modifier le contenu

- Avant / après : boutons `.ba__tab` (attributs `data-avant`, `data-apres`, `data-desc`), images `assets/img/ap-*-avant.webp` et `ap-*-apres.webp`
- Services : section `#services`, une photo `.sv__img` et un panneau `.sv__panel` par service (même ordre)
- Galerie : section `#realisations`, un `<figure class="g-item" data-cat="…">` par photo (catégories `cuisine`, `sdb`, `vie`, `bois`). La grille se complète toute seule, sans trou.
- Carte : fond de carte en relief tiré d'OpenStreetMap / OpenTopoMap (mention obligatoire sous la carte), communes placées à leurs vraies coordonnées GPS
