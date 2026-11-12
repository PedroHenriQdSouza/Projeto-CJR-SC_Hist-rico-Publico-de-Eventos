<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { cover, safeImage, safeLink } from '../services/content'
import type { RecordEntry } from '../types/content'

const props = defineProps<{ partners: RecordEntry[] }>()
const track = ref<HTMLElement>()
const paused = ref(false)
const items = computed(() => props.partners.map(partner => {
  const logo = cover(partner)
  return { partner, logo: safeImage(logo?.src ?? ''), link: safeLink(partner.url), exampleLogo: logo?.id === 'demo-logo-axologic' }
}))
const slides = computed(() => {
  const logos = items.value.map(item => ({ ...item, key: item.partner.id, duplicate: false }))
  if (logos.length !== 1 || !logos[0].exampleLogo) return logos
  const [example] = logos
  return [example, ...[1, 2].map(index => ({ ...example, key: example.key + '-' + index, duplicate: true }))]
})
const hasRealPartner = computed(() => props.partners.some(partner => !partner.demo))
let timer: number | undefined

onMounted(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  timer = window.setInterval(() => {
    const carousel = track.value
    if (!carousel || paused.value || reducedMotion.matches || carousel.matches(':hover, :focus-within')) return
    const maxScroll = carousel.scrollWidth - carousel.clientWidth
    if (maxScroll <= 1) return
    const next = [...carousel.children].find(child => (child as HTMLElement).offsetLeft > carousel.scrollLeft + 2) as HTMLElement | undefined
    carousel.scrollTo({ left: carousel.scrollLeft >= maxScroll - 2 ? 0 : next?.offsetLeft ?? maxScroll, behavior: 'smooth' })
  }, 3200)
})
onUnmounted(() => window.clearInterval(timer))
</script>

<template>
  <section class="partners section-space" aria-labelledby="partners-title">
    <div class="site-container partners-layout">
      <div class="partners-heading">
        <h2 id="partners-title">Nossos parceiros</h2>
        <p v-if="hasRealPartner">Agradecemos às organizações que apoiam o campeonato.</p>
        <p v-else-if="items.length">Vitrine de demonstração para as logos dos parceiros.</p>
        <p v-else>A relação de parceiros será exibida quando houver registros publicados.</p>
      </div>
      <ul v-if="items.length" id="partner-logos" ref="track" class="partner-track" :class="{ 'partner-track-paused': paused, 'partner-track-example': slides.length > items.length }" aria-label="Logos dos parceiros" tabindex="0">
        <li v-for="{ partner, logo, link, exampleLogo, key, duplicate } in slides" :key="key" :aria-hidden="duplicate || undefined">
          <component :is="link && !duplicate ? 'a' : 'div'" :href="!duplicate && link ? link : undefined" class="partner-item">
            <span class="partner-circle" :class="{ 'partner-circle-example': exampleLogo }">
              <img v-if="logo" :src="logo" alt="" loading="lazy">
              <i v-else class="bi bi-buildings" aria-hidden="true"></i>
            </span>
            <strong>{{ partner.title }}</strong>
            <small v-if="partner.demo && !exampleLogo">Demonstração</small>
            <p v-if="partner.description && !exampleLogo">{{ partner.description }}</p>
          </component>
        </li>
      </ul>
      <button v-if="items.length" type="button" class="btn button-light partner-motion" aria-controls="partner-logos" @click="paused = !paused">
        <i :class="paused ? 'bi bi-play-fill' : 'bi bi-pause-fill'" aria-hidden="true"></i>
        {{ paused ? 'Retomar movimento' : 'Pausar movimento' }}
      </button>
    </div>
  </section>
</template>
