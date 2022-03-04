<script setup lang="ts">
import { WalletMultiButton } from 'solana-wallets-vue';
import CreateNft from './components/CreateNft.vue';
</script>

<template>
    <div>
        <div class="absolute top-0 right-0 m-8">
            <wallet-multi-button></wallet-multi-button>
        </div>
        <div class="flex h-screen">
            <div class="m-auto">
                <create-nft></create-nft>
            </div>
        </div>
    </div>
</template>
