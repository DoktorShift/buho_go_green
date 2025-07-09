<template>
  <q-item
    clickable
    @click="handleClick"
    :disable="disabled"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
      <q-item-label v-if="disabled" caption class="text-grey-5">Coming soon</q-item-label>
    </q-item-section>
    
    <q-item-section side v-if="external">
      <q-icon name="las la-external-link-alt" size="xs" />
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: ''
    },

    icon: {
      type: String,
      default: ''
    },

    disabled: {
      type: Boolean,
      default: false
    },

    external: {
      type: Boolean,
      default: false
    },

    action: {
      type: String,
      default: 'navigate' // 'navigate', 'modal', 'external'
    }
  },

  methods: {
    handleClick() {
      if (this.disabled) return

      switch (this.action) {
        case 'external':
          if (this.link && this.link !== '#') {
            window.open(this.link, '_blank', 'noopener,noreferrer')
          }
          break
        case 'modal':
          this.$emit('modal-trigger', this.link)
          break
        case 'navigate':
        default:
          if (this.link && this.link !== '#' && this.link !== '') {
            this.$router.push(this.link)
          }
          break
      }
    }
  }
})
</script>
