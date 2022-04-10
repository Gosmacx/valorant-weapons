<template>
    <div class="group transition-all cursor-pointer m-2 bg-gradient-to-tr from-gray-100 to-gray-400 h-72 w-80 rounded relative shadow-lg flex flex-col items-center justify-between shadow-gray-700" >
        <span class="text-lg text-center font-semibold text-gray-700" > {{ weapon.displayName }} </span>
        <div class="w-[250px] h-[250px] flex items-center justify-center relative " >
            <img class="object-cover group-hover:scale-110 transition-all" :src="weapon.displayIcon" alt="">
        </div>
        <div class="w-full text-gray-200 h-12 flex space-x-2 items-center justify-center" >
            <span class="p-1 bg-[#fa4454] rounded-md" > {{ weapon.shopData?.cost == 0 || !weapon.shopData?.cost ? 'Free' : weapon.shopData?.cost + '$' }} </span>
            <span v-if="weapon.shopData" class="p-1 bg-[#fa4454] rounded-md" > {{ weapon.shopData?.categoryText }} </span>

        </div>
    </div>
</template>

<script setup="props">

const props = defineProps({
    weapon: Object
})


</script>