<script setup lang="ts">
const steps = [
  { title: 'Explorar e Pesquisar', description: 'A equipe investiga o tema do ano e identifica um problema real que pode resolver.', image: 'robo-lego.webp', alt: 'Robô educacional sobre uma pista' },
  { title: 'Criar e Projetar', description: 'As ideias viram desenhos, escolhas de materiais e um primeiro protótipo físico.', image: 'prototipo-com-rodas.webp', alt: 'Detalhe de um protótipo com rodas e componentes eletrônicos' },
  { title: 'Programar e Testar', description: 'A equipe desenvolve o código, testa o robô na pista e ajusta o projeto a cada tentativa.', image: 'arena-cjr.webp', alt: 'Dois robôs em uma arena de testes' },
  { title: 'Defender e Celebrar', description: 'No dia do campeonato, os estudantes apresentam o projeto à banca e compartilham o que aprenderam com a comunidade.', image: 'robo-na-arena.webp', alt: 'Robô bípede em uma arena' },
]
</script>

<template>
  <ol class="history-route journey-steps">
    <li v-for="(step, index) in steps" :key="step.title" class="history-stop">
      <svg class="history-connector" viewBox="0 0 440 240" preserveAspectRatio="none" aria-hidden="true">
        <path d="M 0 0 C 0 85 440 155 440 240" vector-effect="non-scaling-stroke" />
      </svg>
      <div class="history-visual">
        <span class="history-spark" aria-hidden="true">✦</span>
        <span class="history-medallion">
          <img :src="'/images/' + step.image" :alt="step.alt" loading="lazy">
        </span>
      </div>
      <article class="history-stop-copy">
        <p class="history-year" :aria-label="'Etapa ' + (index + 1)">{{ String(index + 1).padStart(2, '0') }}</p>
        <h3>{{ step.title }}</h3>
        <p>{{ step.description }}</p>
      </article>
    </li>
  </ol>
</template>
