<template>
  <div class="privacy_policy">
    <div class="container">
      <div class="bread_crumb">
        <svg class="svg-icon" viewBox="0 0 24 24" fill="none">
          <path
            d="M19 12H5M19 12L13 18M19 12L13 6"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <NuxtLink to="/">Back to home</NuxtLink>
      </div>

      <div class="privacy_hero">
        <h1>Privacy Policy</h1>
        <span class="effective_badge">
          <i class="effective_badge_dot"></i>
          Effective {{ effectiveDate }}
        </span>
        <p class="privacy_hero_intro">
          {{ companyName }} ("we", "us", or "our") operates this website and
          related services. This Privacy Policy explains how we collect, use,
          and disclose information when you visit our website, purchase our
          products, or interact with our advertising and marketing. By using our
          website, you agree to the practices described below.
        </p>
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
                <span>{{ copied ? "Copied" : "Copy email" }}</span>
                <svg v-if="!copied" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="9"
                    y="9"
                    width="11"
                    height="11"
                    rx="2"
                    stroke="currentColor"
                    stroke-width="1.6"
                  />
                  <path
                    d="M5 15V6a1 1 0 0 1 1-1h9"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                  />
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
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
import { ref, onMounted, onBeforeUnmount, h } from "vue";

const companyName = "Mystic Visions LLC";
const effectiveDate = "01.01.2026";
const email = "mysty.vis@gmail.com";
const copied = ref(false);

const CheckIcon = () =>
  h("svg", { class: "check_icon", viewBox: "0 0 18 18", fill: "none" }, [
    h("circle", { cx: 9, cy: 9, r: 9, fill: "var(--surface-green)" }),
    h("path", {
      d: "M5.5 9.2l2.3 2.3 4.7-5",
      stroke: "var(--emerald-green)",
      "stroke-width": 1.7,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    }),
  ]);

const sections = [
  {
    id: "information-we-collect",
    number: "01",
    title: "Information We Collect",
    intro:
      "We collect limited information necessary to operate our website, process purchases, and analyze the effectiveness of our advertising.",
    subsections: [
      {
        subtitle: "1.1 Information You Provide",
        text: "When you make a purchase or interact with our services, you may provide information such as:",
        items: [
          "Name",
          "Email address",
          "Shipping address",
          "Billing information",
          "Purchase details",
        ],
        note: "Payments are processed through Shopify and payment providers. We do not store your full payment card details.",
      },
      {
        subtitle: "1.2 Automatically Collected Information",
        text: "When you visit our website, certain technical information may be collected automatically, including:",
        items: [
          "IP address",
          "Browser type",
          "Device type",
          "Referring website",
          "Pages visited",
          "Timestamps of visits",
          "URL parameters such as campaign identifiers",
        ],
        note: "This information is used for operational analytics and website security.",
      },
      {
        subtitle: "1.3 Advertising and Attribution Data",
        text: "When you arrive at our website through an advertisement, we may collect information about:",
        items: [
          "Which platform referred you (Facebook, Instagram, YouTube)",
          "Which advertisement or campaign generated the visit",
          "Which pages were viewed before checkout",
        ],
        note: "This information helps us understand which advertising campaigns are effective.",
      },
    ],
  },
  {
    id: "analytics-and-tracking",
    number: "02",
    title: "Analytics and Tracking",
    intro:
      "We use limited analytics methods to understand how our website is used.",
    items: [
      "Page visit counts",
      "Referral sources",
      "Campaign attribution via URL parameters",
      "Checkout click events",
      "Aggregated purchase statistics",
    ],
  },
  {
    id: "advertising-technologies",
    number: "03",
    title: "Advertising Technologies",
    intro:
      "We may use advertising technologies to measure the effectiveness of advertising campaigns, such as the Meta Pixel.",
  },
  {
    id: "cookies",
    number: "04",
    title: "Cookies and Similar Technologies",
    items: [
      "Basic website functionality",
      "Analytics",
      "Advertising attribution",
    ],
  },
  {
    id: "how-we-use-information",
    number: "05",
    title: "How We Use Information",
    intro: "We use collected information to:",
    items: [
      "Operate and maintain the website",
      "Process purchases and deliver products",
      "Analyze traffic sources and campaign performance",
      "Improve website content and functionality",
      "Detect security incidents and prevent fraud",
    ],
    note: "We do not use personal information to infer sensitive characteristics such as age, race, religion, or health.",
  },
  {
    id: "sharing-of-information",
    number: "06",
    title: "Sharing of Information",
    intro: "We do not sell personal information.",
    paragraphs: [
      "However, we may share limited information with service providers necessary to operate our business, including:",
    ],
    items: [
      "Shopify (e-commerce platform)",
      "Payment processors",
      "Advertising platforms",
    ],
    note: "These service providers process information only as necessary to provide their services.",
  },
  {
    id: "data-retention",
    number: "07",
    title: "Data Retention",
    intro: "We retain information only as long as necessary to:",
    items: [
      "Provide our services",
      "Maintain transaction records",
      "Analyze website performance",
      "Comply with legal obligations",
    ],
    note: "Aggregated or anonymized analytics data may be retained for longer periods.",
  },
  {
    id: "privacy-rights",
    number: "08",
    title: "Your Privacy Rights",
    intro:
      "Depending on your jurisdiction, you may have rights regarding your personal information. These may include the right to:",
    items: [
      "Request access to personal information we hold about you",
      "Request deletion of personal information",
      "Request correction of inaccurate information",
      "Opt out of certain types of data processing related to advertising",
    ],
    note: "To exercise these rights, you may contact us using the contact information below.",
  },
  {
    id: "security",
    number: "09",
    title: "Security",
    paragraphs: [
      "We take reasonable measures to protect information from unauthorized access, disclosure, or misuse.",
      "However, no internet transmission or electronic storage system is completely secure.",
    ],
  },
  {
    id: "changes",
    number: "10",
    title: "Changes to This Policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time.",
      "Updates will be posted on this page with a revised effective date.",
    ],
  },
  {
    id: "contact",
    number: "11",
    title: "Contact Information",
    intro:
      "If you have questions regarding this Privacy Policy, you may contact us at:",
  },
];

const activeId = ref(sections[0].id);
const sectionRefs = ref([]);
let observer;

const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(email);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1800);
  } catch (e) {
    console.error("Copy failed", e);
  }
};

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeId.value = entry.target.id;
      });
    },
    { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
  );
  document
    .querySelectorAll(".policy_card")
    .forEach((el) => observer.observe(el));
  document.querySelector("main").style.overflow = "unset";
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
  document.querySelector("main").style.overflow = "hidden";
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
      a {
        color: var(--dark-green);
      }
      svg {
        transform: rotate(180deg) translateX(4px);
        color: var(--dark-green);
      }
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

      .toc_number {
        color: var(--emerald-green);
      }
    }

    @media screen and (min-width: 1024px) {
      &:hover {
        color: var(--dark-green);
      }
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

  &:last-child {
    margin-bottom: 0;
  }
}

.sub_note {
  margin-top: 10px;
}

.policy_subsection {
  padding: 20px 0 0 20px;
  margin-top: 8px;
  border-left: 2px solid var(--border-light);

  &:first-of-type {
    margin-top: 16px;
  }

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

    svg {
      width: 16px;
      height: 16px;
    }

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
