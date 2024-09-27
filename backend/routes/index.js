const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const Acquereur = require("../models/Acquereur");
const Cedeur = require("../models/Cedeur");
const { Op } = require("sequelize");

const router = express.Router();
router.use(bodyParser.json());

const openaiApiKey = process.env.OPENAI_API_KEY || "your-api-key";

// Fonction pour interroger l'API de ChatGPT
const getChatGPTResponse = async (text) => {
  const data = JSON.stringify({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Veuillez extraire les informations suivantes d'un texte donné : nom, prénom, société (ou entreprise), email et secteur d'activité. Notez que 'entreprise' est équivalent à 'société'. Si le texte mentionne un secteur d'activité, veuillez l'inclure sous l'attribut 'secteur'. Retournez les résultats dans un format JSON avec les attributs suivants : 'nom', 'prenom', 'societe', 'email', 'secteur'. Ne répondez que en json.",
      },
      {
        role: "user",
        content: text,
      },
    ],
    temperature: 0.7,
    max_tokens: 250,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const config = {
    method: "post",
    url: "https://api.openai.com/v1/chat/completions",
    headers: {
      Authorization: `Bearer ${openaiApiKey}`,
      "Content-Type": "application/json",
    },
    data: data,
  };

  try {
    const response = await axios(config);
    let messageContent = response.data.choices[0].message.content;
    // Remove ```json from the response content and the last ```
    messageContent = messageContent.replace("```json", "").replace("```", "");

    // Essayer de parser la réponse comme un JSON
    try {
      const parsedContent = JSON.parse(messageContent);
      return parsedContent;
    } catch (error) {
      throw new Error("La réponse n'est pas un JSON valide.");
    }
  } catch (error) {
    console.error(
      "Erreur avec l'API OpenAI :",
      error.response ? error.response.data : error.message
    );
    throw new Error(
      error.response ? error.response.data.error.message : error.message
    );
  }
};

// Fonction pour normaliser les clés de l'objet (mettre les clés en minuscules, etc.)
const normalizeKeys = (data) => {
  const normalizedData = {};
  Object.keys(data).forEach((key) => {
    let normalizedKey = key.trim().toLowerCase();

    // Si 'entreprise' est utilisé, le remplacer par 'societe'
    if (normalizedKey === "entreprise") {
      normalizedKey = "societe";
    }

    normalizedData[normalizedKey] = data[key];
  });
  return normalizedData;
};

// Fonction pour vérifier les champs dans le JSON renvoyé par l'IA
const checkFields = (extractedData) => {
  const requiredFields = ["nom", "prenom", "societe", "email", "secteur"];
  let missingFields = [];

  // Normaliser les données extraites
  const normalizedData = normalizeKeys(extractedData);

  // Vérifier directement les champs extraits par l'IA
  requiredFields.forEach((field) => {
    if (!normalizedData[field] || normalizedData[field].trim() === "") {
      missingFields.push(field);
    }
  });

  return {
    status: missingFields.length > 0 ? "missing" : "Ok",
    reason:
      missingFields.length > 0
        ? `Champs manquants: ${missingFields.join(", ")}`
        : "Tous les champs requis sont présents.",
    missingFields, // Renvoie la liste des champs manquants
    data: normalizedData,
  };
};

// Route POST /new-acquereur
router.post("/new-acquereur", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({
      status: "missing",
      reason: "Le champ texte est requis.",
    });
  }

  try {
    const chatResponse = await getChatGPTResponse(text); // Appel à l'API OpenAI pour extraire les informations
    const result = checkFields(chatResponse); // Vérification des champs extraits

    // Si des champs sont manquants, renvoyer les détails des champs manquants
    if (result.status === "missing") {
      return res.status(200).json({
        status: "missing",
        reason: result.reason,
        missingFields: result.missingFields || [], // Ajout d'une sécurité pour s'assurer que missingFields est toujours présent
      });
    }

    // Si tous les champs sont remplis, ajouter l'acquéreur à la base de données
    const acquereur = await Acquereur.create(result.data); // Le champ secteur sera inclus dans les données créées
    return res.json({
      status: "success",
      message:
        "Tous les champs sont corrects et l'acquéreur a été enregistré avec succès.",
      data: acquereur,
    });
  } catch (error) {
    console.error("Erreur serveur:", error);
    return res.status(500).json({ status: "error", reason: error.message });
  }
});

// Route GET /acquereurs
router.get("/acquereurs", async (req, res) => {
  try {
    const acquereurs = await Acquereur.findAll();
    return res.json({ status: "success", data: acquereurs });
  } catch (error) {
    return res.status(500).json({ status: "error", reason: error.message });
  }
});

