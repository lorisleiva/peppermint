<script setup lang="ts">
import { WalletMultiButton } from 'solana-wallets-vue';
import CreateNft from './components/CreateNft.vue';
</script>

<template>
    <div class="bg-cover bg-center bg-[url('/gradient.jpg')] font-mono">
        <div class="absolute top-0 right-0 m-8">
            <wallet-multi-button dark></wallet-multi-button>
        </div>
        <div class="flex h-screen w-screen">
            <div class="m-auto w-full max-w-3xl">
                <create-nft></create-nft>
            </div>
        </div>
    </div>
</template>
