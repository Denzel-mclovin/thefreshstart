<template>
  <section class="faq">
    <div class="conntainer">
      <div class="faq_content">
        <h1 class="faq_content_heading">FAQ</h1>

        <div class="faq_content_inner">
          <div class="unique_question">
            <div class="unique_question_head">
              <h3 class="unique_question_title">Still have a question?</h3>
              <p class="unique_question_text">
                Can’t find the answer to your question? Send us an email and
                we’ll back to you as soon as possible!
              </p>
            </div>

            <div class="input_field">
              <div class="input_placeholder" v-show="placeholderVisible">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <g clip-path="url(#clip0_527_175)">
                    <path
                      d="M10.6683 1.80417L15.3142 3.795C15.7142 3.96667 16.0333 4.28584 16.2058 4.68667L18.1958 9.33167C18.3792 9.75834 18.3792 10.2417 18.1958 10.6683L16.205 15.3142C16.0333 15.7142 15.7142 16.0333 15.3133 16.2058L10.6683 18.1958C10.2417 18.3792 9.75834 18.3792 9.33167 18.1958L4.68584 16.205C4.2851 16.0334 3.9658 15.7141 3.79417 15.3133L1.80417 10.6683C1.71366 10.4571 1.66699 10.2298 1.66699 10C1.66699 9.77023 1.71366 9.54286 1.80417 9.33167L3.795 4.68584C3.96667 4.28584 4.28584 3.96667 4.68667 3.79417L9.33167 1.80417C9.54286 1.71366 9.77023 1.66699 10 1.66699C10.2298 1.66699 10.4571 1.71366 10.6683 1.80417Z"
                      stroke="#003323"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M10 13.3335V13.3418"
                      stroke="#003323"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M10 10.8331C10.3748 10.8343 10.739 10.709 11.0339 10.4777C11.3287 10.2463 11.537 9.9223 11.625 9.55799C11.7131 9.19369 11.6758 8.81034 11.5191 8.46985C11.3625 8.12937 11.0956 7.85162 10.7617 7.68147C10.4301 7.51165 10.0509 7.45899 9.68567 7.53207C9.32043 7.60515 8.99066 7.79966 8.75 8.08397"
                      stroke="#003323"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_527_175">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span>Type a question</span>
              </div>
              <input
                type="text"
                id="question"
                v-model="questionInput"
                @focus="placeholderVisible = false"
                @blur="
                  questionInput.length > 0
                    ? (placeholderVisible = false)
                    : (placeholderVisible = true)
                "
              />

              <button 
                class="send_button"
                @click="sendQuestionHandler"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <g clip-path="url(#clip0_527_170)">
                    <path
                      d="M4.69805 4.03397L21.0001 12L4.69805 19.966C4.605 20.0017 4.50342 20.009 4.4062 19.987C4.30899 19.9649 4.22053 19.9144 4.15205 19.842C4.08157 19.7676 4.03304 19.6752 4.01186 19.5749C3.99068 19.4747 3.99767 19.3705 4.03205 19.274L6.50005 12L4.03205 4.72597C3.99767 4.62944 3.99068 4.52528 4.01186 4.42503C4.03304 4.32478 4.08157 4.23234 4.15205 4.15797C4.22053 4.08552 4.30899 4.03506 4.4062 4.01298C4.50342 3.9909 4.605 3.99821 4.69805 4.03397Z"
                      stroke="white"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M6.5 12H21"
                      stroke="white"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_527_170">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
          </div>

          <ul class="question_list">
            <li
              class="question_list_item"
              v-for="(item, index) in questionData"
              @click="toggleQuestionVisible(item.id, index)"
              :style="{ gap: activeQuestion === item.id ? '16px' : '0' }"
              :key="item.id"
            >
              <div class="item_heading">
                <h5>
                  {{ item.q }}
                </h5>

                <div
                  class="arrow_el"
                  :class="{ arrow_el_active: activeQuestion === item.id }"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <g clip-path="url(#clip0_527_197)">
                      <path
                        d="M18 9L12 15L6 9"
                        stroke="#003323"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_527_197">
                        <rect
                          width="24"
                          height="24"
                          fill="white"
                          transform="matrix(-1 0 0 -1 24 24)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </div>

              <div class="answer" :ref="(el) => (answerRefs[index] = el)">
                <p>
                  {{ item.a }}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useReCaptcha } from "vue-recaptcha-v3";