// Fonction pour interroger l'API pour les cédants
const getChatGPTResponseForCedeur = async (text) => {
  const data = JSON.stringify({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `Extrait les informations suivantes d'un texte : nom, prénom, société, email, code NAF, taille de l'effectif, localisation et chiffre d'affaires.`,
      },
      {
        role: "user",
        content: text,
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const config = {
    method: "post",
    url: "https://api.openai.com/v1/chat/completions",
    headers: {
      Authorization: `Bearer ${openaiApiKey}`,
      "Content-Type": "application/json",
    },
    data: data,
  };

  try {
    const response = await axios(config);
    let messageContent = response.data.choices[0].message.content;
    // Remove ```json from the response content and the last ```
    messageContent = messageContent.replace("```json", "").replace("```", "");

    // Essayer de parser la réponse comme un JSON
    try {
      const parsedContent = JSON.parse(messageContent);
      return parsedContent;
    } catch (error) {
      throw new Error("La réponse n'est pas un JSON valide.");
    }
  } catch (error) {
    console.error(
      "Erreur avec l'API OpenAI :",
      error.response ? error.response.data : error.message
    );
    throw new Error(
      error.response ? error.response.data.error.message : error.message
    );
  }
};
const checkCedeurFields = (extractedData) => {
  const requiredFields = ["nom", "prenom", "societe", "email"];
  let missingFields = [];

  const normalizedData = normalizeKeys(extractedData);

  requiredFields.forEach((field) => {
    if (!normalizedData[field] || normalizedData[field].trim() === "") {
      missingFields.push(field);
    }
  });

  return {
    status: missingFields.length > 0 ? "missing" : "Ok",
    reason:
      missingFields.length > 0
        ? `Champs manquants: ${missingFields.join(", ")}`
        : "Tous les champs requis sont présents.",
    missingFields,
    data: normalizedData,
  };
};

router.post("/cedeurs", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res
      .status(400)
      .json({ status: "missing", reason: "Le champ texte est requis." });
  }

  try {
    const chatResponse = await getChatGPTResponseForCedeur(text); // Extract information from ChatGPT
    const result = checkCedeurFields(chatResponse); // Validate fields

    if (result.status === "missing") {
      return res.status(400).json({
        status: "missing",
        reason: result.reason,
        missingFields: result.missingFields,
      });
    }

    const cedeur = await Cedeur.create(result.data);
    return res.json({ status: "success", data: cedeur });
  } catch (error) {
    return res.status(500).json({ status: "error", reason: error.message });
  }
});

// Fonction pour interroger l'API et évaluer les acquéreurs potentiels
const getChatGPTResponseForEvaluation = async (cedeur, acquereurs) => {
  const prompt = `
    Un cédant cherche à vendre son entreprise. Voici les détails du cédant :
    - Nom : ${cedeur.nom}
    - Code NAF : ${cedeur.codeNaf}
    - Taille Effectif : ${cedeur.tailleEffectif}
    - Localisation : ${cedeur.localisation}
    - Niveau CA : ${cedeur.niveauCA}

    Voici une liste d'acquéreurs potentiels :
    ${acquereurs
      .map((acquereur, index) => {
        return `Acquéreur ${index + 1} :
        - id : ${acquereur.id}
        - Nom : ${acquereur.nom}
        - Code NAF : ${acquereur.codeNaf}
        - Taille Effectif : ${acquereur.tailleEffectif}
        - Localisation : ${acquereur.localisation}
        - Niveau CA : ${acquereur.niveauCA}`;
      })
      .join("\n")}

    Sur la base des informations fournies, renvoie uniquement une liste des acquéreurs potentiels compatibles au format **strictement JSON** comme ceci :

    {
      "status": "success",
      "data": [
        {
          "id": 1,
          "nom": "John",
          "prenom": "Doe",
          "societe": "Amazon",
          "email": "john.doe@example.com",
          "secteur": "Technologie"
        }
      ]
    }
    
    Ne retourne rien d'autre que le JSON ci-dessus. Aucun texte explicatif, aucune information supplémentaire.
  `;

  const data = JSON.stringify({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Vous êtes un expert en fusions et acquisitions.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 500,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const config = {
    method: "post",
    url: "https://api.openai.com/v1/chat/completions",
    headers: {
      Authorization: `Bearer ${openaiApiKey}`,
      "Content-Type": "application/json",
    },
    data: data,
  };

  try {
    const response = await axios(config);

    const messageContent = response.data.choices[0].message.content.trim();

    // Vérifie si la réponse est bien un JSON valide
    if (!messageContent.startsWith("{") || !messageContent.endsWith("}")) {
      throw new Error("La réponse de l'IA n'est pas au format JSON valide.");
    }

    const parsedResult = JSON.parse(messageContent);
    return parsedResult;
  } catch (error) {
    console.error("Erreur avec l'API OpenAI :", error.message);
    throw new Error(
      "Erreur lors de la communication avec l'IA : " + error.message
    );
  }
};

// Route pour évaluer les acquéreurs potentiels avec l'IA
router.get("/evaluate/:cedeurname", async (req, res) => {
  try {
    const cedeurName = req.params.cedeurname;
    const cedeur = await Cedeur.findOne({ where: { nom: cedeurName } });

    if (!cedeur) {
      return res
        .status(404)
        .json({ status: "error", message: "Cédant introuvable" });
    }

    const acquereurs = await Acquereur.findAll();

    if (acquereurs.length === 0) {
      return res
        .status(200)
        .json({ status: "error", message: "Aucun acquéreur trouvé" });
    }

    const evaluationResult = await getChatGPTResponseForEvaluation(
      cedeur,
      acquereurs
    );

    if (!evaluationResult || !evaluationResult.data) {
      return res
        .status(500)
        .json({ status: "error", message: "Réponse inattendue de l'IA" });
    }

    return res.json(evaluationResult);
  } catch (error) {
    console.error("Erreur serveur:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Une erreur est survenue lors de l'évaluation des acquéreurs.",
      details: error.message, // Pour aider à déboguer
    });
  }
});

module.exports = router;
