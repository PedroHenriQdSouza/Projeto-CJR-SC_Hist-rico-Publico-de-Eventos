<script setup lang="ts">
import { computed } from 'vue'
import Hero from '../components/Hero.vue'
import Timeline from '../components/Timeline.vue'
import ContentCard from '../components/ContentCard.vue'
import { useCatalog } from '../stores/catalog'
import { cover, safeImage, safeLink } from '../services/content'
const catalog = useCatalog()
const news = computed(() => catalog.published('noticias').sort((a, b) => (b.date || b.createdAt).localeCompare(a.date || a.createdAt)).slice(0, 3))
const shortcuts = [
  { label: 'Acervo histórico', description: 'Edições e marcos do campeonato', icon: 'clock-history', to: '/edicoes' },
  { label: 'Temas do campeonato', description: 'Desafios que guiam os projetos', icon: 'lightbulb', to: '/temas' },
  { label: 'Categorias', description: 'Modalidades da competição', icon: 'grid', to: '/categorias' },
  { label: 'Editais', description: 'Documentos e orientações', icon: 'file-earmark-text', to: '/editais' },
]
</script>

<template>
  <Hero />
  <section class="site-container quick-links" aria-label="Acessos rápidos">
    <RouterLink v-for="link in shortcuts" :key="link.to" :to="link.to"><span class="quick-icon"><i :class="'bi bi-' + link.icon"></i></span><span><strong>{{ link.label }}</strong><small>{{ link.description }}</small></span><i class="bi bi-arrow-up-right ms-auto"></i></RouterLink>
  </section>
  <section id="historia" class="site-container history section-space">
    <figure><img src="/images/arena-cjr.webp" alt="Dois robôs em uma arena hexagonal com balões" loading="lazy"><figcaption>Arena de robótica · Apresentação do CJR, slide 16</figcaption></figure>
    <div><div class="eyebrow"><i class="bi bi-book"></i> Memória do campeonato</div><h2>Nossa história</h2>
      <p>A robótica ganhou espaço na Rede Municipal de Joinville em 2017, com a participação na FIRST LEGO League Challenge e a criação dos primeiros clubes. Em 2021, 28 estudantes de sete equipes participaram da primeira edição do CJR.</p>
      <p class="source">Fonte: Apresentação do CJR 2026, slides 2 e 3.</p>
      <RouterLink to="/#linha-do-tempo" class="btn button-dark">Percorrer a linha do tempo <i class="bi bi-arrow-right"></i></RouterLink>
    </div>
  </section>
  <section id="linha-do-tempo" class="timeline-section section-space"><div class="site-container"><div class="eyebrow"><i class="bi bi-clock-history"></i> Acervo histórico</div><h2>Linha do tempo</h2><p class="timeline-intro">Dos primeiros clubes às edições do campeonato, acompanhe a trajetória da robótica na rede municipal.</p><Timeline /></div></section>
  <section class="site-container section-space"><div class="d-flex align-items-end justify-content-between flex-wrap gap-3 mb-4"><h2 class="mb-0">Notícias e atualizações</h2><RouterLink to="/noticias">Todas as notícias <i class="bi bi-arrow-right"></i></RouterLink></div>
    <div v-if="news.length" class="card-grid"><ContentCard v-for="item in news" :key="item.id" :item="item" section="noticias" /></div><p v-else>Ainda não há notícias publicadas.</p>
  </section>
  <section class="partners section-space"><div class="site-container"><h2>Nossos parceiros</h2>
    <template v-if="catalog.published('parceiros').length"><p>Agradecemos às organizações que apoiam o campeonato.</p>
      <ul class="partner-list"><li v-for="item in catalog.published('parceiros')" :key="item.id">
        <img v-if="cover(item) && safeImage(cover(item)!.src)" :src="safeImage(cover(item)!.src)" :alt="cover(item)!.alt" loading="lazy">
        <a v-if="safeLink(item.url)" :href="safeLink(item.url)">{{ item.title }}</a><strong v-else>{{ item.title }}</strong><small v-if="item.demo">Demonstração</small>
        <p v-if="item.description" class="mb-0" style="max-width: 34ch">{{ item.description }}</p>
      </li></ul>
    </template><p v-else>A relação de parceiros será exibida quando houver registros publicados.</p>
  </div></section>
</template>
