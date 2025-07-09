<template>
  <q-page class="q-pa-md">
    <q-btn flat icon="las la-arrow-left" label="Back" @click="$router.back()" class="q-mb-md" />
    <q-card v-if="loading" class="q-mt-md">
      <q-card-section>
        <q-spinner-dots size="md" /> Loading invoice details...
      </q-card-section>
    </q-card>
    <q-card v-else class="q-mt-md">
      <q-card-section>
        <div class="text-h6">Invoice Details</div>
        <div class="q-mt-sm">
          <div><b>Status:</b> <span :class="statusColor">{{ details.status }}</span></div>
          <div><b>Amount:</b> {{ details.amount }} sats</div>
          <div><b>Description:</b> {{ details.description }}</div>
          <div><b>Date:</b> {{ formatDate(details.settled_at) }}</div>
          <div><b>Destination:</b> {{ details.destination }}</div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="text-subtitle2 q-mb-xs">Raw Invoice</div>
        <q-input v-model="details.rawInvoice" type="textarea" readonly autogrow />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
// Assume LN or nwc utils are globally available or import as needed

export default {
  name: 'TransactionDetails',
  setup() {
    const route = useRoute();
    const loading = ref(true);
    const details = ref({
      status: '',
      amount: '',
      description: '',
      settled_at: '',
      destination: '',
      rawInvoice: '',
    });

    function formatDate(ts) {
      if (!ts) return '';
      const d = new Date(ts * 1000);
      return d.toLocaleString();
    }

    const statusColor = computed(() => {
      if (details.value.status === 'paid') return 'text-green-8';
      if (details.value.status === 'unpaid') return 'text-orange-8';
      return 'text-grey-7';
    });

    async function fetchDetails() {
      loading.value = true;
      try {
        // Get transaction from local state or fetch from backend if needed
        // For now, try to get from localStorage (Wallet.vue keeps transactions in local state)
        const txId = route.params.id;
        let tx = null;
        const walletState = JSON.parse(localStorage.getItem('buhoGO_wallet_state'));
        if (walletState && walletState.transactions) {
          tx = walletState.transactions.find(t => t.id == txId);
        }
        // If not found, fallback to window.transactions (if set by Wallet.vue)
        if (!tx && window.transactions) {
          tx = window.transactions.find(t => t.id == txId);
        }
        if (!tx) {
          details.value.description = 'Transaction not found.';
          loading.value = false;
          return;
        }
        // Lookup invoice using SDK (simulate for now)
        let invoiceData = {};
        if (tx.payment_request) {
          // Use SDK to decode invoice
          try {
            const nwcString = walletState.connectedWallets.find(w => w.id === walletState.activeWalletId).nwcString;
            const nwc = new window.webln.NostrWebLNProvider({ nostrWalletConnectUrl: nwcString });
            await nwc.enable();
            invoiceData = await nwc.decodeInvoice(tx.payment_request);
          } catch (e) {
            invoiceData = {};
          }
        }
        details.value = {
          status: tx.status || (tx.settled ? 'paid' : 'unpaid'),
          amount: tx.amount || invoiceData.amount || '',
          description: tx.description || invoiceData.description || '',
          settled_at: tx.settled_at || tx.timestamp || '',
          destination: invoiceData.destination || '',
          rawInvoice: tx.payment_request || '',
        };
      } finally {
        loading.value = false;
      }
    }

    onMounted(fetchDetails);

    return { loading, details, formatDate, statusColor };
  },
};
</script>

<style scoped>
.text-green-8 { color: #22c55e; }
.text-orange-8 { color: #f59e42; }
.text-grey-7 { color: #6b7280; }
</style> 