<script setup lang="ts">
import { computed, ref } from 'vue';
import { Metaplex, WalletAdapterIdentityDriver, GuestIdentityDriver, MetaplexFile } from '@metaplex/js-next';
import { useWallet } from 'solana-wallets-vue';

// const endpoint = 'https://ssc-dao.genesysgo.net';
const endpoint = 'https://psytrbhymqlkfrhudd.dev.genesysgo.net:8899';

// Initialize workspace.
const { wallet } = useWallet();
const metaplex = computed(() => {
    const mx = Metaplex.make(endpoint);
    const identity = wallet.value
        ? new WalletAdapterIdentityDriver(mx, wallet.value)
        : new GuestIdentityDriver(mx);

    return mx.setIdentity(identity);
});

// Image upload.
const image = ref<File>();
const imageSrc = ref<string>();
const onFileChange = async (event: Event) => {
    const files = (event.target as HTMLInputElement).files
        || (event as InputEvent).dataTransfer?.files;
    if (!files?.length) return;
    image.value = files[0];
    imageSrc.value = URL.createObjectURL(image.value);
    const mxFile = new MetaplexFile(await image.value.arrayBuffer());
    console.log(image.value, imageSrc.value, mxFile);
    const price = await metaplex.value.storage().getPrice(mxFile);
    console.log(price);
    // const url = await metaplex.value.storage().upload(mxFile);
    // console.log(url);
};

const onCreateNft = async () => {
    const nft = await metaplex.value.nfts().createNft({
        name: 'Mx Test Solflake',
        uri: 'https://arweave.net/b86yUxzuaJCH9NgivDPnpiW1LdSFOmesNV6hXO1JFrM',
    });
    console.log(nft);
}
</script>

<template>
    <div
        class="group bg-black/40 border border-indigo-600 shadow-xl shadow-indigo-700/30 backdrop-blur rounded-2xl text-indigo-100"
        :class="imageSrc ? '' : 'hover:border-pink-600'"
    >
        <div v-if="!imageSrc" class="relative py-24 px-8">
            <div class="flex justify-center">
                <div class="space-y-1 text-center">
                    <svg class="group-hover:animate-bounce group-hover:text-pink-500 mx-auto h-12 w-12 text-gray-300" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <div class="flex text-sm">
                        <p class="font-medium text-white">Upload an image</p>
                        <p class="pl-1">or drag and drop</p>
                    </div>
                    <p class="text-xs opacity-75">PNG, JPG, GIF, etc.</p>
                </div>
            </div>
            <input type="file" @change="onFileChange" class="absolute inset-0 z-50 m-0 p-0 w-full h-full outline-none opacity-0 cursor-pointer">
        </div>

        <div v-else class="flex">
            <img :src="imageSrc" alt="Image to upload as an NFT" class="object-cover w-1/3 rounded-l-2xl border-r border-indigo-500">
            <div class="flex-1 p-8 space-y-8">
                <div>
                    <label for="nft-name" class="text-xs text-indigo-200 uppercase font-medium tracking-widest">Name</label>
                    <input id="nft-name" type="text" class="block w-full bg-indigo-900/50 rounded px-4 py-2 text-xl font-bold border-b-2 border-transparent focus:outline-none focus:border-white focus:text-white">
                </div>
                <div>
                    <label for="nft-description" class="text-xs text-indigo-200 uppercase font-medium tracking-widest">Description</label>
                    <input id="nft-description" type="text" class="block w-full bg-indigo-900/50 rounded px-4 py-2 text-xl font-bold border-b-2 border-transparent focus:outline-none focus:border-white focus:text-white">
                </div>

                <button @click="onCreateNft" class="block w-full px-4 py-2 text-center text-semibold bg-gradient-to-br from-indigo-700 to-blue-600 rounded border-b-2 border-transparent focus:outline-none focus:border-white hover:border-white hover:text-white">Create NFT</button>
            </div>
        </div>
    </div>
</template>
