import { createApp } from 'vue'
import App from './App.vue'
import './main.css'

// Buffer
import { Buffer } from 'buffer';
window.Buffer = Buffer;

// Wallet Adapters.
import SolanaWallets from 'solana-wallets-vue';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import 'solana-wallets-vue/styles.css';
const walletOptions = {
  wallets: [new PhantomWalletAdapter()],
  autoConnect: true,
};

createApp(App)
    .use(SolanaWallets, walletOptions)
    .mount('#app');
