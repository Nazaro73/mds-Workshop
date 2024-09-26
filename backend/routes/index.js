const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const Acquereur = require("../models/Acquereur");
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
          "Veuillez extraire les informations suivantes d'un texte donné : nom, prénom, société et email. Retournez les résultats dans un format JSON avec les attributs suivants : 'nom', 'prenom', 'societe', 'email'. Ne repondez que en json.",
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
    console.error(
      "Réponse de l'API OpenAI :",
      response.data.choices[0].message.content
    );
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
    throw new Error(response.data);
  }
};

// Normaliser les clés pour s'assurer que les majuscules/minuscules ne causent pas de problème
const normalizeKeys = (data) => {
  const normalizedData = {};
  Object.keys(data).forEach((key) => {
    // Normaliser les noms de champs : tout en minuscule
    normalizedData[key.trim().toLowerCase()] = data[key];
  });
  return normalizedData;
};

// Fonction pour vérifier les champs dans le JSON renvoyé par l'IA
const checkFields = (extractedData) => {
  const requiredFields = ["nom", "prenom", "societe", "email"];
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

// Route POST /ask
router.post("/ask", async (req, res) => {
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
    const acquereur = await Acquereur.create(result.data);
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

//Route Post /cedeurs

router.post("/cedeurs", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res
      .status(400)
      .json({ status: "missing", reason: "Le champ texte est requis." });
  }

  try {
    const chatResponse = await getChatGPTResponse(text); // Appel à l'API OpenAI pour extraire les informations
    const result = checkFields(chatResponse); // Vérification des champs extraits
    // Add to the database
    const cedeur = await Cedeur.create(result.data);
    return res.json({ status: "success", data: cedeur, result });
  } catch (error) {
    return res.status(500).json({ status: "error", reason: error.message });
  }
});

module.exports = router;
