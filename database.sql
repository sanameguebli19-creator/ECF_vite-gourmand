-- ============================================================
--  BASE DE DONNÉES MYSQL — Vite & Gourmand
--  ECF — FastDev Agency — 2026
-- ============================================================

CREATE DATABASE IF NOT EXISTS vite_gourmand
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE vite_gourmand;

-- ============================================================
--  TABLE : utilisateur
-- ============================================================
CREATE TABLE utilisateur (
  id_utilisateur  INT          AUTO_INCREMENT PRIMARY KEY,
  prenom          VARCHAR(50)  NOT NULL,
  nom             VARCHAR(50)  NOT NULL,
  email           VARCHAR(100) NOT NULL UNIQUE,
  mot_de_passe    VARCHAR(255) NOT NULL,          -- bcrypt hash
  gsm             VARCHAR(20),
  adresse         VARCHAR(255),
  role            ENUM('client','employe','admin') NOT NULL DEFAULT 'client',
  actif           TINYINT(1)   NOT NULL DEFAULT 1,
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
--  TABLE : allergene
-- ============================================================
CREATE TABLE allergene (
  id_allergene    INT         AUTO_INCREMENT PRIMARY KEY,
  nom             VARCHAR(50) NOT NULL UNIQUE,    -- ex: Gluten, Lait, Oeufs
  icone           VARCHAR(10)                     -- emoji optionnel
);

-- ============================================================
--  TABLE : menu
-- ============================================================
CREATE TABLE menu (
  id_menu         INT           AUTO_INCREMENT PRIMARY KEY,
  nom             VARCHAR(100)  NOT NULL,
  description     TEXT,
  theme           ENUM('noel','paques','classique','evenement','vegan') NOT NULL,
  regime          ENUM('classique','vegetarien','vegan')                NOT NULL DEFAULT 'classique',
  prix_par_pers   DECIMAL(8,2)  NOT NULL,
  nb_pers_min     INT           NOT NULL DEFAULT 4,
  stock           INT           NOT NULL DEFAULT 10,
  actif           TINYINT(1)    NOT NULL DEFAULT 1,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
--  TABLE : plat
-- ============================================================
CREATE TABLE plat (
  id_plat         INT           AUTO_INCREMENT PRIMARY KEY,
  nom             VARCHAR(100)  NOT NULL,
  description     TEXT,
  categorie       ENUM('entree','plat','dessert','boisson') NOT NULL,
  icone           VARCHAR(10)
);

-- ============================================================
--  TABLE : propose  (menu <-> plat)
-- ============================================================
CREATE TABLE propose (
  id_menu         INT NOT NULL,
  id_plat         INT NOT NULL,
  PRIMARY KEY (id_menu, id_plat),
  FOREIGN KEY (id_menu) REFERENCES menu(id_menu)  ON DELETE CASCADE,
  FOREIGN KEY (id_plat) REFERENCES plat(id_plat)  ON DELETE CASCADE
);

-- ============================================================
--  TABLE : contient_allergene  (plat <-> allergene)
-- ============================================================
CREATE TABLE contient_allergene (
  id_plat         INT NOT NULL,
  id_allergene    INT NOT NULL,
  PRIMARY KEY (id_plat, id_allergene),
  FOREIGN KEY (id_plat)      REFERENCES plat(id_plat)          ON DELETE CASCADE,
  FOREIGN KEY (id_allergene) REFERENCES allergene(id_allergene) ON DELETE CASCADE
);

-- ============================================================
--  TABLE : commande
-- ============================================================
CREATE TABLE commande (
  id_commande     INT           AUTO_INCREMENT PRIMARY KEY,
  id_utilisateur  INT           NOT NULL,
  id_menu         INT           NOT NULL,
  nb_personnes    INT           NOT NULL,
  date_prestation DATE          NOT NULL,
  heure_livraison TIME          NOT NULL,
  adresse_livraison VARCHAR(255) NOT NULL,
  montant_total   DECIMAL(10,2) NOT NULL,
  reduction       DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  statut          ENUM('en_attente','acceptee','en_preparation','en_livraison','livree','terminee','annulee')
                  NOT NULL DEFAULT 'en_attente',
  notes           TEXT,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur) ON DELETE RESTRICT,
  FOREIGN KEY (id_menu)        REFERENCES menu(id_menu)               ON DELETE RESTRICT
);

-- ============================================================
--  TABLE : avis
-- ============================================================
CREATE TABLE avis (
  id_avis         INT       AUTO_INCREMENT PRIMARY KEY,
  id_utilisateur  INT       NOT NULL,
  id_commande     INT       NOT NULL UNIQUE,     -- 1 avis par commande
  note            TINYINT   NOT NULL CHECK (note BETWEEN 1 AND 5),
  commentaire     TEXT,
  valide          TINYINT(1) NOT NULL DEFAULT 0, -- validé par employé
  created_at      DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE,
  FOREIGN KEY (id_commande)    REFERENCES commande(id_commande)       ON DELETE CASCADE
);

-- ============================================================
--  TABLE : horaire
-- ============================================================
CREATE TABLE horaire (
  id_horaire      INT         AUTO_INCREMENT PRIMARY KEY,
  jour            ENUM('lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche') NOT NULL UNIQUE,
  heure_ouverture TIME,
  heure_fermeture TIME,
  ferme           TINYINT(1)  NOT NULL DEFAULT 0
);

-- ============================================================
--  TABLE : contact
-- ============================================================
CREATE TABLE contact (
  id_contact      INT          AUTO_INCREMENT PRIMARY KEY,
  titre           VARCHAR(150) NOT NULL,
  email           VARCHAR(100) NOT NULL,
  message         TEXT         NOT NULL,
  lu              TINYINT(1)   NOT NULL DEFAULT 0,
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
--  DONNÉES INITIALES
-- ============================================================

-- Allergènes
INSERT INTO allergene (nom, icone) VALUES
  ('Gluten',      '🌾'),
  ('Lait',        '🥛'),
  ('Oeufs',       '🥚'),
  ('Arachides',   '🥜'),
  ('Poisson',     '🐟'),
  ('Crustacés',   '🦞'),
  ('Soja',        '🫘'),
  ('Fruits à coque','🌰');

-- Horaires
INSERT INTO horaire (jour, heure_ouverture, heure_fermeture, ferme) VALUES
  ('lundi',    '09:00', '18:00', 0),
  ('mardi',    '09:00', '18:00', 0),
  ('mercredi', '09:00', '18:00', 0),
  ('jeudi',    '09:00', '18:00', 0),
  ('vendredi', '09:00', '17:00', 0),
  ('samedi',   '10:00', '15:00', 0),
  ('dimanche', NULL,    NULL,    1);

-- Utilisateurs (mots de passe hashés avec bcrypt)
INSERT INTO utilisateur (prenom, nom, email, mot_de_passe, gsm, adresse, role) VALUES
  ('Admin',  'Vite',   'admin@vitegourmand.fr',  '$2y$12$hash_admin_exemple',  NULL, NULL, 'admin'),
  ('José',   'Martin', 'jose@vitegourmand.fr',   '$2y$12$hash_employe_exemple', '0556001122', NULL, 'employe'),
  ('Julie',  'Dupont', 'julie@exemple.fr',        '$2y$12$hash_client_exemple',  '0612345678', '12 rue des Chartrons, 33000 Bordeaux', 'client');

-- Menus
INSERT INTO menu (nom, description, theme, regime, prix_par_pers, nb_pers_min, stock) VALUES
  ('Le Grand Festin de Noël',      'Menu festif avec foie gras, dinde rôtie aux marrons et bûche maison.',           'noel',      'classique',   65.00, 8,  10),
  ('Table de Pâques Printanière',  'Menu printanier avec agneau de lait, légumes du marché et charlotte aux fraises.','paques',    'classique',   48.00, 6,  15),
  ('Menu Classique Bordeaux',      'Menu gastronomique avec produits locaux bordelais.',                              'classique', 'classique',   38.00, 4,  20),
  ('Menu Vegan Saveurs du Monde',  'Menu 100% végétal élaboré avec des épices du monde.',                            'classique', 'vegan',       35.00, 4,  20),
  ('Cocktail Dinatoire Prestige',  'Buffet cocktail élaboré pour vos événements professionnels et privés.',          'evenement', 'classique',   75.00, 20, 5),
  ('Pâques Végétarienne',          'Menu végétarien de Pâques avec légumes de saison et fromages fermiers.',         'paques',    'vegetarien',  42.00, 6,  15);

-- Plats
INSERT INTO plat (nom, description, categorie, icone) VALUES
  ('Foie gras maison',        'Foie gras de canard mi-cuit, chutney de figues',         'entree',  '🦢'),
  ('Velouté de butternut',    'Crème de courge, éclats de châtaignes, huile de truffe', 'entree',  '🍵'),
  ('Dinde rôtie aux marrons', 'Dinde fermière farcie, sauce au vin rouge',              'plat',    '🦃'),
  ('Gratin dauphinois',       'Pommes de terre à la crème fraîche et ail confit',       'plat',    '🥔'),
  ('Bûche de Noël maison',    'Bûche chocolat-praline, décoration festive',             'dessert', '🎂'),
  ('Mignardises',             'Truffes chocolat, nougats et guimauves artisanales',     'dessert', '🍫'),
  ('Agneau de lait rôti',     'Agneau fermier, herbes de Provence, jus corsé',          'plat',    '🐑'),
  ('Charlotte aux fraises',   'Biscuits cuillères, crème mousseuse, fraises fraîches',  'dessert', '🍓'),
  ('Curry de légumes',        'Légumes de saison, lait de coco, riz basmati',           'plat',    '🍛'),
  ('Tarte tatin vegan',       'Pommes caramélisées, pâte sans beurre',                  'dessert', '🥧');

-- Propose (menu <-> plat)
INSERT INTO propose (id_menu, id_plat) VALUES
  (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),  -- Noël
  (2,2),(2,7),(2,8),                     -- Pâques
  (3,1),(3,3),(3,5),                     -- Classique
  (4,9),(4,10),                          -- Vegan
  (6,2),(6,9),(6,10);                    -- Pâques veg

-- Allergènes des plats
INSERT INTO contient_allergene (id_plat, id_allergene) VALUES
  (1,1),(1,2),   -- foie gras : gluten, lait
  (2,2),         -- velouté : lait
  (3,1),         -- dinde : gluten
  (4,2),         -- gratin : lait
  (5,1),(5,2),(5,3), -- bûche : gluten, lait, oeufs
  (6,2),(6,3),   -- mignardises : lait, oeufs
  (8,1),(8,2),(8,3); -- charlotte : gluten, lait, oeufs

-- Commandes
INSERT INTO commande (id_utilisateur, id_menu, nb_personnes, date_prestation, heure_livraison, adresse_livraison, montant_total, reduction, statut) VALUES
  (3, 1, 12, '2025-12-24', '12:00:00', '12 rue des Chartrons, 33000 Bordeaux', 702.00, 78.00, 'terminee'),
  (3, 2,  8, '2025-04-20', '11:00:00', '12 rue des Chartrons, 33000 Bordeaux', 384.00,  0.00, 'terminee'),
  (3, 3,  6, '2025-01-10', '12:30:00', '12 rue des Chartrons, 33000 Bordeaux', 228.00,  0.00, 'terminee');

-- Avis
INSERT INTO avis (id_utilisateur, id_commande, note, commentaire, valide) VALUES
  (3, 1, 5, 'Excellent repas de Noël, tout était parfait ! La dinde était fondante.', 1),
  (3, 2, 4, 'Très bon menu de Pâques, l''agneau était délicieux.', 1);

-- ============================================================
--  VUES UTILES
-- ============================================================

-- Vue : commandes avec détails client et menu
CREATE VIEW vue_commandes AS
SELECT
  c.id_commande,
  CONCAT(u.prenom, ' ', u.nom) AS client,
  u.email,
  u.gsm,
  m.nom                         AS menu,
  m.theme,
  c.nb_personnes,
  c.date_prestation,
  c.heure_livraison,
  c.adresse_livraison,
  c.montant_total,
  c.reduction,
  c.statut,
  c.created_at
FROM commande c
JOIN utilisateur u ON u.id_utilisateur = c.id_utilisateur
JOIN menu m        ON m.id_menu        = c.id_menu
ORDER BY c.date_prestation DESC;

-- Vue : CA par menu
CREATE VIEW vue_ca_par_menu AS
SELECT
  m.nom              AS menu,
  m.theme,
  COUNT(c.id_commande)      AS nb_commandes,
  SUM(c.montant_total)      AS ca_total,
  AVG(c.nb_personnes)       AS moy_personnes
FROM commande c
JOIN menu m ON m.id_menu = c.id_menu
WHERE c.statut != 'annulee'
GROUP BY m.id_menu, m.nom, m.theme
ORDER BY ca_total DESC;

-- Vue : avis validés avec auteur
CREATE VIEW vue_avis_publics AS
SELECT
  a.id_avis,
  CONCAT(u.prenom, ' ', LEFT(u.nom,1), '.') AS auteur,
  m.nom           AS menu,
  a.note,
  a.commentaire,
  a.created_at
FROM avis a
JOIN utilisateur u ON u.id_utilisateur = a.id_utilisateur
JOIN commande c    ON c.id_commande    = a.id_commande
JOIN menu m        ON m.id_menu        = c.id_menu
WHERE a.valide = 1
ORDER BY a.created_at DESC;

-- ============================================================
--  INDEX POUR PERFORMANCES
-- ============================================================
CREATE INDEX idx_commande_statut    ON commande(statut);
CREATE INDEX idx_commande_date      ON commande(date_prestation);
CREATE INDEX idx_commande_user      ON commande(id_utilisateur);
CREATE INDEX idx_menu_theme         ON menu(theme);
CREATE INDEX idx_menu_regime        ON menu(regime);
CREATE INDEX idx_avis_valide        ON avis(valide);
CREATE INDEX idx_utilisateur_email  ON utilisateur(email);
CREATE INDEX idx_utilisateur_role   ON utilisateur(role);
