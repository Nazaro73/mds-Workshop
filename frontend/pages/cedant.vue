<template>
  <div class="flex justify-center flex-wrap" id="search-container-parent">
    <div
      class="flex justify-center items-center h-fit focus-search mx-auto mb-24"
      id="search-container"
    >
      <div
        class="container mx-auto bg-xlinks-secondary-200 rounded-lg p-14"
        data-aos="fade-up"
      >
        <!-- Formulaire et discussion dans la même section -->
        <div class="form-and-chat">
          <form @submit.prevent="onSubmit">
            <h1 class="text-center font-bold text-black text-4xl">
              Parlez-nous de votre entreprise
            </h1>
            <p class="mx-auto font-normal text-sm my-6 text-black">
              Veuillez fournir des informations complètes sur votre entreprise
              pour que nous puissions valider votre profil.
            </p>
            <section class="conversation my-6">
              <div v-if="errorMessage" class="chat-message system-message">
                <p>{{ errorMessage }}</p>
              </div>
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
                placeholder="Décrivez votre entreprise..."
                @input="autoResize"
                @keydown="handleKeyDown"
                @focus="focusSearch"
              ></textarea>
              <div class="flex items-end">
                <button
                  type="submit"
                  class="button-search flex justify-center items-center bg-xlinks-secondary-200 text-black text-xl rounded-full h-[32px] w-[32px]"
                >
                  <span v-if="loading" class="flex">
                    <span
                      class="loading loading-dots loading-sm text-black"
                    ></span>
                  </span>
                  <span v-else class="flex">
                    <Icon name="tabler:arrow-up" style="color: black" />
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <section
      class="results max-w-7xl w-full mx-auto flex justify-center items-start"
    >
      <!-- Show a loader while loading -->
      <div v-if="loading" class="flex justify-center">
        <span class="loading loading-dots loading-lg"></span>
      </div>

      <!-- Show results when loading is finished -->
      <div v-else class="mb-12">
        <!-- Your results will be here -->
        <h2 class="text-3xl font-bold text-black my-10">
          Résultats de votre recherche :
        </h2>
        <div
          class="flex gap-5 md:gap-8 rounded-sm border-xlinks-600 border-[1px] border-solid w-full p-6 mx-auto"
          data-aos="fade-in"
        >
          <div class="w-fit">
            <Icon name="et:profile-male" size="30px"></Icon>
          </div>
          <div class="w-3/5">
            <h2 class="text-2xl font-bold">Entreprneur individuel</h2>
            <h3 class="text-lg font-bold">Chiffre d'affaire : 3,5k €</h3>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Corrupti, vitae magni. Sunt ipsam ipsum dolor! Quos numquam non
              optio, quod accusantium natus itaque deserunt, enim necessitatibus
              nesciunt architecto vero ratione! Itaque corporis eligendi nihil.
            </p>
          </div>
        </div>
      </div>
    </section>
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
const apiUrl = "http://127.0.0.1:2000/cedeurs"; // L'URL de votre API backend pour les cédants

onMounted(() => {
  AOS.init();
});

const onSubmit = async () => {
  if (loading.value) return;

  loading.value = true;
  errorMessage.value = "";
  const userText = inputField.value.value;

  // Simple validation: Ensure the input field is not empty
  if (!userText.trim()) {
    errorMessage.value = "Veuillez décrire votre entreprise.";
    loading.value = false;
    return;
  }

  // Add validation to check for required fields in the input
  const requiredFields = ["nom", "prenom", "societe", "email"];
  const inputFields = userText.split(/\s+/); // Split the user input by spaces (or any other delimiter)
  const missingFields = [];

  // Check if required fields are present
  requiredFields.forEach((field) => {
    if (!inputFields.includes(field)) {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    errorMessage.value = `Veuillez renseigner ces informations : ${missingFields.join(
      ", "
    )}`;
    loading.value = false;
    return;
  }

  // If all fields are valid, send the request
  messages.value.push({ type: "user", content: userText });

  try {
    const response = await axios.post(apiUrl, { text: userText });

    if (response.data.status === "success") {
      messages.value.push({
        type: "system",
        content: "Votre demande a été validée et enregistrée avec succès.",
      });
    } else if (response.data.status === "missing") {
      const missingFields = response.data.missingFields;
      const missingMessage = `Veuillez renseigner ${
        missingFields.length > 1 ? "ces informations" : "cette information"
      } : ${missingFields.join(", ")}`;
      messages.value.push({ type: "system", content: missingMessage });
    }
  } catch (error) {
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

  loading.value = false;

  let searchContainer = document.getElementById("search-container");

  if (searchContainer) {
    searchContainer.classList.remove("focus-search");
  }
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

#search-container {
  transition: all 0.3s ease-in-out;
  transform: translateY(0) scale(0.7);
  transform-origin: top;
}

/* Section pour form et messages ensemble */
.form-and-chat {
  max-width: 700px;
  margin: 0 auto;
}

.focus-search {
  margin-top: 15vh;
  transform: scale(1) !important;
  width: max-content;
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
  background-color: $primary-color;
  color: white;
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