import gsap from "gsap";

// REFS---------------

const placeholderVisible = ref(true);
const questionInput = ref("");
const activeQuestion = ref(null);

const answerRefs = ref([]);
const activeSendBtn = ref(false);
const loaderState = ref(false);


// const { executeRecaptcha } = useReCaptcha();

const recaptcha = shallowRef(null);



const questionData = [
  {
    id: 1,
    q: "Is this legal?",
    a: "The Foreign Earned Income Exclusion is a documented provision in the U.S. tax code that's been in place for decades, and many Americans living and working abroad use it. Whether it applies to your situation is a question for a qualified CPA. This is educational, not personal tax advice.",
  },
  {
    id: 2,
    q: "Do I have to quit my job?",
    a: "No, that's the whole point. The strategy is built around keeping your remote U.S. income while lowering what it costs you to live.",
  },
  {
    id: 3,
    q: "What if I don't have a remote job yet?",
    a: "That's common. Part of the work together is helping you find or negotiate a remote position if you don't already have one.",
  },
  {
    id: 4,
    q: "Which countries does this work in?",
    a: "Mexico, Colombia, Uruguay, Argentina, and others. We choose the country that fits your finances, lifestyle, and constraints, not a one-size-fits-all answer.",
  },
  {
    id: 5,
    q: "How much does this cost?",
    a: "The consulting engagement is $3,000 for the full program, and it includes my book, The Pillars of Wisdom. Financing through Affirm is available if you qualify.",
  },
  {
    id: 6,
    q: "What's the time commitment?",
    a: "It's a 90-day engagement, roughly 4–6 hours a week. This includes weekly calls, logistics, and decisions. It's hands-on, not passive.",
  },
  {
    id: 7,
    q: "Is this tax advice?",
    a: "This is educational consulting, not tax advice. GLO is a consultant, not a CPA or attorney. The program helps you get organized, understand how the strategy works, and bring the right questions to a licensed CPA or tax professional, who handles your actual eligibility and filings.",
  },
];

// FUNCTIONS----------------

