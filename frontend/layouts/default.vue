<template>
  <header
    :class="[
      'flex justify-between items-center p-6 w-full z-10',
      isHomePage ? 'absolute top-0 left-0' : 'relative',
    ]"
  >
    <!-- Logo -->
    <NuxtLink to="/" class="text-xl font-bold text-xlinks-600">
      <img src="~/assets/img/logo_xlinks.png" alt="Xlinks" class="w-36" />
    </NuxtLink>

    <!-- Menu burger pour mobile -->
    <button @click="toggleMenu" class="md:hidden text-xlinks-600">
      <!-- Icone Menu (Burger) -->
      <div v-if="isMenuOpen" class="flex">
        <Icon
          name="material-symbols-light:close"
          size="24"
          style="color: white"
        />
      </div>
      <div v-else class="flex">
        <Icon name="cil:hamburger-menu" size="24" style="color: white" />
      </div>
    </button>

    <!-- Navigation pour desktop et menu mobile -->
    <nav
      :class="[
        'md:w-2/5 md:flex md:justify-evenly md:items-center',
        isMenuOpen ? 'block' : 'hidden',
        'absolute md:relative top-full left-0 w-full bg-white md:bg-transparent py-4 md:py-0',
      ]"
    >
      <NuxtLink
        v-for="(item, index) in menu"
        :key="index"
        :to="item.link"
        class="block md:inline-block py-2 md:py-0 px-4 md:px-0 menu-item"
      >
        {{ item.name }}
      </NuxtLink>
      <a href="#" class="block md:inline-block py-2 md:py-0 px-4 md:px-0">
        <button
          class="w-full flex items-center justify-center px-[25px] py-[15px] border border-transparent text-base font-medium rounded-full text-white bg-xlinks-500 hover:bg-xlinks-secondary-200 hover:text-black md:text-lg"
        >
          S'inscrire à la newsletter
        </button>
      </a>
    </nav>
  </header>
  <slot />
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router"; // Importer useRoute pour récupérer la route courante

const isMenuOpen = ref(false);
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const menu = ref([
  { name: "Acquéreur", link: "/acquereur" },
  { name: "Cédant", link: "/cedant" },
]);

// Récupérer la route courante
const route = useRoute();

// Vérifier si la route est la page d'accueil
const isHomePage = computed(() => route.path === "/");
</script>

<style scoped lang="scss">
.menu-item {
  position: relative;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background-color: #000;
    transition: width 0.3s;
  }

  &:hover:after {
    width: 100%;
  }
}
</style>
