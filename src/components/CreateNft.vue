<script setup lang="ts">
import { computed, ref } from 'vue';
import { Metaplex, walletOrGuestIdentity, MetaplexFile, bundlrStorage, Nft } from '@lorisleiva/js-next-alpha';
import { useWallet } from 'solana-wallets-vue';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

// Initialize workspace.
const endpoint = 'https://metaplex.devnet.rpcpool.com';
const { wallet } = useWallet();
const metaplex = computed(() => Metaplex.make(endpoint)
    .use(walletOrGuestIdentity(wallet.value))
    .use(bundlrStorage({
        address: 'https://devnet.bundlr.network',
        timeout: 60000,
    }))
);

// Inputs.
const name = ref<string>('');
const description = ref<string>('');
const collection = ref<string>('');

// Select image.
const image = ref<MetaplexFile>();
const imageSrc = ref<string>();
const imagePrice = ref<number>();
const onFileChange = async (event: Event) => {
    const files = (event.target as HTMLInputElement).files
        || (event as InputEvent).dataTransfer?.files;
    if (!files?.length) return;
    image.value = await MetaplexFile.fromFile(files[0]);
    imageSrc.value = URL.createObjectURL(files[0]);
    const price = await metaplex.value.storage().getPrice(image.value);
    imagePrice.value = price.toNumber() / LAMPORTS_PER_SOL;
    name.value = image.value.displayName;
};

// Upload image and create NFT.
const loading = ref(false);
const nft = ref<Nft | null>(null);
const onCreateNft = async () => {
    if (!image.value || loading.value) return;
    try {
        loading.value = true;
        const url = await metaplex.value.storage().upload(image.value);
        const result = await metaplex.value.nfts().createNft({
            name: name.value,
            metadata: {
                name: name.value,
                description: description.value,
                image: url,
                collection: {
                    name: collection.value,
                    family: collection.value,
                },
            },
        });
        nft.value = result.nft;
    } finally {
        loading.value = false;
    }
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

        <div v-else-if="!nft" class="flex">
            <div class="relative w-2/5">
                <img :src="imageSrc" alt="Image to upload as an NFT" class="object-cover w-full h-full rounded-l-2xl border-r border-indigo-500">
                <div class="absolute bottom-4 right-4 rounded px-2 py-1 bg-white/80 backdrop-blur shadow text-xs text-black">
                    <span class="font-sans">◎</span> {{ imagePrice }}
                </div>
            </div>
            <div class="flex-1 p-8 space-y-8">
                <div>
                    <label for="nft-name" class="text-xs text-indigo-200 uppercase font-medium tracking-widest">Name</label>
                    <input v-model="name" id="nft-name" type="text" class="block w-full bg-indigo-900/50 rounded px-4 py-2 text-xl font-bold border-b-2 border-transparent focus:outline-none focus:border-white focus:text-white">
                </div>
                <div>
                    <label for="nft-description" class="text-xs text-indigo-200 uppercase font-medium tracking-widest">Description</label>
                    <input v-model="description" id="nft-description" type="text" class="block w-full bg-indigo-900/50 rounded px-4 py-2 text-xl font-bold border-b-2 border-transparent focus:outline-none focus:border-white focus:text-white">
                </div>
                <div>
                    <label for="nft-collection" class="text-xs text-indigo-200 uppercase font-medium tracking-widest">Collection</label>
                    <input v-model="collection" id="nft-collection" type="text" class="block w-full bg-indigo-900/50 rounded px-4 py-2 text-xl font-bold border-b-2 border-transparent focus:outline-none focus:border-white focus:text-white">
                </div>

                <button @click="onCreateNft" :disabled="loading" :class="loading ? 'cursor-not-allowed' : 'focus:outline-none focus:border-white hover:border-white hover:text-white'" class="block w-full px-4 py-2 text-center text-semibold bg-gradient-to-br from-indigo-700 to-blue-600 rounded border-b-2 border-transparent">
                    <span v-if="loading" class="flex justify-center items-center space-x-2">
                        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Loading</span>
                    </span>
                    <span v-else>
                        Create NFT
                    </span>
                </button>
            </div>
        </div>

        <div v-else class="flex">
            <div class="relative w-2/5">
                <img :src="nft.metadata?.image" :alt="nft.metadata?.name" class="object-cover w-full h-full rounded-l-2xl border-r border-indigo-500">
                <div class="absolute bottom-4 right-4 rounded px-2 py-1 bg-white/80 backdrop-blur shadow text-xs text-green-700">
                    <span class="font-sans text-green-600 font-bold">✓</span> Minted
                </div>
            </div>
            <div class="flex-1 p-8 space-y-8">
                <div>
                    <label class="text-xs text-indigo-200 uppercase font-medium tracking-widest">Mint address</label>
                    <p v-text="nft.mint"></p>
                </div>
                <div>
                    <label class="text-xs text-indigo-200 uppercase font-medium tracking-widest">Name</label>
                    <p v-text="nft.name"></p>
                </div>
                <div>
                    <label class="text-xs text-indigo-200 uppercase font-medium tracking-widest">Description</label>
                    <p v-text="nft.metadata?.description"></p>
                </div>
                <div>
                    <label class="text-xs text-indigo-200 uppercase font-medium tracking-widest">Collection</label>
                    <p v-text="nft.metadata?.collection?.name"></p>
                </div>
            </div>
        </div>
    </div>
</template>
