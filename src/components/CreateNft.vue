<script setup lang="ts">
import { computed, ref } from 'vue';
import { Metaplex, WalletAdapterIdentityDriver, GuestIdentityDriver } from '@metaplex/js-next';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import { useWallet } from 'solana-wallets-vue';

// Initialize workspace.
const { wallet } = useWallet();
const connection = new Connection(clusterApiUrl('devnet'));
const metaplex = computed(() => {
    const mx = Metaplex.make(connection);
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
    const buffer = await image.value.arrayBuffer();
    console.log(image.value, imageSrc.value, buffer);
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
    <div>
        <div class="relative border-2 border-gray-300 border-dashed rounded-md px-6 pt-5 pb-6">
            <div class="flex justify-center">
                <div class="space-y-1 text-center">
                    <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <div class="flex text-sm text-gray-600">
                        <span class="bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            Upload an image
                        </span>
                        <p class="pl-1">or drag and drop</p>
                    </div>
                    <p class="text-xs text-gray-500">PNG, JPG, GIF, etc.</p>
                </div>
            </div>
            <input type="file" @change="onFileChange" class="absolute inset-0 z-50 m-0 p-0 w-full h-full outline-none opacity-0 cursor-pointer">
        </div>
        <img v-if="imageSrc" :src="imageSrc" alt="Image to upload as an NFT">
        <button @click="onCreateNft">Create NFT</button>
    </div>
</template>
