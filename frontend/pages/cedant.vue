<template>
  <div>
    <div class="flex justify-center" id="search-container-parent">
      <div
        class="flex justify-center items-center h-fit focus-search mx-auto"
        id="search-container"
      >
        <div
          class="container mx-auto bg-xlinks-secondary-200 rounded-lg p-14"
          data-aos="fade-up"
        >
          <form @submit.prevent="onSubmit">
            <h1 class="text-center font-bold text-black text-4xl">
              Parlez-nous de votre entreprise
            </h1>
            <p class="mx-auto font-normal text-sm my-6 text-black">
              Veuillez fournir les informations suivantes pour nous aider à
              mieux comprendre votre profil et vos besoins. Cela inclut vos
              coordonnées complètes, le type d'acquéreur que vous êtes, les
              secteurs d'activité qui vous intéressent, le nombre de
              collaborateurs que vous recherchez, les localisations
              géographiques souhaitées, ainsi que le chiffre d'affaires moyen
              des deux dernières années. N'oubliez pas d'inclure toutes autres
              informations pertinentes telles que votre calendrier, les fonds
              disponibles pour une acquisition, et tout autre élément important
              pour votre recherche d'entreprise.
            </p>
            <div
              class="sm:flex items-center relative bg-white rounded-lg overflow-hidden min-h-[58px] px-2 py-1 justify-between"
            >
              <textarea
                ref="inputField"
                class="text-[16px] text-black flex-grow outline-none h-[50px] resize-none"
                placeholder="Je suis une entreprise qui..."
                @input="autoResize"
                @keydown="handleKeyDown"
                @focus="focusSearch"
              ></textarea>

              <button
                type="submit"
                class="button-search absolute bottom-0 right-0 flex justify-center items-center bg-xlinks-secondary-200 text-black text-xl rounded-full h-[32px] w-[32px]"
              >
                <span v-if="loading" class="flex">
                  <span class="loading loading-dots loading-sm"></span>
                </span>
                <span v-else class="flex">
                  <Icon name="tabler:arrow-up"></Icon>
                </span>
              </button>
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
      <div v-else>
        <!-- Your results will be here -->
        <h2 class="text-3xl font-bold text-black mt-10">
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

<style scoped>

#search-container {
  transition: all 0.3s ease-in-out;
  transform: translateY(0) scale(0.7);
  transform-origin: top;
}

.button-search {
  bottom: calc((25px + 0.25rem) / 2);
  right: calc((25px + 0.25rem) / 2);
}

.focus-search {
  margin-top: 15vh;
  transform: scale(1) !important;
  width: max-content;
  position: absolute;
}

textarea {
  overflow-y: hidden;
  resize: none;
  height: 50px;
  height: auto; /* Let JS handle height adjustments */
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

<script setup>
import { ref, onMounted } from "vue";
import AOS from "aos";
import "aos/dist/aos.css";

const inputField = ref(null);
const loading = ref(false);

onMounted(async () => {
  AOS.init();
});

const onSubmit = () => {
  if (loading.value) {
    return; // Empêcher une nouvelle soumission tant que le chargement est en cours
  }

  loading.value = true; // Démarrer le chargement
  const searchContainer = document.getElementById("search-container");

  // Simuler la récupération des résultats ou un appel API
  setTimeout(() => {
    loading.value = false; // Arrêter le chargement une fois les résultats prêts
    
    if (searchContainer) {
      searchContainer.classList.remove("focus-search");
      searchContainer.style.marginTop = "20px";
    }
  }, 3000); // Simuler un délai de 3 secondes pour la récupération des résultats
};

// If focus search is active, lock the scroll
const lockScroll = () => {
    document.body.style.overflow = "hidden";
};

const unlockScroll = () => {
    document.body.style.overflow = "";
};


// Adjust the height of the textarea
const autoResize = () => {
  const textarea = inputField.value;
  if (textarea) {
    textarea.style.height = "50px"; // Set the base height
    if (textarea.value.trim()) {
      textarea.style.height = textarea.scrollHeight + "px"; // Set dynamic height based on content
    }
  }
};

// Handle "Shift + Enter" to avoid form submission
const handleKeyDown = (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault(); // Prevent form submission with Enter
    onSubmit();
  }
};

// Add focus class if user clicks on the textarea
const focusSearch = () => {
  const searchContainer = document.getElementById("search-container");
  if (searchContainer) {
    searchContainer.classList.add("focus-search");
    searchContainer.style.marginTop = "15vh";
  }
};

// Reset the container if user returns to the input field after form submission
onMounted(() => {
  const searchContainer = document.getElementById("search-container");
  if (searchContainer) {
    searchContainer.classList.add("focus-search");
    searchContainer.style.marginTop = "15vh";
  }
});

onMounted(() => {
  autoResize(); // Ensure the textarea height is correct on load
});
</script>
