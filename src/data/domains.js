// Définition des données du diagramme basé sur les screenshots partagés
const domains = {
  // Domaines principaux
  "squad": {
    id: "squad",
    name: "SQUAD / COMMUNAUTÉS DE PRATIQUES",
    description: "Espaces de collaboration, d'échange et de partage de connaissances entre les équipes.",
    type: "Domaine Principal",
    position: [15, 10, 0],
    color: "#f0d045",
    size: 1.2,
    links: [
      { id: "nteams", name: "N TEAMS", verb: "applies to" },
      { id: "gem", name: "GEM", verb: "settings to" },
      { id: "role", name: "ROLE", verb: "defines roles for" }
    ],
    subDomains: ["collaboration", "continuous-improvement", "innovation-ideas", "guidelines"],
    textures: {
      surface: "rocky",
      atmosphere: "thin",
      color: "#f0d045"
    }
  },
  "artefact": {
    id: "artefact",
    name: "ARTEFACT",
    description: "Documents et outils utilisés dans le cadre de la méthodologie agile.",
    type: "Domaine Principal",
    position: [0, -10, 15],
    color: "#f0c03a",
    size: 1.3,
    links: [
      { id: "ritual", name: "RITUAL", verb: "contributes to" },
      { id: "nteams", name: "N TEAMS", verb: "produced by" },
      { id: "program", name: "PROGRAM", verb: "supports" }
    ],
    subDomains: ["pi-objectives", "backlogs", "kanban-board", "documentation", "user-stories"],
    textures: {
      surface: "desert",
      atmosphere: "thick",
      color: "#f0c03a"
    }
  },
  "ritual": {
    id: "ritual",
    name: "RITUAL",
    description: "Cérémonies et événements récurrents qui structurent la méthodologie agile.",
    type: "Domaine Principal",
    position: [-15, -5, 10],
    color: "#3a7af0",
    size: 1.4,
    links: [
      { id: "program", name: "PROGRAM", verb: "supports" },
      { id: "role", name: "ROLE", verb: "involves" },
      { id: "nteams", name: "N TEAMS", verb: "conducted by" }
    ],
    subDomains: ["daily-standup", "sprint-planning", "review", "pi-planning", "retrospective"],
    textures: {
      surface: "oceanic",
      atmosphere: "cloudy",
      color: "#3a7af0"
    }
  },
  "gem": {
    id: "gem",
    name: "GEM",
    description: "Valeurs et principes fondamentaux qui guident les pratiques agiles.",
    type: "Domaine Principal",
    position: [-15, -15, -5],
    color: "#e64a19",
    size: 1.3,
    links: [
      { id: "portfolio", name: "PORTFOLIO", verb: "applies to" },
      { id: "nteams", name: "N TEAMS", verb: "guides" },
      { id: "squad", name: "SQUAD / COMMUNAUTÉS DE PRATIQUES", verb: "fosters" }
    ],
    subDomains: ["continuous-improvement-gem", "transparency", "empowerment"],
    textures: {
      surface: "volcanic",
      atmosphere: "dense",
      color: "#e64a19" 
    }
  },
  "portfolio": {
    id: "portfolio",
    name: "PORTFOLIO",
    description: "Niveau stratégique qui définit la vision et gouvernance de l'organisation.",
    type: "Domaine Principal",
    position: [12, 5, -15],
    color: "#fdd835",
    size: 1.4,
    links: [
      { id: "program", name: "PROGRAM", verb: "consists of" },
      { id: "gem", name: "GEM", verb: "embodies" }
    ],
    subDomains: ["vision-strategique", "gestion-investissements", "alignement-gouvernance"],
    textures: {
      surface: "desert",
      atmosphere: "thin",
      color: "#fdd835"
    }
  },
  "nteams": {
    id: "nteams",
    name: "N TEAMS",
    description: "Équipes opérationnelles qui exécutent le travail en utilisant des méthodes agiles.",
    type: "Domaine Principal",
    position: [8, -12, -10],
    color: "#ffeb3b",
    size: 1.35,
    links: [
      { id: "program", name: "PROGRAM", verb: "part of" },
      { id: "ritual", name: "RITUAL", verb: "conducts" },
      { id: "artefact", name: "ARTEFACT", verb: "produces" },
      { id: "squad", name: "SQUAD / COMMUNAUTÉS DE PRATIQUES", verb: "forms" },
      { id: "gem", name: "GEM", verb: "implements" }
    ],
    subDomains: ["feature-team", "component-team", "hybrid-team"],
    textures: {
      surface: "forested",
      atmosphere: "thick",
      color: "#ffeb3b"
    }
  },
  "program": {
    id: "program",
    name: "PROGRAM",
    description: "Niveau qui coordonne plusieurs équipes dans un Agile Release Train.",
    type: "Domaine Principal",
    position: [-5, 10, -12],
    color: "#ffc107",
    size: 1.4,
    links: [
      { id: "portfolio", name: "PORTFOLIO", verb: "contributes to" },
      { id: "nteams", name: "N TEAMS", verb: "coordinates" },
      { id: "ritual", name: "RITUAL", verb: "organizes" },
      { id: "artefact", name: "ARTEFACT", verb: "utilizes" }
    ],
    subDomains: ["art", "value-streams", "release-management"],
    textures: {
      surface: "crystalline",
      atmosphere: "organized",
      color: "#ffc107"
    }
  },
  "role": {
    id: "role",
    name: "ROLE",
    description: "Rôles spécifiques associés aux méthodologies agiles.",
    type: "Domaine Principal",
    position: [-10, 15, 5],
    color: "#ff9800",
    size: 1.3,
    links: [
      { id: "ritual", name: "RITUAL", verb: "participates in" },
      { id: "squad", name: "SQUAD / COMMUNAUTÉS DE PRATIQUES", verb: "belongs to" }
    ],
    subDomains: ["product-owner", "scrum-master", "developer", "architect"],
    textures: {
      surface: "structured",
      atmosphere: "clear",
      color: "#ff9800"
    }
  },
  
  // Sous-domaines de SQUAD
  "collaboration": {
    id: "collaboration",
    name: "Collaboration & Knowledge Sharing",
    description: "Facilitation du partage de connaissances et d'expertise entre les équipes.",
    type: "Sous-domaine de SQUAD",
    position: [17, 12, 3],
    color: "#4caf50",
    size: 0.7,
    parentId: "squad",
    links: [
      { id: "squad", name: "SQUAD / COMMUNAUTÉS DE PRATIQUES", verb: "is part of" }
    ],
    detailedInfo: [
      {
        title: "1. Communautés de pratique",
        description: "Créer des espaces d'échange pour mutualiser l'expertise et diffuser les innovations à travers l'organisation."
      },
      {
        title: "2. Mentorat et pair programming",
        description: "Favoriser l'accompagnement mutuel et le transfert de savoir-faire au sein des équipes."
      },
      {
        title: "3. Transversalité des projets",
        description: "Encourager la coopération entre différents Squads, métiers et fonctions pour enrichir les perspectives."
      },
      {
        title: "4. Sessions de partage",
        description: "Organiser régulièrement des présentations, brown bag lunches ou démos pour valoriser le travail accompli et partager les apprentissages."
      },
      {
        title: "5. Plateformes collaboratives",
        description: "Mettre à disposition des outils (wikis, bases de connaissances, forums) pour centraliser la documentation et encourager l'entraide."
      }
    ],
    textures: {
      surface: "forested",
      atmosphere: "misty",
      color: "#4caf50"
    }
  },
  "continuous-improvement": {
    id: "continuous-improvement",
    name: "CONTINUOUS IMPROVEMENT",
    description: "Amélioration progressive des processus, méthodes et pratiques.",
    type: "Sous-domaine de SQUAD",
    position: [15, 11, 5],
    color: "#42a5f5",
    size: 0.7,
    parentId: "squad",
    links: [
      { id: "squad", name: "SQUAD / COMMUNAUTÉS DE PRATIQUES", verb: "is part of" }
    ],
    detailedInfo: [
      {
        title: "1. Boucles de feedback régulières",
        description: "Permettre aux équipes de partager et d'intégrer les retours en continu pour affiner les processus."
      },
      {
        title: "2. Culture de la rétroaction",
        description: "Encourager les Rétrospectives, les bilans post-projets et l'analyse des erreurs pour progresser."
      },
      {
        title: "3. Évaluation constante des pratiques",
        description: "Suivre des indicateurs de performance et ajuster les méthodes de travail en temps réel."
      },
      {
        title: "4. Amélioration progressive des process",
        description: "Mettre à jour les standards et routines dès qu'une piste d'optimisation est identifiée."
      },
      {
        title: "5. Adaptation rapide au changement",
        description: "Instaurer un climat de souplesse où les nouvelles idées sont testées et ajustées sans lourdeur."
      }
    ],
    textures: {
      surface: "crystalline",
      atmosphere: "electric",
      color: "#42a5f5"
    }
  },
  "innovation-ideas": {
    id: "innovation-ideas",
    name: "INNOVATION IDEAS",
    description: "Exploration et expérimentation de nouvelles approches et technologies.",
    type: "Sous-domaine de SQUAD",
    position: [18, 8, 2],
    color: "#66bb6a",
    size: 0.7,
    parentId: "squad",
    links: [
      { id: "squad", name: "SQUAD / COMMUNAUTÉS DE PRATIQUES", verb: "is part of" }
    ],
    detailedInfo: [
      {
        title: "1. Veille technologique active",
        description: "Rester à l'affût des nouvelles tendances et outils pour anticiper les évolutions du marché."
      },
      {
        title: "2. Expérimentations et POC",
        description: "Lancer des prototypes ou pilotes pour valider rapidement la faisabilité et la valeur d'une idée."
      },
      {
        title: "3. Sessions créatives",
        description: "Organiser des hackathons, design sprints ou ateliers d'idéation pour stimuler la créativité collective."
      },
      {
        title: "4. Capitalisation des découvertes",
        description: "Documenter et partager les enseignements tirés de chaque expérimentation afin de nourrir la culture d'innovation."
      },
      {
        title: "5. Promotion de l'intrapreneuriat",
        description: "Encourager les collaborateurs à proposer et à porter leurs projets, soutenus par les communautés expertes."
      }
    ],
    textures: {
      surface: "grid-like",
      atmosphere: "organized",
      color: "#66bb6a"
    }
  },
  "guidelines": {
    id: "guidelines",
    name: "GUIDELINES",
    description: "Normes et standards qui encadrent les pratiques des équipes.",
    type: "Sous-domaine de SQUAD",
    position: [14, 14, 2],
    color: "#7986cb",
    size: 0.7,
    parentId: "squad",
    links: [
      { id: "squad", name: "SQUAD / COMMUNAUTÉS DE PRATIQUES", verb: "is part of" }
    ],
    detailedInfo: [
      {
        title: "1. Standardisation des pratiques",
        description: "Définir des référentiels communs (ex. : conventions de code, checklist de tests) pour garantir la cohérence."
      },
      {
        title: "2. Documentation évolutive",
        description: "Mettre à disposition des guides clairs et régulièrement mis à jour pour faciliter l'onboarding et la montée en compétences."
      },
      {
        title: "3. Référentiels de qualité",
        description: "Établir des critères partagés pour valider la robustesse et la maintenabilité des livrables."
      },
      {
        title: "4. Transmission de bonnes pratiques",
        description: "Formaliser les patterns, méthodologies et principes clés qui font la force de l'organisation."
      },
      {
        title: "5. Simplicité et clarté",
        description: "Veiller à ce que les directives soient faciles à comprendre et à appliquer, pour éviter la lourdeur administrative."
      }
    ],
    textures: {
      surface: "solid",
      atmosphere: "stable",
      color: "#7986cb"
    }
  },
  
  // Sous-domaines de GEM
  "continuous-improvement-gem": {
    id: "continuous-improvement-gem",
    name: "CONTINUOUS IMPROVEMENT",
    description: "Principe d'amélioration continue dans la démarche agile.",
    type: "Sous-domaine de GEM",
    position: [-13, -19, -4],
    color: "#ba68c8",
    size: 0.6,
    parentId: "gem",
    links: [
      { id: "gem", name: "GEM", verb: "is_a" }
    ],
    textures: {
      surface: "glassy",
      atmosphere: "clear",
      color: "#ba68c8"
    }
  },
  "transparency": {
    id: "transparency",
    name: "TRANSPARENCY",
    description: "Principe de transparence dans les informations et les processus.",
    type: "Sous-domaine de GEM",
    position: [-17, -18, -6],
    color: "#9c27b0",
    size: 0.6,
    parentId: "gem",
    links: [
      { id: "gem", name: "GEM", verb: "is_a" }
    ],
    textures: {
      surface: "solid",
      atmosphere: "stable",
      color: "#9c27b0"
    }
  },
  "empowerment": {
    id: "empowerment",
    name: "EMPOWERMENT",
    description: "Principe d'autonomisation et de responsabilisation des équipes.",
    type: "Sous-domaine de GEM",
    position: [-15, -22, -7],
    color: "#7e57c2",
    size: 0.6,
    parentId: "gem",
    links: [
      { id: "gem", name: "GEM", verb: "is_a" }
    ],
    textures: {
      surface: "void-like",
      atmosphere: "nebulous",
      color: "#7e57c2"
    }
  },
  
  // Sous-domaines de ROLE
  "product-owner": {
    id: "product-owner",
    name: "PRODUCT OWNER",
    description: "Responsable de la définition et de la priorisation du backlog produit.",
    type: "Sous-domaine de ROLE",
    position: [-12, 16, 8],
    color: "#ffb74d",
    size: 0.6,
    parentId: "role",
    links: [
      { id: "role", name: "ROLE", verb: "is_a" }
    ],
    textures: {
      surface: "desert",
      atmosphere: "thin",
      color: "#ffb74d"
    }
  },
  "scrum-master": {
    id: "scrum-master",
    name: "SCRUM MASTER",
    description: "Facilitateur qui aide l'équipe à appliquer les principes Scrum.",
    type: "Sous-domaine de ROLE",
    position: [-8, 17, 7],
    color: "#ff8a65",
    size: 0.6,
    parentId: "role",
    links: [
      { id: "role", name: "ROLE", verb: "is_a" }
    ],
    textures: {
      surface: "structured",
      atmosphere: "ordered",
      color: "#ff8a65"
    }
  },
  "developer": {
    id: "developer",
    name: "DEVELOPER",
    description: "Membre de l'équipe qui développe, teste et déploie les fonctionnalités.",
    type: "Sous-domaine de ROLE",
    position: [-11, 18, 4],
    color: "#ffab91",
    size: 0.6,
    parentId: "role",
    links: [
      { id: "role", name: "ROLE", verb: "is_a" }
    ],
    textures: {
      surface: "grid-like",
      atmosphere: "electric",
      color: "#ffab91"
    }
  },
  "architect": {
    id: "architect",
    name: "ARCHITECT",
    description: "Responsable de la structure technique et des choix architecturaux.",
    type: "Sous-domaine de ROLE",
    position: [-9, 16, 9],
    color: "#ffa726",
    size: 0.6,
    parentId: "role",
    links: [
      { id: "role", name: "ROLE", verb: "is_a" }
    ],
    textures: {
      surface: "rocky",
      atmosphere: "clear",
      color: "#ffa726"
    }
  },
  
  // Sous-domaines de RITUAL
  "daily-standup": {
    id: "daily-standup",
    name: "DAILY STANDUP",
    description: "Réunion quotidienne de synchronisation de l'équipe.",
    type: "Sous-domaine de RITUAL",
    position: [-19, -3, 12],
    color: "#64b5f6",
    size: 0.6,
    parentId: "ritual",
    links: [],
    textures: {
      surface: "crystalline",
      atmosphere: "thin",
      color: "#64b5f6"
    }
  },
  "sprint-planning": {
    id: "sprint-planning",
    name: "SPRINT PLANNING",
    description: "Planification du travail à réaliser pendant le sprint.",
    type: "Sous-domaine de RITUAL",
    position: [-17, -7, 13],
    color: "#29b6f6",
    size: 0.6,
    parentId: "ritual",
    links: [],
    textures: {
      surface: "grid-like",
      atmosphere: "organized",
      color: "#29b6f6"
    }
  },
  "review": {
    id: "review",
    name: "REVIEW",
    description: "Présentation des fonctionnalités développées pendant le sprint.",
    type: "Sous-domaine de RITUAL",
    position: [-16, -6, 14],
    color: "#03a9f4",
    size: 0.6,
    parentId: "ritual",
    links: [],
    textures: {
      surface: "oceanic",
      atmosphere: "cloudy",
      color: "#03a9f4"
    }
  },
  "pi-planning": {
    id: "pi-planning",
    name: "PI PLANNING",
    description: "Planification des incréments de programme (Program Increment).",
    type: "Sous-domaine de RITUAL",
    position: [-14, -4, 14],
    color: "#0288d1",
    size: 0.6,
    parentId: "ritual",
    links: [],
    textures: {
      surface: "structured",
      atmosphere: "organized",
      color: "#0288d1"
    }
  },
  "retrospective": {
    id: "retrospective",
    name: "RETROSPECTIVE",
    description: "Analyse du processus de travail pour identifier des améliorations.",
    type: "Sous-domaine de RITUAL",
    position: [-12, -3, 12],
    color: "#0277bd",
    size: 0.6,
    parentId: "ritual",
    links: [],
    textures: {
      surface: "rocky",
      atmosphere: "reflective",
      color: "#0277bd"
    }
  },
  
  // Sous-domaines d'ARTEFACT
  "pi-objectives": {
    id: "pi-objectives",
    name: "PI Objectives",
    description: "Objectifs définis pour un incrément de programme.",
    type: "Sous-domaine d'ARTEFACT",
    position: [4, -12, 16],
    color: "#ffd54f",
    size: 0.6,
    parentId: "artefact",
    links: [],
    textures: {
      surface: "desert",
      atmosphere: "thin",
      color: "#ffd54f"
    }
  },
  "backlogs": {
    id: "backlogs",
    name: "Backlogs",
    description: "Listes d'éléments de travail (produit, sprint, programme).",
    type: "Sous-domaine d'ARTEFACT",
    position: [2, -11, 18],
    color: "#ffca28",
    size: 0.6,
    parentId: "artefact",
    links: [],
    textures: {
      surface: "structured",
      atmosphere: "ordered",
      color: "#ffca28"
    }
  },
  "kanban-board": {
    id: "kanban-board",
    name: "Kanban Board",
    description: "Représentation visuelle du flux de travail.",
    type: "Sous-domaine d'ARTEFACT",
    position: [0, -13, 17],
    color: "#ffb300",
    size: 0.6,
    parentId: "artefact",
    links: [],
    textures: {
      surface: "grid-like",
      atmosphere: "organized",
      color: "#ffb300"
    }
  },
  "documentation": {
    id: "documentation",
    name: "Documentation technique",
    description: "Documents techniques et guides de conception.",
    type: "Sous-domaine d'ARTEFACT",
    position: [-2, -12, 16],
    color: "#ffa000",
    size: 0.6,
    parentId: "artefact",
    links: [],
    textures: {
      surface: "patterned",
      atmosphere: "stable",
      color: "#ffa000"
    }
  },
  "user-stories": {
    id: "user-stories",
    name: "User Stories",
    description: "Descriptions des fonctionnalités du point de vue utilisateur.",
    type: "Sous-domaine d'ARTEFACT",
    position: [-4, -11, 15],
    color: "#ff8f00",
    size: 0.6,
    parentId: "artefact",
    links: [],
    textures: {
      surface: "rocky",
      atmosphere: "clear",
      color: "#ff8f00"
    }
  },
  
  // Sous-domaines de N TEAMS
  "feature-team": {
    id: "feature-team",
    name: "Feature Team",
    description: "Équipe pluridisciplinaire qui travaille sur des fonctionnalités de bout en bout.",
    type: "Sous-domaine de N TEAMS",
    position: [9, -14, -8],
    color: "#cddc39",
    size: 0.6,
    parentId: "nteams",
    links: [],
    textures: {
      surface: "forested",
      atmosphere: "dynamic",
      color: "#cddc39"
    }
  },
  "component-team": {
    id: "component-team",
    name: "Component Team",
    description: "Équipe spécialisée dans un composant ou une technologie spécifique.",
    type: "Sous-domaine de N TEAMS",
    position: [7, -15, -9],
    color: "#afb42b",
    size: 0.6,
    parentId: "nteams",
    links: [],
    textures: {
      surface: "structured",
      atmosphere: "specialized",
      color: "#afb42b"
    }
  },
  "hybrid-team": {
    id: "hybrid-team",
    name: "Hybrid Team",
    description: "Équipe combinant des aspects de feature et component teams selon les besoins.",
    type: "Sous-domaine de N TEAMS",
    position: [10, -13, -11],
    color: "#9e9d24",
    size: 0.6,
    parentId: "nteams",
    links: [],
    textures: {
      surface: "patterned",
      atmosphere: "adaptive",
      color: "#9e9d24"
    }
  },
  
  // Sous-domaines de PROGRAM
  "art": {
    id: "art",
    name: "Agile Release Train",
    description: "Ensemble d'équipes agiles qui développent et délivrent des solutions ensemble.",
    type: "Sous-domaine de PROGRAM",
    position: [-3, 12, -13],
    color: "#ffa726",
    size: 0.6,
    parentId: "program",
    links: [],
    textures: {
      surface: "crystalline",
      atmosphere: "organized",
      color: "#ffa726"
    }
  },
  "value-streams": {
    id: "value-streams",
    name: "Value Streams",
    description: "Séquence d'activités nécessaires pour fournir de la valeur aux clients.",
    type: "Sous-domaine de PROGRAM",
    position: [-6, 13, -11],
    color: "#ff9800",
    size: 0.6,
    parentId: "program",
    links: [],
    textures: {
      surface: "flowing",
      atmosphere: "dynamic",
      color: "#ff9800"
    }
  },
  "release-management": {
    id: "release-management",
    name: "Release Management",
    description: "Processus de planification, programmation et contrôle des releases logicielles.",
    type: "Sous-domaine de PROGRAM",
    position: [-7, 11, -13],
    color: "#fb8c00",
    size: 0.6,
    parentId: "program",
    links: [],
    textures: {
      surface: "structured",
      atmosphere: "controlled",
      color: "#fb8c00"
    }
  },
  
  // Sous-domaines de PORTFOLIO
  "vision-strategique": {
    id: "vision-strategique",
    name: "Vision stratégique et gouvernance",
    description: "Définition de la stratégie globale et des initiatives majeures de l'organisation.",
    type: "Sous-domaine de PORTFOLIO",
    position: [14, 7, -16],
    color: "#ffee58",
    size: 0.6,
    parentId: "portfolio",
    links: [],
    textures: {
      surface: "glassy",
      atmosphere: "clear",
      color: "#ffee58"
    }
  },
  "gestion-investissements": {
    id: "gestion-investissements",
    name: "Gestion des investissements",
    description: "Priorisation des projets en fonction de leur valeur et gestion des budgets.",
    type: "Sous-domaine de PORTFOLIO",
    position: [12, 4, -17],
    color: "#ffeb3b",
    size: 0.6,
    parentId: "portfolio",
    links: [],
    textures: {
      surface: "structured",
      atmosphere: "controlled",
      color: "#ffeb3b"
    }
  },
  "alignement-gouvernance": {
    id: "alignement-gouvernance",
    name: "Alignement et gouvernance Lean",
    description: "Structure de gouvernance qui favorise l'autonomie tout en assurant l'alignement stratégique.",
    type: "Sous-domaine de PORTFOLIO",
    position: [10, 6, -15],
    color: "#fdd835",
    size: 0.6,
    parentId: "portfolio",
    links: [],
    textures: {
      surface: "patterned",
      atmosphere: "balanced",
      color: "#fdd835"
    }
  }
}

