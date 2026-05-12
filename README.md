# La Ferme Tuniso-Suisse — site web

Site officiel de la **Ferme Agricole Tuniso-Suisse**, à Turki (Nabeul).
Marché, restaurant et privatisation pour événements.

Construit avec **[Astro](https://astro.build) 5** (basé sur Vite),
**React** (uniquement pour le formulaire de demande), **Tailwind v4**
et **Mailgun** pour la livraison des emails. Déployé sur **Vercel**.

Pour les **petites tablées**, pas de réservation : les clients
viennent quand ils veulent pendant les horaires d'ouverture.
Le site sert de point de contact pour les **grandes tablées
(10+ personnes), événements privés et commandes en gros** — section
*Nous contacter* (#demande).

---

## Démarrage rapide

Prérequis : **Node.js ≥ 18.17** (recommandé : 20 LTS).

```bash
npm install      # installe les dépendances
npm run dev      # lance le serveur de développement → http://localhost:4321
npm run build    # construit le site pour la production (dossier dist/)
npm run preview  # prévisualise le build de production
npm run check    # vérifie les types TypeScript
```

---

## Modifier le site sans toucher au code

### Coordonnées, horaires, adresse

Tout est centralisé dans **[src/data/site.ts](src/data/site.ts)** :
téléphone, email, adresse, coordonnées GPS, horaires, liens Facebook
et Google Maps. Modifier ce fichier met à jour automatiquement le
pied de page, la section "Nous trouver", la section "Réserver" (le
numéro affiché en grand) et le JSON-LD SEO.

### Catalogue du marché

Chaque produit est un fichier Markdown sous
**[src/content/products/](src/content/products/)** — par exemple
[oranges-sanguines.md](src/content/products/oranges-sanguines.md) :

```markdown
---
title: Oranges sanguines
season: Hiver        # Toute l'année | Printemps | Été | Automne | Hiver
order: 1             # ordre d'affichage
image: ../../assets/market/oranges-sanguines.jpg
description: Variété Sakasli cultivée sur la ferme — jus riche, couleur rouge intense.
---
```

Pour ajouter un produit : créer un nouveau `.md`, déposer la photo
dans `src/assets/market/` et remplir les champs ci-dessus.
Pour retirer un produit : supprimer son fichier `.md`.

### Photos

- Hero / page d'accueil : [src/assets/hero/landing.jpg](src/assets/hero/landing.jpg)
- Restaurant : [src/assets/restaurant/](src/assets/restaurant/)
- Marché : [src/assets/market/](src/assets/market/)
- Photos d'ambiance ferme : [src/assets/extra/](src/assets/extra/)

Astro optimise automatiquement chaque image (WebP, tailles responsives).
Aucun script de redimensionnement à exécuter — vous pouvez déposer
le fichier directement et le builder s'occupe du reste.

---

## Configuration Mailgun

Le formulaire de demande envoie un email via [Mailgun](https://www.mailgun.com/).
Variables d'environnement nécessaires (à renseigner dans le tableau
de bord Vercel, **jamais en clair dans le repo**) :

| Variable | Description |
|---|---|
| `MAILGUN_API_KEY` | Clé API privée — Mailgun → *Sending API key* |
| `MAILGUN_DOMAIN` | Domaine d'envoi vérifié (ex. `mg.lafermetunisosuisse.com`) |
| `MAILGUN_REGION` | `us` ou `eu` selon votre compte |
| `MAILGUN_FROM` | Adresse expéditrice (ex. `"La Ferme <no-reply@mg…>"`) |
| `MAILGUN_TO` | Boîte destinataire des demandes (`infos@…`) |

Pour le développement local, copier `.env.example` vers `.env` :

```bash
cp .env.example .env
# puis renseigner les vraies valeurs
```

---

## Déploiement (Vercel)

Le projet est configuré pour Vercel via
[`@astrojs/vercel`](https://docs.astro.build/en/guides/integrations-guide/vercel/).
Aucun fichier `vercel.json` n'est nécessaire — Vercel détecte Astro
automatiquement et l'adaptateur produit déjà le format `.vercel/output/`
attendu.

### Première mise en ligne

1. Pousser cette branche sur le dépôt Git distant :

   ```bash
   git push -u origin v2-astro
   ```

2. Sur [vercel.com/new](https://vercel.com/new), *Import Git Repository*
   et choisir ce dépôt.
3. Sélectionner la branche `v2-astro`. Vercel détecte automatiquement
   le framework (Astro) et la commande de build (`npm run build`).
4. Avant de cliquer *Deploy*, déplier *Environment Variables* et
   renseigner les 5 variables `MAILGUN_*` listées ci-dessus.
   Cocher *Production*, *Preview* et *Development* pour les rendre
   disponibles partout.
5. Cliquer *Deploy*. Vercel fournit une URL de prévisualisation
   (`https://<random>.vercel.app`).
6. Une fois validée, fusionner `v2-astro` dans `main` et configurer
   le domaine personnalisé (`www.lafermetunisosuisse.com`) dans
   *Project → Settings → Domains*.

### Comportement automatique

- Chaque push sur `v2-astro` génère un *Preview Deployment*. Chaque
  push sur `main` met à jour la *Production*.
- L'endpoint `/api/inquiry` devient une **Vercel Function** —
  visible dans *Project → Logs* avec ses traces (utile pour
  diagnostiquer un envoi Mailgun raté).
- Pour tester localement avec les variables de production, installer
  la CLI Vercel et lancer `vercel link` puis `vercel env pull .env`.

---

## Structure du projet

```
src/
├── assets/                  # photos sources (optimisées par Astro)
│   ├── hero/, market/, restaurant/, extra/, brand/
├── components/
│   ├── layout/              # Navbar, Footer, Logo, JsonLd
│   ├── sections/            # Hero, Story, Market, Restaurant, Events,
│   │                        #   Visit, Inquiry (contact card / form)
│   ├── ui/                  # primitives : Button, SectionLabel, Hairline, StatRow
│   └── islands/             # composants React (formulaire de demande)
├── content/
│   └── products/*.md        # catalogue marché — un fichier par produit
├── data/
│   └── site.ts              # contact, horaires, adresse, géo
├── i18n/
│   ├── fr.json              # traductions partagées (nav, CTA…)
│   └── t.ts                 # helper t() pour ajouter des langues plus tard
├── layouts/
│   └── Base.astro           # squelette HTML, SEO, polices
├── lib/
│   ├── inquiry-schema.ts    # schéma Zod du formulaire de demande
│   └── mailgun.ts           # client Mailgun (server-only)
├── pages/
│   ├── index.astro          # page d'accueil (compose les sections)
│   └── api/inquiry.ts       # endpoint POST → Mailgun
└── styles/
    └── global.css           # tokens @theme, typographie de base
```

---

## Ajouter une langue (anglais ou arabe, plus tard)

1. Dupliquer `src/i18n/fr.json` → `en.json` (ou `ar.json`), traduire
   les valeurs.
2. Dans `astro.config.mjs`, ajouter `"en"` (et/ou `"ar"`) à la liste
   `i18n.locales`.
3. Importer le nouveau dictionnaire dans `src/i18n/t.ts` et l'ajouter
   à l'objet `dictionaries`.
4. Pour les paragraphes longs encore inline dans les composants,
   les remplacer progressivement par `t("section.key")` au fur et
   à mesure du besoin.
5. Ajouter un sélecteur de langue dans la `Navbar` si souhaité.

L'arabe (RTL) nécessitera en plus de basculer `dir="rtl"` sur
l'élément `<html>` et d'ajuster quelques styles directionnels —
Tailwind supporte les variantes RTL nativement.

---

## Dépannage

- **`npm run dev` se lance mais le formulaire ne s'envoie pas en local**
  → normal : Mailgun n'est pas configuré localement. L'endpoint
  retourne 502. Pour tester l'envoi en réel, configurer un domaine
  sandbox Mailgun et un `.env` local.
- **Une photo n'apparaît pas après ajout** → vérifier que le chemin
  dans le frontmatter du `.md` est bien relatif au fichier
  (`../../assets/market/...`) et pas absolu.
- **Le build échoue avec `Cannot find module 'astro:content'`** →
  exécuter `npx astro sync` puis recommencer.

---

## Stack & licences

- [Astro](https://astro.build) (MIT)
- [React](https://react.dev) (MIT)
- [Tailwind CSS v4](https://tailwindcss.com) (MIT)
- [Zod](https://zod.dev) (MIT)
- [Mailgun](https://www.mailgun.com/) (service tiers)
- Polices : [Fraunces](https://fonts.google.com/specimen/Fraunces) +
  [Inter](https://rsms.me/inter/) — auto-hébergées via
  [Fontsource](https://fontsource.org).
