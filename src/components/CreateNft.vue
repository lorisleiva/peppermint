<script setup lang="ts">
import { computed, Ref, ref } from 'vue';
import { Metaplex, MetaplexFile, bundlrStorage, Nft, walletAdapterIdentity, toMetaplexFileFromBrowser, formatAmount, Task, NftWithToken } from '@metaplex-foundation/js';
import { useAnchorWallet } from 'solana-wallets-vue';
import { Connection, PublicKey } from '@solana/web3.js';
import UiPlan from './UiPlan.vue';

// Initialize workspace.
const connection = new Connection('https://metaplex.devnet.rpcpool.com');
const wallet = useAnchorWallet();
const metaplex = computed(() => {
    const mx = Metaplex.make(connection)
        .use(bundlrStorage({
            address: 'https://devnet.bundlr.network',
            timeout: 60000,
        }));
    if (wallet.value) mx.use(walletAdapterIdentity(wallet.value));
    return mx;
});

// Inputs.
const name = ref<string>('');
const description = ref<string>('');
const collection = ref<string>('');

// Select image.
const image = ref<MetaplexFile>();
const imageSrc = ref<string>();
const imagePrice = ref<string>();
const onFileChange = async (event: Event) => {
    const files = (event.target as HTMLInputElement).files
        || (event as InputEvent).dataTransfer?.files;
    if (!files?.length) return;
    image.value = await toMetaplexFileFromBrowser(files[0]);
    imageSrc.value = URL.createObjectURL(files[0]);
    const price = await metaplex.value.storage().getUploadPriceForFile(image.value);
    imagePrice.value = formatAmount(price);
    name.value = image.value.displayName;
};

// Upload image and create NFT.
const nft = ref<Nft | null>(null);
const task: Ref<Task<Nft> | null> = ref(null);
const onCreateNft = async () => {
    if (!image.value || task.value) return;

    const uploadTask = new Task(async () => {
        const { uri } = await metaplex.value.nfts().uploadMetadata({
            name: name.value,
            description: description.value,
            image: image.value,
            collection: {
                name: collection.value,
                family: collection.value,
            },
        });
        return uri;
    });
    uploadTask.setContext({ name: 'Upload Assets' });

    const createTask = new Task<NftWithToken, [string]>(async (scope, uri) => {
        const { nft } = await metaplex.value.nfts().create({
            uri,
            name: name.value,
            sellerFeeBasisPoints: 0,
        });
        return nft;
    });
    createTask.setContext({ name: 'Create NFT' });

    task.value = new Task(async (scope) => {
        const uri = await uploadTask.run(scope);
        return createTask.run(scope, uri);
    }, [uploadTask, createTask]);

    nft.value = await task.value.run();
}

// Reset.
const reset = () => {
    image.value = undefined;
    imageSrc.value = undefined;
    imagePrice.value = undefined;
    name.value = '';
    description.value = '';
    collection.value = '';
    nft.value = null;
    task.value = null;
}
</script>

<template>
    <div
        class="group bg-black/40 border border-indigo-600 shadow-xl shadow-indigo-700/30 backdrop-blur rounded-2xl text-indigo-100"
        :class="imageSrc ? '' : 'hover:border-pink-600'"
    >
        <!-- Step 1: Upload an image. -->
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

        <!-- Step 2: Fill details. -->
        <div v-else-if="!nft" class="flex">
            <div class="relative w-2/5">
                <img :src="imageSrc" alt="Image to upload as an NFT" class="object-cover w-full h-full rounded-l-2xl border-r border-indigo-500">
                <div class="absolute bottom-4 right-4 rounded px-2 py-1 bg-white/80 backdrop-blur shadow text-xs text-black">
                    <span class="font-sans">◎</span> {{ imagePrice }}
                </div>
            </div>
            <div v-if="!task" class="flex-1 p-8 space-y-8">
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
                <button @click="onCreateNft" :disabled="!!task" class="block w-full px-4 py-2 text-center text-semibold bg-gradient-to-br from-indigo-700 to-blue-600 rounded border-b-2 border-transparent focus:outline-none focus:border-white hover:border-white hover:text-white">
                    Create NFT
                </button>
            </div>
            <div v-else class="flex-1 p-8">
                <div v-if="!task.isFailed()">
                    <h1 class="text-xl text-gray-300 mb-4">
                        Minting in process...
                    </h1>
                    <p class="text-sm text-gray-300 font-sans">
                        Your wallet will ask you to approve a series of transaction.
                        You will need to review and approve each one.
                    </p>
                </div>
                <div v-else>
                    <h1 class="text-xl text-gray-300 mb-4">
                        Minting failed
                    </h1>
                    <p class="text-sm text-gray-300 font-sans mb-4">
                        Something went wrong while minting your NFT.
                    </p>
                    <button @click="task = null" class="block w-full px-4 py-2 text-center text-semibold bg-gradient-to-br from-indigo-700 to-blue-600 rounded border-b-2 border-transparent focus:outline-none focus:border-white hover:border-white hover:text-white">
                        Try again
                    </button>
                </div>
                <ui-plan class="mt-8" :task="task"></ui-plan>
            </div>
        </div>

        <!-- Step 4: Minting was successful. -->
        <div v-else class="flex">
            <div class="relative w-2/5">
                <img :src="nft.json?.image" :alt="nft.json?.name" class="object-cover w-full h-full rounded-l-2xl border-r border-indigo-500">
                <div class="absolute bottom-4 right-4 rounded px-2 py-1 bg-white/80 backdrop-blur shadow text-xs text-green-700">
                    <span class="font-sans text-green-600 font-bold">✓</span> Minted
                </div>
            </div>
            <div class="flex-1 p-8 space-y-8">
                <div>
                    <h1 class="text-xl text-gray-300 mb-4">
                        Minting successful
                    </h1>
                    <p class="text-sm text-gray-300 font-sans">
                        Your NFT was successfully minted! You can now view it in your wallet.
                    </p>
                </div>
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
                    <p v-text="nft.json?.description"></p>
                </div>
                <div>
                    <label class="text-xs text-indigo-200 uppercase font-medium tracking-widest">Collection</label>
                    <p v-text="nft.json?.collection?.name"></p>
                </div>
                <button @click="reset" class="block w-full px-4 py-2 text-center text-semibold bg-gradient-to-br from-indigo-700 to-blue-600 rounded border-b-2 border-transparent focus:outline-none focus:border-white hover:border-white hover:text-white">
                    Mint another NFT
                </button>
            </div>
        </div>
    </div>
</template>
