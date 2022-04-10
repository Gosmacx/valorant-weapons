<template>
  <section class="flex items-center flex-col justify-center" >
    <div class="flex flex-col w-full space-y-5 pb-4 items-center justify-center border-b-2 border-b-gray-900" >
      <input v-model="searchText" class="mt-10 rounded-lg outline-none text-black h-10 w-[50%] px-2" type="text" placeholder="Search a Weapon" />
      <div class=" w-full h-12 space-x-2 items-center justify-center flex" >

        <button v-for="category in filters" :key="category" :class="{ activeClass: category === `${filter}`  }" @click="selectFilter(`${category}`)" class="border-2 border-[#fa4454] px-2 py-1 text-[#fa4454] hover:border-[#fc6b77] hover:text-[#fc6b77] transition-all shadow shadow-gray-800 " >
          {{ category }}
        </button>
      
      </div>
    </div>

    <div class="flex mt-10 flex-wrap w-full items-center justify-center" >
        <span v-if="!weapons" class="text-2xl font-semibold self-center" >Loading...</span>
        <Weapon @click="$router.push(`/${weapon.uuid}`)" v-else v-for="weapon in filteredWeapons" :weapon="weapon" :key="weapon" />
    </div>
  </section>
</template>

<script setup>

import Weapon from '../components/Weapon.vue'
import { ref, watchEffect } from 'vue'

const weapons = ref(null)
const filteredWeapons = ref(null)
const filter = ref(null)
const filters = ref([])
const searchText = ref(null)

const makeFilter = () => {
    if (filter.value) {
      filteredWeapons.value = weapons.value.filter(weapon => weapon.shopData?.categoryText === filter.value)
    } else {
      filteredWeapons.value = weapons.value
    }
}

const selectFilter = (type) => {

  if (filter.value == type) {

    filter.value = null
    makeFilter()

  } else {

    filter.value = type
    filteredWeapons.value = weapons.value.filter(weapon => weapon.shopData?.categoryText === type)

  } 

}

// Fake Databes Effect
// No filtering while the user is typing in the search bar
watchEffect((onInvalidate) => {

  if (searchText.value?.length > 0) {

    const typing = setTimeout(() => {
      makeFilter()
      const search = searchText.value.toLowerCase()
      const filtered = filteredWeapons.value.filter(weapon => {
        return weapon.displayName.toLowerCase().includes(search)
      })
      filteredWeapons.value = filtered

    }, 50); // Timeout for filtering

    onInvalidate(() => clearTimeout(typing))

  } else {
    makeFilter()
  }

})

fetch("https://valorant-api.com/v1/weapons")
.then(res => res.json())
.then(data => {
  weapons.value = data.data
  filteredWeapons.value = data.data
  data.data.forEach(element => {
    if (!filters.value.includes(element.shopData?.categoryText) && element.shopData?.categoryText) {
      filters.value.push(element.shopData?.categoryText)
    }
  });
})
.catch(err => Alert("Error fetching weapons"))

</script>

<style scoped>
.activeClass {
  background-color: #fa4454 !important;
  color: #dedede !important;
}


</style>