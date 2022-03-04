<script setup lang="ts">
import { Metaplex, WalletAdapterIdentityDriver, GuestIdentityDriver } from '@metaplex/js-next';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import { useWallet } from 'solana-wallets-vue';
import { computed } from 'vue';

const { wallet } = useWallet();
const connection = new Connection(clusterApiUrl('devnet'));
const metaplex = computed(() => {
    const mx = Metaplex.make(connection);
    const identity = wallet.value
        ? new WalletAdapterIdentityDriver(mx, wallet.value)
        : new GuestIdentityDriver(mx);

    return mx.setIdentity(identity);
});
</script>

<template>
    <div>
        Create NFT
    </div>
</template>
