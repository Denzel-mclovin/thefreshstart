<template>
  <section class="disqualified_main">
    <div class="conntainer">
      <div class="disqualified_content">
        <div class="disqualified_content_media">
          <img src="/public/images/book.png" alt="book_preview" />
        </div>

        <div class="disqualified_info">
          <div class="disqualified_info_main">
            <p class="accent_text">A starting point that's still yours</p>

            <h1>
              The 1-on-1 program isn't the right fit right now. The framework
              still is.
            </h1>

            <p class="text_small">
              Based on your answers, working together one-on-one isn't the move
              for you yet — and I'd rather tell you that straight than sell you
              something that doesn't fit.
            </p>

            <p class="text_small">
              But the framework that program is built on doesn't require me.
              It's all in my book,
              <span class="dark_text">The Pillars of Wisdom,</span> so you can
              start exactly where you are.
            </p>
          </div>

          <div class="disqualified_info_list">
            <h6>What's inside</h6>

            <ul>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <g clip-path="url(#clip0_381_8804)">
                    <path
                      d="M4.16602 10.0002L8.33268 14.1668L16.666 5.8335"
                      stroke="#00DD78"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_381_8804">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>

                <p>
                  How the Foreign Earned Income Exclusion works, and the
                  questions to take to your CPA
                </p>
              </li>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <g clip-path="url(#clip0_381_8804)">
                    <path
                      d="M4.16602 10.0002L8.33268 14.1668L16.666 5.8335"
                      stroke="#00DD78"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_381_8804">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>

                <p>
                  How to choose the country that fits your finances, lifestyle,
                  and constraints
                </p>
              </li>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <g clip-path="url(#clip0_381_8804)">
                    <path
                      d="M4.16602 10.0002L8.33268 14.1668L16.666 5.8335"
                      stroke="#00DD78"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_381_8804">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>

                <p>
                  Getting your banking, healthcare, and paperwork organized for
                  a move abroad
                </p>
              </li>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <g clip-path="url(#clip0_381_8804)">
                    <path
                      d="M4.16602 10.0002L8.33268 14.1668L16.666 5.8335"
                      stroke="#00DD78"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_381_8804">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>

                <p>
                  How to find or negotiate a remote role if you don't have one
                  yet
                </p>
              </li>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <g clip-path="url(#clip0_381_8804)">
                    <path
                      d="M4.16602 10.0002L8.33268 14.1668L16.666 5.8335"
                      stroke="#00DD78"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_381_8804">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>

                <p>The mindset shifts behind actually making the move</p>
              </li>
            </ul>
          </div>

          <div class="bottom_content">
            <button class="disqualify_info_cta">Get The Book — $19.99</button>

            <span> Free shipping in the U.S. & EU. </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style scoped lang="scss">
@use "/styles/mixins.scss" as mixins;

.disqualified_main {
  width: 100%;
  height: auto;
  position: relative;
  @include mixins.component-spacing;
}

.disqualified_content {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  gap: 30px;

  &_media {
    padding: 110px 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--light-grey);
    border-radius: 28px;

    img {
      width: 65vw;
      height: auto;
      object-fit: cover;

      @media screen and (max-width: 1024px) {
        width: 30vw;
      }
    }

    @media screen and (max-width: 1024px) {
        max-height: 50vh;

        padding: 60px 0 30px;
    }
  }

  @media screen and (max-width: 1024px) {
    flex-direction: column;
  }

  @media screen and (max-width: 768px) {
      gap: 30px;
  }

  @media screen and (max-width: 480px) {
      gap: 25px;
  }
}

.disqualified_info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 30px;

  &_main {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 20px;

    .accent_text {
      @include mixins.fz-body-large($color: var(--emerald-green));
      padding-left: 24px;
      position: relative;

      &::before {
        content: "";
        display: block;
        width: 18px;
        height: 1px;
        background-color: var(--emerald-green);
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    h1 {
      @include mixins.fz-h1($color: var(--dark-green));

      @media screen and (max-width: 480px) {
        font-size: 1.25rem;
      }
    }

    p {
      @include mixins.fz-body($color: var(--dark-green));
    }

    .dark_text {
      font-weight: 700;
    }
  }

  &_list {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 20px;

    h6 {
      @include mixins.fz-h6($color: var(--dark-green));
    }

    ul {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 20px;
    }

    li {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 10px;

      p {
        @include mixins.fz-body($color: var(--dark-green));
      }
    }
  }

  .bottom_content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 10px;

    button {
      @include mixins.button-primary;
      @media screen and (max-width: 768px) {
        width: 100%;
        height: auto; 
      }
    }

    span {
      @include mixins.caption-font($color: var(--dark-green));
    }

    @media screen and (max-width: 768px) {

        position: fixed;
        bottom: 0px;
        align-items: center;
        width: 100%;
        height: auto;
        left: 0;
        backdrop-filter: blur(7px);
        padding: 15px 5vw 15px;
        border-top: 1px solid var(--soft-grey);
    }


    @media screen and (max-width: 480px) {
    }
  }
}
</style>