const toggleQuestionVisible = (id, index) => {
  if (activeQuestion.value !== null) {
    const prevIndex = questionData.findIndex(
      (q) => q.id === activeQuestion.value,
    );

    if (prevIndex !== -1) {
      gsap.to(answerRefs.value[prevIndex], {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    if (activeQuestion.value === id) {
      activeQuestion.value = null;
      return;
    }
  }

  activeQuestion.value = id;

  gsap.to(answerRefs.value[index], {
    height: "auto",
    opacity: 1,
    duration: 0.3,
    ease: "power2.out",
  });
};

const sendQuestionHandler = async () => {

  if (!questionInput.value.trim()) {

    alert(`Please enter a question`);

    return;
  }

  loaderState.value = true;

  await recaptcha.value.recaptchaLoaded();

  const token = await recaptcha.value.executeRecaptcha("faq_form");

  try {

    const sendEmailRes = await $fetch('/api/contact/send-question', {
      method: 'POST',
      body: {
        question: questionInput.value,
        token,
      }
    })

    if (sendEmailRes.success) {

      alert('Your question has been sent, we will get back to you as soon as possible!');

      questionInput.value = ''

    }

  } catch (err) {
  
    console.error(err);

    alert('Failed to sent message');

  } finally {

    loaderState.value = false;

  }



}

// ANIMATION METHODS

onMounted(async () => {

  recaptcha.value = useReCaptcha();

  await nextTick();

  answerRefs.value.forEach((el) => {
    gsap.set(el, {
      height: 0,
      opacity: 0,
      overflow: "hidden",
    });
  });
});
</script>

<style scoped lang="scss">
@use "/styles/mixins.scss" as mixins;

.faq {
  @include mixins.component-spacing;
  width: 100%;
  height: auto;
  position: relative;
  background: var(--light-grey);
}

.faq_content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 50px;

  &_heading {
    @include mixins.fz-h1($color: var(--dark-green));
  }

  &_inner {
    display: grid;
    grid-template-columns: 1fr 2fr;
    align-items: flex-start;
    width: 100%;
    height: auto;
    position: relative;
    gap: 20px;

    @media screen and (max-width: 1024px) {
      display: flex;
      flex-direction: column-reverse;
      justify-content: center;
      align-items: center;
    }
  }

  .unique_question {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 30px;
    border: 1px solid var(--gray-2);
    border-radius: 20px;
    gap: 50px;

    &_head {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 20px;
    }

    &_title {
      @include mixins.fz-h3(
        $color: var(--dark-green),
        $size: clamp(1.5rem, 5vw, 1.85rem)
      );
    }

    &_text {
      @include mixins.fz-body($color: var(--dark-green));
    }

    .input_field {
      border: 1px solid var(--dark-green);
      border-radius: 14px;
      padding: 3px;
      width: 100%;
      height: 56px;
      position: relative;

      input {
        width: 100%;
        height: 100%;
        border: none;
        outline: none;
        padding-left: 20px;
        color: var(--dark-green);
        position: relative;
        background-color: transparent;
        z-index: 1;
      }

      @media screen and (max-width: 1024px) {
        height: clamp(47px, 6vw, 56px);
      }
    }

    .input_placeholder {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 6px;
      width: auto;
      height: 100%;
      position: absolute;
      left: 20px;
      top: 0;
    }

    .send_button {
      width: clamp(40px, 5vw, 50px);
      height: clamp(40px, 5vw, 50px);
      position: absolute;
      right: 3px;
      top: 50%;
      transform: translateY(-50%);
      border-radius: 14px;
      background-color: var(--dark-green);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10;

      svg {
        width: clamp(20px, 5vw, 24px);
        height: clamp(20px, 5vw, 24px);
      }

      @media screen and (max-width: 768px) {
        border-radius: 12px;
      }

      @media screen and (max-width: 480px) {
        border-radius: 10px;
      }
    }

    @media screen and (max-width: 1024px) {
      flex: 1;
      width: 100%;
      height: auto;
    }

    @media screen and (max-width: 768px) {
      padding: 25px;
      gap: 45px;
    }

    @media screen and (max-width: 480px) {
      padding: 20px;
      gap: 40px;
    }

    @media screen and (max-width: 375px) {
      padding: 15px;
      gap: 35px;
    }
  }

  .question_list {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 10px;

    li {
      border: 1px solid var(--gray-4);
      padding: 20px;
      border-radius: 14px;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;
      position: relative;
      cursor: pointer;
      width: 100%;
      height: auto;
      // gap: 16px;

      h5 {
        @include mixins.fz-h5($color: var(--dark-green));
      }

      p {
        @include mixins.fz-body($color: var(--dark-green));
      }

      .item_heading {
        width: 100%;
        height: auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;

        @media screen and (max-width: 420px) {
          align-items: flex-start;
        }
      }

      .arrow_el {
        width: clamp(30px, 5vw, 40px);
        height: clamp(30px, 5vw, 40px);
        padding: clamp(5px, 1vw, 8px);
        border: 1px solid var(--gray-2);
        border-radius: clamp(8px, 1vw, 14px);
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all ease 0.3s;
        transform: rotate(0deg);
      }

      .arrow_el_active {
        transition: all ease 0.3s;
        transform: rotate(180deg);
      }

      .answer {
        overflow: hidden;
      }

      .answer p {
        padding-top: 16px;
      }

      @media screen and (max-width: 1024px) {
        padding: 18px;
      }

      @media screen and (max-width: 768px) {
        padding: 15px;
      }

      @media screen and (max-width: 480px) {
        padding: 12px;
      }

      @media screen and (max-width: 375px) {
        padding: 10px;
      }
    }

    @media screen and (max-width: 1024px) {
      flex: 1;
      width: 100%;
      height: auto;
    }
  }

  @media screen and (max-width: 1024px) {
    gap: 40px;
  }

  @media screen and (max-width: 768px) {
    gap: 30px;
  }

  @media screen and (max-width: 480px) {
    gap: 20px;
  }
}
</style>
