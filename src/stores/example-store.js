import { defineStore, acceptHMRUpdate } from 'pinia'

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    connectedWallets: [],
    activeWalletId: null,
    balance: 0,
    transactions: []
  }),

  getters: {
    activeWallet: (state) => state.connectedWallets.find(w => w.id === state.activeWalletId),
    totalBalance: (state) => state.connectedWallets.reduce((sum, wallet) => sum + wallet.balance, 0)
  },

  actions: {
    addWallet(wallet) {
      this.connectedWallets.push(wallet)
      if (!this.activeWalletId) {
        this.activeWalletId = wallet.id
      }
    },
    removeWallet(walletId) {
      this.connectedWallets = this.connectedWallets.filter(w => w.id !== walletId)
      if (this.activeWalletId === walletId) {
        this.activeWalletId = this.connectedWallets[0]?.id || null
      }
    },
    setActiveWallet(walletId) {
      this.activeWalletId = walletId
    },
    updateBalance(balance) {
      this.balance = balance
    },
    updateTransactions(transactions) {
      this.transactions = transactions
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWalletStore, import.meta.hot))
}