// Liste plate de tous les domaines (pour faciliter l'itération)
export const allDomains = Object.values(domains)

// Fonction pour obtenir un domaine par son ID
export const getDomainById = (id) => domains[id] || null

// Obtenir les domaines liés à un domaine spécifique (connexions directes)
export const getLinkedDomains = (domainId) => {
  const domain = getDomainById(domainId);
  if (!domain || !domain.links) return [];
  
  return domain.links.map(link => {
    return getDomainById(link.id);
  }).filter(d => d !== null);
};

// Obtenir les sous-domaines d'un domaine spécifique
export const getChildDomains = (domainId) => {
  return allDomains.filter(domain => domain.parentId === domainId);
};

// Obtenir tous les domaines liés à un domaine spécifique (sous-domaines + connexions directes + domaines qui pointent vers lui)
export const getAllRelatedDomains = (domainId) => {
  const visited = new Set();
  const result = [];
  
  // Fonction récursive pour explorer les liens
  const explore = (id) => {
    if (visited.has(id)) return;
    visited.add(id);
    
    const domain = getDomainById(id);
    if (!domain) return;
    
    result.push(domain);
    
    // Explorer les sous-domaines
    const children = getChildDomains(id);
    children.forEach(child => explore(child.id));
    
    // Explorer les domaines liés
    if (domain.links) {
      domain.links.forEach(link => explore(link.id));
    }
    
    // Explorer les domaines qui pointent vers celui-ci (liens inverses)
    allDomains.forEach(d => {
      if (d.links && d.links.some(link => link.id === id)) {
        explore(d.id);
      }
    });
  };
  
  explore(domainId);
  
  return result;
};

// Les domaines principaux pour la navigation
export const mainDomains = [
  domains["squad"],
  domains["artefact"],
  domains["ritual"],
  domains["gem"],
  domains["portfolio"],
  domains["nteams"],
  domains["program"],
  domains["role"]
]

export default domains 