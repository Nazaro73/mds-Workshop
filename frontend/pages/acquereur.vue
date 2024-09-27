<template>
  <div class="flex justify-center" id="search-container-parent">
    <div
      class="flex justify-center items-center h-fit focus-search mx-auto"
      id="search-container"
    >
      <div
        class="container mx-auto bg-xlinks-500 rounded-lg p-14"
        data-aos="fade-up"
      >
        <!-- Formulaire et discussion dans la même section -->
        <div class="form-and-chat">
          <form @submit.prevent="onSubmit">
            <h1 class="text-center font-bold text-white text-4xl">
              Quelle entreprise recherchez-vous ?
            </h1>
            <p class="mx-auto font-normal text-sm my-6 text-white">
              Veuillez fournir des informations complètes pour que nous
              puissions valider votre demande.
            </p>
            <!-- Chat-style conversation -->
            <section class="conversation my-6">
              <div
                v-for="(message, index) in messages"
                :key="index"
                class="chat-message"
                :class="{
                  'user-message': message.type === 'user',
                  'system-message': message.type === 'system',
                }"
              >
                <p>{{ message.content }}</p>
              </div>
            </section>
            <div
              class="relative sm:flex items-end bg-white rounded-lg overflow-hidden min-h-[58px] px-2 py-1 justify-between"
            >
              <textarea
                ref="inputField"
                class="text-[16px] text-black flex-grow outline-none h-[50px] resize-none"
                placeholder="Décrivez votre recherche d'entreprise..."
                @input="autoResize"
                @keydown="handleKeyDown"
                @focus="focusSearch"
              ></textarea>
              <div class="flex items-end">
                <button
                  type="submit"
                  class="button-search flex justify-center items-center bg-xlinks-500 text-black text-xl rounded-full h-[32px] w-[32px]"
                >
                  <span v-if="loading" class="flex">
                    <span
                      class="loading loading-dots loading-sm text-white"
                    ></span>
                  </span>
                  <span v-else class="flex">
                    <Icon name="tabler:arrow-up" style="color: white" />
                  </span>
                </button>
              </div>
            </div>

            <!-- Afficher le message d'erreur si des champs sont manquants -->
            <p v-if="errorMessage" class="text-red-500 mt-2">
              {{ errorMessage }}
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AOS from "aos";
import axios from "axios";

const inputField = ref(null);
const loading = ref(false);
const messages = ref([]);
const errorMessage = ref(""); // Pour stocker les messages d'erreur
const apiUrl = "http://127.0.0.1:2000/new-acquereur"; // L'URL de votre API backend

onMounted(() => {
  AOS.init();
});

const onSubmit = async () => {
  if (loading.value) {
    return; // Empêcher une nouvelle soumission tant que le chargement est en cours
  }

  loading.value = true; // Démarrer le chargement
  errorMessage.value = ""; // Réinitialiser les messages d'erreur avant une nouvelle soumission
  const userText = inputField.value.value;

  if (!userText.trim()) {
    errorMessage.value = "Veuillez décrire votre recherche.";
    loading.value = false;
    return;
  }

  // Ajouter le message de l'utilisateur à la conversation
  messages.value.push({ type: "user", content: userText });

  // Appel à l'API backend pour valider et extraire les informations
  try {
    const response = await axios.post(apiUrl, { text: userText });

    if (response.data.status === "success") {
      // Ajouter un message de validation réussi si tous les champs sont valides
      messages.value.push({
        type: "system",
        content: "Votre demande a été validée et enregistrée avec succès.",
      });
    } else if (response.data.status === "missing") {
      // Ajouter un message de validation échouée si des champs sont manquants
      const missingFields = response.data.missingFields;
      const missingMessage = `Veuillez renseigner ${missingFields.length > 1 ? 'ces informations' : 'cette information'} : ${missingFields.join(", ")}`;
      messages.value.push({ type: "system", content: missingMessage });
    }
  } catch (error) {
    // Si le backend retourne une erreur, on récupère le message pour l'afficher
    if (error.response && error.response.data && error.response.data.reason) {
      messages.value.push({
        type: "system",
        content: `Erreur: ${error.response.data.reason}`,
      });
    } else {
      messages.value.push({
        type: "system",
        content: "Erreur lors de l'enregistrement de votre demande.",
      });
    }
  }

  loading.value = false; // Arrêter le chargement
};

// Ajuster la hauteur du textarea
const autoResize = () => {
  const textarea = inputField.value;
  if (textarea) {
    textarea.style.height = "50px"; // Set the base height
    if (textarea.value.trim()) {
      textarea.style.height = textarea.scrollHeight + "px"; // Set dynamic height based on content
    }
  }
};

// Gestion de la touche Enter pour soumettre
const handleKeyDown = (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault(); // Empêcher la soumission du formulaire avec Enter
    onSubmit();
  }
};

// Focus sur le champ de recherche
const focusSearch = () => {
  const searchContainer = document.getElementById("search-container");
  if (searchContainer) {
    searchContainer.classList.add("focus-search");
  }
};
</script>

<style lang="scss" scoped>
$primary-color: #3e6989;
$secondary-color: #cae8ff;
/* Section pour form et messages ensemble */
.form-and-chat {
  max-width: 700px;
  margin: 0 auto;
}

.focus-search {
  margin-top: 15vh;
  transform: scale(1) !important;
  width: max-content;
  position: absolute;
}

.button-search {
  bottom: calc((25px + 0.25rem) / 2);
  right: calc((25px + 0.25rem) / 2);
}

/* Chat-style conversation */
.conversation {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.chat-message {
  padding: 10px;
  border-radius: 10px;
  max-width: 60%;
}

.user-message {
  background-color: #ececec;
  align-self: flex-end;
  text-align: right;
}

.system-message {
  background-color: $secondary-color;
  color: black;
  align-self: flex-start;
  text-align: left;
}

textarea {
  padding: calc(25px / 2);
}

#search-container-parent:has(.focus-search) {
  background: white;
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 8;
}
</style>
