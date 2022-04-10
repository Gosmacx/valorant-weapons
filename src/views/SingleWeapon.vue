<template>
    <section class="flex items-center md:flex-row md:space-y-0 space-y-10 flex-col justify-evenly h-screen w-full" >
        <div v-if="weapon" class="md:w-[35%] flex flex-col relative items-center justify-center w-[90%] relativex h-[70%] rounded bg-slate-300 shadow-xl shadow-gray-800" >

                <button :class="{ activeClass: videoDisplay && videoSrcLink }" @click="showVideo" class="absolute right-2 top-3 px-2 py-1 hover:bg-[#fa4454] hover:text-gray-100 border border-[#fa4454] transition-all text-[#fa4454]" >Video</button>
                <button @click="$router.push('/')" class="absolute left-2 top-3 px-2 py-1 hover:bg-[#fa4454] hover:text-gray-100 border border-[#fa4454] transition-all text-[#fa4454]" >Weapons</button>

                <div v-if="selectedSkin" class="group mt-5 flex items-center justify-center space-x-2 absolute top-2" >
                    <img @mouseover="chromaText = item.displayName" :class="{ activeChroma: item.uuid == selectedChroma?.uuid }" @click="selectChroma(index)" v-for="(item, index) in selectedSkin.chromas" :key="(item, index)" width="50" class="rounded shadow-sm cursor-pointer hover:scale-90 transition-all shadow-gray-800" :src="item.swatch" alt="">
                    <span class="bg-gray-800 invisible shadow-sm shadow-black text-xs group-hover:visible transition-all opacity-0 group-hover:opacity-100 group-hover:mb-1 py-1 rounded px-2 absolute -top-16 z-10" > {{ chromaText }} </span>
                </div>

            <div class="w-[80%] h-[80%] flex items-center justify-center" >
                <video v-show="videoDisplay && videoSrcLink"  class="rounded shadow shadow-gray-800" :src="videoSrcLink" controls></video>
                <img v-show="!videoDisplay || !videoSrcLink" :src="selectedSkin ? selectedSkin.displayIcon : weapon.displayIcon" alt="">
                <div class="flex flex-col absolute right-2 text-black ml-5 space-y-5" >
                    <button @click="IncreaseSkinIndex" class="px-3 py-1 hover:bg-[#fa4454] hover:text-gray-100 border border-[#fa4454] transition-all text-[#fa4454] " > + </button>
                    <button @click="decreaseSkinIndex" class="px-3 py-1 hover:bg-[#fa4454] hover:text-gray-100 border border-[#fa4454] transition-all text-[#fa4454] " > - </button>
                </div>
            </div>

            

            <div class="flex items-center justify-center space-x-5" >
                <select @change="selectSkin($event)" class="text-gray-900 outline-none px-7 py-1 max-w-[300px] rounded shadow-sm shadow-gray-900" >
                    <option value="-1" disabled :selected="selectedSkinIndex == -1" class="text-center" > {{ weapon.skins.length }} Skin </option>
                    <option v-for="(item, index) in weapon.skins" :key="(item, index)" :value="index" :selected="selectedSkinIndex == index && selectedSkinIndex !== -1" > {{ item.displayName }} </option>
                </select>

                <select v-if="selectedSkin?.levels" @change="selectLevel($event)" class="text-gray-900 max-w-[300px] outline-none px-7 py-1 rounded shadow-sm shadow-gray-900" >
                    <option value="" disabled selected>Default</option>
                    <option v-for="(item, index) in selectedSkin.levels" :key="(item, index)" :value="index"> {{ item.displayName }} </option>
                </select>
            </div>



        </div>

    </section>
</template>

<script setup>

import { ref } from 'vue';
import { useRoute } from 'vue-router';
import router from '../router';

const videoDisplay = ref(false);
const videoSrcLink = ref(null);
const chromaText = ref(null)
const weapon = ref(null)

const selectedSkinIndex = ref(-1)
const selectedChroma = ref(null)
const selectedLevel = ref(null)
const selectedSkin = ref(null)

const route = useRoute()

const showVideo= () => {

    if (!selectedChroma.value && !selectedLevel.value) return alert('Select a level or a chroma first.')
    if (!videoSrcLink.value) {
        videoDisplay.value = false
        return alert('This skin has no video.')
    } else {
        videoDisplay.value = !videoDisplay.value 
    }
        
}

const reset = () => {
    videoSrcLink.value = null
    selectedChroma.value = null
    selectedLevel.value = null
    selectedSkin.value = null
}

const IncreaseSkinIndex = (type) => {
    if (selectedSkinIndex.value > weapon.value.skins.length - 2) return
    selectedSkinIndex.value++
    reset()
    selectSkin(selectedSkinIndex.value)
}

const decreaseSkinIndex = (type) => {
    if (selectedSkinIndex.value < 0) return
    selectedSkinIndex.value--
    reset()
    selectSkin(selectedSkinIndex.value)
}

const selectSkin = (event) => {
    selectedSkinIndex.value = event.target ? event.target.value : event
    selectedSkin.value =  weapon.value.skins[selectedSkinIndex.value]
}

const selectChroma = (index) => {
    selectedSkin.value.displayIcon = selectedSkin.value.chromas[index].fullRender
    videoSrcLink.value = selectedSkin.value.chromas[index].streamedVideo
    selectedChroma.value = selectedSkin.value.chromas[index]
}

const selectLevel = (event) => {
    let skin = selectedSkin.value?.levels[event.target.value]
    if  (skin.displayIcon) selectedSkin.value.displayIcon = skin.displayIcon;
    videoSrcLink.value = skin.streamedVideo
    selectedLevel.value = skin
}

fetch(`https://valorant-api.com/v1/weapons/${route.params.id}`)
.then(res => res.json())
.then(data => {
    weapon.value = data.data
    if (!data.data) {
        alert("Weapon not found")
        router.push("/")
    }
}).catch(err => {
    console.log(err)
    alert("Weapon not found")
    router.push("/")
})

</script>

<style scoped>

.activeClass {
    background-color: #fa4454;
    color: #fff;
}

.activeChroma {
    margin-bottom: 10px;
}

</style>