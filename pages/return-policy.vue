<template>
  <div class="privacy_policy">
    <div class="container">
      <div class="bread_crumb">
        <svg class="svg-icon" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M19 12L13 18M19 12L13 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <NuxtLink to="/">Back to home</NuxtLink>
      </div>

      <div class="privacy_hero">
        <h1>Return Policy</h1>
  
      </div>

      <div class="privacy_layout">
        <nav class="privacy_toc" aria-label="Table of contents">
          <span class="privacy_toc_label">On this page</span>
          <ul>
            <li v-for="s in sections" :key="s.id">
              <a
                :href="`#${s.id}`"
                :class="{ is_active: activeId === s.id }"
                @click.prevent="scrollToSection(s.id)"
              >
                <span class="toc_number">{{ s.number }}</span>
                <span class="toc_title">{{ s.title }}</span>
              </a>
            </li>
          </ul>
        </nav>

        <div class="privacy_content">
          <section
            v-for="s in sections"
            :id="s.id"
            :key="s.id"
            ref="sectionRefs"
            class="policy_card"
            :data-section-id="s.id"
          >
            <div class="policy_card_head">
              <span class="policy_number">{{ s.number }}</span>
              <h2>{{ s.title }}</h2>
            </div>

            <p v-if="s.intro" class="strong_text">{{ s.intro }}</p>
            <p v-for="(p, i) in s.paragraphs" :key="`p-${i}`" class="main_text">
              {{ p }}
            </p>

            <div
              v-for="(sub, i) in s.subsections"
              :key="`sub-${i}`"
              class="policy_subsection"
            >
              <h3>{{ sub.subtitle }}</h3>
              <p v-if="sub.text" class="main_text">{{ sub.text }}</p>

              <ul v-if="sub.items" class="check_list">
                <li v-for="(item, j) in sub.items" :key="j">
                  <CheckIcon />
                  <span>{{ item }}</span>
                </li>
              </ul>

              <p v-if="sub.note" class="main_text sub_note">{{ sub.note }}</p>
            </div>

            <ul v-if="s.items" class="check_list">
              <li v-for="(item, i) in s.items" :key="i">
                <CheckIcon />
                <span>{{ item }}</span>
              </li>
            </ul>

            <div v-if="s.note" class="callout">{{ s.note }}</div>

            <div v-if="s.id === 'contact'" class="contact_box">
              <div class="contact_box_info">
                <span class="contact_box_label">Email us</span>
                <strong class="contact_box_email">{{ email }}</strong>
              </div>
              <button class="contact_box_btn" @click="copyEmail" type="button">
                <span>{{ copied ? 'Copied' : 'Copy email' }}</span>
                <svg v-if="!copied" viewBox="0 0 24 24" fill="none">
                  <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" stroke-width="1.6"/>
                  <path d="M5 15V6a1 1 0 0 1 1-1h9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </section>

          <div class="privacy_signature">
            <span class="signature_line"></span>
            <strong>
              {{ companyName }} 
            </strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted, onBeforeUnmount, h } from 'vue';

const companyName = 'Mystic Visions LLC';
const effectiveDate = '01.01.2026';
const email = 'mysty.vis@gmail.com';
const copied = ref(false);

const CheckIcon = () =>
  h(
    'svg',
    { class: 'check_icon', viewBox: '0 0 18 18', fill: 'none' },
    [
      h('circle', { cx: 9, cy: 9, r: 9, fill: 'var(--surface-green)' }),
      h('path', {
        d: 'M5.5 9.2l2.3 2.3 4.7-5',
        stroke: 'var(--emerald-green)',
        'stroke-width': 1.7,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      }),
    ]
  );

