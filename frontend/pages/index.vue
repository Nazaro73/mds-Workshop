<template>
  <section
    class="bg-white relative max-w-7xl mx-auto overflow-hidden flex justify-center items-center h-screen w-full flex-wrap"
  >
    <div class="mx-auto w-full md:w-1/2 flex flex-wrap px-6 md:px-0">
      <h1
        class="text-4xl tracking-tight font-extrabold text-black sm:text-5xl md:text-6xl"
        data-aos="fade-right"
        data-aos-duration="800"
      >
        <span class="block xl:inline">Mise en relation pour</span>
        <br />
        <span class="block text-xlinks-600 xl:inline"
          >Cessions d'Entreprises</span
        >
      </h1>
      <p
        class="mt-3 text-base text-black sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
        data-aos="fade-in"
        data-aos-delay="1250"
        data-aos-duration="800"
      >
        XLINKS révolutionne la mise en relation entre repreneurs et cédants
        grâce à l'intelligence artificielle. Trouvez votre match parfait dans le
        monde des affaires.
      </p>
      <div
        class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start"
        data-aos="fade-in"
        data-aos-delay="1600"
        data-aos-duration="800"
      >
        <div class="rounded-full shadow">
          <NuxtLink
            to="acquereur"
            class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-xlinks-500 hover:bg-xlinks-secondary-200 hover:text-black md:py-4 md:text-lg md:px-10"
          >
            Je suis acquéreur
          </NuxtLink>
        </div>
        <div class="mt-3 sm:mt-0 sm:ml-3">
          <NuxtLink
            to="cedant"
            class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-black bg-xlinks-secondary-200 hover:bg-xlinks-600 hover:text-white md:py-4 md:text-lg md:px-10"
          >
            Je suis cédant
          </NuxtLink>
        </div>
      </div>
    </div>
    <div
      class="w-full md:w-1/2 flex justify-center items-center opacity-75"
      data-aos="zoom-in"
      data-aos-duration="800"
    >
      <div
        style="position: relative; width: 300px; height: 300px"
        class="md:scale-150"
      >
        <img
          src="../assets/img/man.jpg"
          class="object-cover object-[120%]"
          style="width: 100%; height: 100%; clip-path: url(#image-clip)"
        />
        <svg>
          <defs>
            <clipPath id="image-clip">
              <path
                d="M1.9,2.4c1,1.3,24,30.8,51.1,65.5s49.5,63.7,49.8,64.4c.4,1.1-72.4,95.8-96.5,125.7-2,2.5-4.3,5.3-5,6.2-1.3,1.7.9,1.8,43.5,1.8h44.9l30.2-38.8c16.5-21.3,39.9-51.2,51.8-66.5l21.6-27.7-35.2-45.3c-19.4-24.8-42.7-54.8-51.8-66.5L89.7,0H0l1.9,2.4ZM177.3,28.5l-21.3,28.4,22.8,29c12.6,16,23.1,28.7,23.5,28.3.5-.5,72.9-96.6,84.2-111.8l1.9-2.4-44.9.1h-44.8l-21.4,28.4ZM179.5,179.7c-12,15.3-22.2,28.4-22.6,29-.5.8,6.1,10.4,18,26,10.4,13.7,19.9,26.3,21.1,28l2.3,3.3h44.5c24.4,0,44.4-.3,44.4-.6s-11.1-15.2-24.7-33.2-32.3-42.8-41.6-55.2c-9.4-12.4-17.5-23.1-18.2-23.8-1-1.1-5.4,3.8-23.2,26.5Z"
              />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  </section>
</template>

<style scoped>
header {
  position: absolute !important;
}
</style>

<script setup>
import AOS from "aos";
import "aos/dist/aos.css";
onMounted(async () => {
  AOS.init();
});
</script>
