<script setup lang="ts">
import { Metaplex, WalletAdapterIdentityDriver, GuestIdentityDriver, NftClient } from '@metaplex/js-next';
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

const onCreateNft = async () => {
    const nfts = new NftClient(metaplex.value);
    const nft = await nfts.createNft({
        name: 'Mx Test Solflake',
        uri: 'https://arweave.net/b86yUxzuaJCH9NgivDPnpiW1LdSFOmesNV6hXO1JFrM',
    });
    console.log(nft);
}
</script>

<template>
    <div>
        <button @click="onCreateNft">Create NFT</button>
    </div>
</template>