const sections = [
  {
    id: 'digital-products',
    number: '01',
    title: 'Digital Products',
    intro:
      'Due to the digital nature of our products, all digital product sales are final once access has been granted or content has been delivered.',
      items: [
        'By completing your purchase, you acknowledge that access to the digital product begins immediately and that no refunds, chargebacks, or retroactive cancellations will be issued once access is provided.',
        ' If you experience technical issues accessing a purchased digital product, please contact us and we will make reasonable efforts to resolve the issue. Technical issues do not constitute grounds for a refund once access has been successfully delivered.',
      ]
  },
  {
    id: 'services',
    number: '02',
    title: 'Coaching & Consulting Services',
    intro: 'Coaching and consulting services, where applicable, are non-refundable once the service period has begun or access has been granted.',
    items: [
      'By completing checkout, you acknowledge that:',
      'Services begin immediately or on the agreed start date',
      'All payments are final once services commence',
      'Retroactive cancellations or disputes will not be honored after services begin'
    ],
  },
  {
    id: 'client-responsibility',
    number: '03',
    title: '3. Cancellations & Client Responsibility',
    intro:
      'We may use advertising technologies to measure the effectiveness of advertising campaigns, such as the Meta Pixel.',
    items: [
      'If a cancellation option is available, it is the client’s sole responsibility to manage or submit cancellation requests prior to the start of the service period, in accordance with the terms provided at checkout.',
      'We do not process cancellations or billing changes via phone, text, or social media. Failure to cancel prior to service commencement does not constitute grounds for a refund.'
    ]
  },

   {
    id: 'contact',
    number: '4',
    title: 'Contact Information',
    intro: 'For questions related to access or technical issues only, please contact:',
  },
  {
    id: 'additional-notes',
    number: '05',
    title: 'Additional Notes & Disclaimer',
    intro: 'We use collected information to:',
    items: [
    
      'We do not guarantee specific outcomes or results from the use of our products or services. Results vary based on individual effort, circumstances, and external factors.',
      'By completing your purchase, you confirm that you have reviewed, understood, and agreed to these terms in full.'
    ],
  }
];

const activeId = ref(sections[0].id);
const sectionRefs = ref([]);
let observer;


const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(email);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1800);
  } catch (e) {
    console.error('Copy failed', e);
  }
};

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeId.value = entry.target.id;
      });
    },
    { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
  );
  document.querySelectorAll('.policy_card').forEach((el) => observer.observe(el));
  document.querySelector('main').style.overflow = 'unset';
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
  document.querySelector('main').style.overflow = 'hidden';

});
</script>

<style lang="scss" scoped>
@use "../styles/mixins.scss" as mixins;

.privacy_policy {
  width: 100%;
  min-height: 100dvh;
  background: var(--light-grey);
  @include mixins.page-spacing;
  @include mixins.component-spacing;
}

.container {
  width: clamp(320px, 90vw, 1160px);
  margin: 0 auto;
}

.bread_crumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
  color: var(--text-secondary);
  @include mixins.fz-body($size: var(--text-sm));

  a {
    color: var(--text-secondary);
    transition: color ease 0.25s;
  }

  svg {
    width: 16px;
    height: 16px;
    transform: rotate(180deg);
    transition: transform ease 0.25s;
  }

  @media screen and (min-width: 1024px) {
    &:hover {
      a { color: var(--dark-green); }
      svg { transform: rotate(180deg) translateX(4px); color: var(--dark-green); }
    }
  }
}


.privacy_hero {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
  height: auto;
  margin-bottom: 56px;

  &_eyebrow {
    display: inline-flex;
    align-items: center;
    padding: 6px 16px;
    border-radius: var(--radius-full);
    background: var(--surface-green);
    color: var(--dark-green);
    font-family: var(--font-aeonik);
    font-size: var(--text-xs);
    font-weight: var(--font-bold);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1 {
    font-family: var(--font-playfair);
    font-weight: 500;
    font-size: clamp(2.25rem, 5vw, 3.5rem);
    line-height: 1.1;
    color: var(--dark-green);
    letter-spacing: -0.01em;
  }

  &_intro {
    width: 100%;
    height: auto;
    @include mixins.fz-body-large($color: var(--text-secondary));
  }
}

.effective_badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  @include mixins.fz-body($size: var(--text-sm), $color: var(--text-secondary));
  font-weight: var(--font-bold);

  &_dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--emerald-green);
    box-shadow: 0 0 0 4px var(--surface-green);
  }
}


