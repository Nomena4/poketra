
CREATE TABLE utilisateur (
                             id_utilisateur SERIAL PRIMARY KEY,
                             nom VARCHAR(100),
                             numero_matricule VARCHAR(50) UNIQUE,
                             email VARCHAR(150) UNIQUE,
                             numero_telephone VARCHAR(20),
                             prenom VARCHAR(100),
                             mot_pass VARCHAR(255),
                             adresse TEXT
);

-- Table admin
CREATE TABLE admin (
                       id_admin SERIAL PRIMARY KEY,
                       nom VARCHAR(100),
                       numero_matricule VARCHAR(50) UNIQUE,
                       email VARCHAR(150) UNIQUE,
                       numero_telephone VARCHAR(20),
                       prenom VARCHAR(100),
                       mot_pass VARCHAR(255),
                       adresse TEXT
);

-- Table utilisateur_admin (table de liaison)
CREATE TABLE utilisateur_admin (
                                   id_utilisateur INT NOT NULL,
                                   id_admin INT NOT NULL,
                                   PRIMARY KEY (id_utilisateur, id_admin),
                                   FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE,
                                   FOREIGN KEY (id_admin) REFERENCES admin(id_admin) ON DELETE CASCADE
);

-- Table ETUDIANT
CREATE TABLE etudiant (
                          id_etudiant SERIAL PRIMARY KEY,
                          nom VARCHAR(100),
                          numero_matricule VARCHAR(50) UNIQUE,
                          email VARCHAR(150) UNIQUE,
                          numero_telephone VARCHAR(20),
                          prenom VARCHAR(100)
);

-- Table utilisateur_etudiant (table de liaison)
CREATE TABLE utilisateur_etudiant (
                                      id_etudiant INT NOT NULL,
                                      id_utilisateur INT NOT NULL,
                                      PRIMARY KEY (id_etudiant, id_utilisateur),
                                      FOREIGN KEY (id_etudiant) REFERENCES etudiant(id_etudiant) ON DELETE CASCADE,
                                      FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE
);

-- Table prof
CREATE TABLE prof (
                      id_prof SERIAL PRIMARY KEY,
                      nom VARCHAR(100),
                      numero_matricule VARCHAR(50) UNIQUE,
                      email VARCHAR(150) UNIQUE,
                      specialite VARCHAR(150),
                      experience TEXT,
                      disponibilite VARCHAR(100),
                      numero_telephone VARCHAR(20),
                      prenom VARCHAR(100)
);

-- Table utilisateur_prof (table de liaison)
CREATE TABLE utilisateur_prof (
                                  id_prof INT NOT NULL,
                                  id_utilisateur INT NOT NULL,
                                  PRIMARY KEY (id_prof, id_utilisateur),
                                  FOREIGN KEY (id_prof) REFERENCES prof(id_prof) ON DELETE CASCADE,
                                  FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE
);

-- Table cours
CREATE TABLE cours (
                       id_cours SERIAL PRIMARY KEY,
                       categorie_cours VARCHAR(100),
                       categorie_niveau VARCHAR(100),
                       date_debut DATE,
                       date_fin DATE
);

-- Table categorie
CREATE TABLE categorie (
                           id_categorie SERIAL PRIMARY KEY,
                           categorie_nom VARCHAR(100),
                           description TEXT,
                           id_cours INT,
                           FOREIGN KEY (id_cours) REFERENCES cours(id_cours) ON DELETE SET NULL
);

-- Table niveau
CREATE TABLE niveau (
                        id_niveau SERIAL PRIMARY KEY,
                        nom_niveau VARCHAR(100),
                        description TEXT,
                        id_cours INT,
                        FOREIGN KEY (id_cours) REFERENCES cours(id_cours) ON DELETE SET NULL
);

-- Table prof_cours (table de liaison)
CREATE TABLE prof_cours (
                            id_cours INT NOT NULL,
                            id_prof INT NOT NULL,
                            PRIMARY KEY (id_cours, id_prof),
                            FOREIGN KEY (id_cours) REFERENCES cours(id_cours) ON DELETE CASCADE,
                            FOREIGN KEY (id_prof) REFERENCES prof(id_prof) ON DELETE CASCADE
);

-- Table inscription
CREATE TABLE inscription (
                             id_inscription SERIAL PRIMARY KEY,
                             date_inscription DATE,
                             categorie_niveau VARCHAR(100),
                             statut VARCHAR(50),
                             nombre_place_max INT,
                             nombre_place_libre INT
);

-- Table inscription_etudiant (table de liaison)
CREATE TABLE inscription_etudiant (
                                      id_etudiant INT NOT NULL,
                                      id_inscription INT NOT NULL,
                                      PRIMARY KEY (id_etudiant, id_inscription),
                                      FOREIGN KEY (id_etudiant) REFERENCES etudiant(id_etudiant) ON DELETE CASCADE,
                                      FOREIGN KEY (id_inscription) REFERENCES inscription(id_inscription) ON DELETE CASCADE
);

-- Table inscription_niveau (table de liaison)
CREATE TABLE inscription_niveau (
                                    id_inscription INT NOT NULL,
                                    id_niveau INT NOT NULL,
                                    PRIMARY KEY (id_inscription, id_niveau),
                                    FOREIGN KEY (id_inscription) REFERENCES inscription(id_inscription) ON DELETE CASCADE,
                                    FOREIGN KEY (id_niveau) REFERENCES niveau(id_niveau) ON DELETE CASCADE
);

-- Table payement
CREATE TABLE payement (
                          id SERIAL PRIMARY KEY,
                          type_payement VARCHAR(100),
                          validation_payement BOOLEAN DEFAULT FALSE,
                          recu VARCHAR(255),
                          etat_payement VARCHAR(50),
                          montant NUMERIC(10, 2),
                          mode_payement VARCHAR(100),
                          date_payement DATE,
                          reference VARCHAR(100) UNIQUE
);

-- Table evaluation
CREATE TABLE evaluation (
                            id_evaluation SERIAL PRIMARY KEY,
                            titre VARCHAR(150),
                            coefficient NUMERIC(5, 2),
                            note_max NUMERIC(5, 2)
);

-- Table etudiant_evaluation (table de liaison)
CREATE TABLE etudiant_evaluation (
                                     id_etudiant INT NOT NULL,
                                     id_evaluation INT NOT NULL,
                                     PRIMARY KEY (id_etudiant, id_evaluation),
                                     FOREIGN KEY (id_etudiant) REFERENCES etudiant(id_etudiant) ON DELETE CASCADE,
                                     FOREIGN KEY (id_evaluation) REFERENCES evaluation(id_evaluation) ON DELETE CASCADE
);