.privacy_layout {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 48px;
  align-items: start;

  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.privacy_toc {
  position: sticky;
  top: 110px;
  display: flex;
  flex-direction: column;
  background: var(--dark-green);
  gap: 14px;
  padding: 10px;
  border-radius: 15px;

  &_label {
    @include mixins.fz-body($size: var(--text-xs), $color: var(--text-muted));
    font-weight: var(--font-bold);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding-left: 14px;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 2px;
    border-left: 1px solid var(--border-light);
  }

  a {
    display: flex;
    align-items: baseline;
    gap: 10px;
    padding: 8px 14px;
    margin-left: -1px;
    border-left: 2px solid transparent;
    color: var(--text-secondary);
    transition: all ease 0.2s;

    &.is_active {
      border-left-color: var(--emerald-green);
      color: var(--dark-green);

      .toc_number { color: var(--emerald-green); }
    }

    @media screen and (min-width: 1024px) {
      &:hover { color: var(--dark-green); }
    }
  }

  .toc_number {
    @include mixins.fz-body($size: var(--text-xs), $color: var(--text-muted));
    font-weight: var(--font-bold);
    min-width: 18px;
  }

  .toc_title {
    @include mixins.fz-body($size: var(--text-sm));
  }

  @media screen and (max-width: 1024px) {
    display: none;
  }
}

.privacy_content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.policy_card {
  scroll-margin-top: 110px;
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-medium);
  box-shadow: var(--shadow-card);
  padding: 36px;

  @media screen and (max-width: 768px) {
    padding: 24px 20px;
  }

  &_head {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;

    h2 {
      font-family: var(--font-playfair);
      font-weight: 500;
      color: var(--dark-green);
      font-size: clamp(1.25rem, 2.5vw, 1.6rem);
    }
  }
}

.policy_number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  border-radius: var(--radius-small);
  background: var(--dark-green);
  color: var(--soft-white);
  font-family: var(--font-aeonik);
  font-size: var(--text-md);
  font-weight: 500;
  flex-shrink: 0;
}

.strong_text {
  @include mixins.fz-body-large($color: var(--text-primary));
  font-weight: var(--font-bold);
  margin-bottom: 10px;
}

.main_text {
  @include mixins.fz-body($color: var(--text-secondary));
  margin-bottom: 8px;

  &:last-child { margin-bottom: 0; }
}

.sub_note {
  margin-top: 10px;
}

.policy_subsection {
  padding: 20px 0 0 20px;
  margin-top: 8px;
  border-left: 2px solid var(--border-light);

  &:first-of-type { margin-top: 16px; }

  h3 {
    @include mixins.fz-h6($color: var(--dark-green));
    margin-bottom: 8px;
  }

  @media screen and (max-width: 480px) {
    padding-left: 14px;
  }
}

.check_list {
  list-style: none;
  padding: 0;
  margin: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;

  li {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  span {
    @include mixins.fz-body($color: var(--text-primary));
  }
}

.check_icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.callout {
  margin-top: 16px;
  padding: 16px 18px;
  border: 1px solid var(--border-light);
  background: var(--soft-green);
  border-radius: var(--radius-small);
  @include mixins.fz-body($size: var(--text-sm), $color: var(--text-primary));
}

.contact_box {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  background: var(--dark-green);
  border-radius: var(--radius-small);

  @media screen and (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }

  &_label {
    display: block;
    @include mixins.fz-body($size: var(--text-xs), $color: var(--text-muted));
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 4px;
  }

  &_email {
    @include mixins.fz-body-large($color: var(--soft-white));
    font-weight: var(--font-bold);
  }

  &_btn {
    @include mixins.button-outline;
    background: transparent;
    border-color: rgba(249, 249, 249, 0.3);
    color: var(--soft-white);
    flex-shrink: 0;

    svg { width: 16px; height: 16px; }

    @media screen and (min-width: 1024px) {
      &:hover {
        background: var(--emerald-green);
        border-color: var(--emerald-green);
        color: var(--dark-green);
      }
    }

    @media screen and (max-width: 480px) {
      width: 100%;
      justify-content: center;
    }
  }
}

.privacy_signature {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-top: 40px;
  padding-top: 40px;

  .signature_line {
    width: 48px;
    height: 2px;
    background: var(--emerald-green);
    border-radius: var(--radius-full);
  }

  strong {
    font-family: var(--font-playfair);
    font-size: var(--text-lg);
    color: var(--dark-green);
  }
}
</style>