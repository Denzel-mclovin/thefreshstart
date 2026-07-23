<template>
  <div class="footer">
    <div class="conntainer">
      <div class="footer_content">
        <div class="footer_content_top">
          <div class="footer_content_top_main">
            <img src="/public/images/logo_white.png" alt="logo" />

            <p>
              Helping remote professionals keep more of what they earn and build
              a better life abroad.
            </p>

            <p class="footer_text_small">
              © 2026 Mystic Visions LLC. All rights reserved.
            </p>
          </div>

          <div class="footer_content_top_links">
            <div class="links_item">
              <h6>Quick link</h6>
              <ul class="links_item_list">
                <li>
                  <NuxtLink to="/privacy-policy"> Privacy Policy </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/return-policy"> Return Policy </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="mailto:mysty.vis@gmail.com">
                    Contact us
                  </NuxtLink>
                </li>
              </ul>
            </div>

            <div class="links_item">
              <h6>Contact</h6>
              <ul class="links_item_list">
                <li>
                  <NuxtLink
                    to="https://www.thepillarsofwisdom.com"
                    target="_blank"
                  >
                    thepillarsofwisdom.com
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="mailto:mysty.vis@gmail.com" class="mail">
                    mysty.vis@gmail.com
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="footer_content_bottom">
          <p>
            Disclaimer: Fresh Start provides educational consulting and is not a
            tax, legal, or financial advisor; nothing here is personal tax,
            legal, or financial advice. The Foreign Earned Income Exclusion is
            referenced for educational purposes only, and eligibility depends on
            your individual circumstances. Consult a qualified CPA or tax
            professional regarding your situation.
          </p>

          <p class="recaptcha-disclaimer">
            This site is protected by reCAPTCHA and the Google
            <NuxtLink 
              to="https://policies.google.com/privacy" 
              target="_blank"
              class="link_text"
            >
              Privacy Policy
            </NuxtLink>
            and
            <NuxtLink 
              to="https://policies.google.com/terms" 
              target="_blank"
              class="link_text"
            >
              Terms of Service
            </NuxtLink>
            apply.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
@use "/styles/mixins.scss" as mixins;

.footer {
  width: 100%;
  height: auto;
  position: relative;
  background: var(--dark-green);
  color: var(--gray-2);

  @include mixins.component-spacing;

  &_content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    justify-content: center;

    &_top {
      border-bottom: 1px solid #13523e;
      padding-bottom: 50px;
      width: 100%;
      height: auto;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 50px;

      &_main {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        max-width: 400px;
        height: auto;
        position: relative;
        gap: 30px;

        p {
          @include mixins.fz-body-large(
            $color: var(--soft-white),
            $size: 1.125rem
          );
        }

        .footer_text_small {
          @include mixins.fz-body($color: var(--soft-white), $size: 0.875rem);
        }

        @media screen and (max-width: 768px) {
          flex: 1;
          width: 100%;
          max-width: unset;
        }
      }

      &_links {
        display: flex;
        justify-content: flex-end;
        align-items: flex-start;
        position: relative;
        max-width: 400px;
        width: 100%;
        height: auto;
        gap: clamp(50px, 10vw, 100px);

        @media screen and (max-width: 768px) {
          flex: 1;
          width: 100%;
          max-width: unset;
          justify-content: flex-start;
        }

        @media screen and (max-width: 375px) {
          flex-direction: column;
          align-items: flex-start;
          gap: 30px;
        }
      }

      .links_item {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        position: relative;
        gap: 32px;

        &_list {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          gap: 16px;

          li {
            display: block;
            width: 100%;
            height: auto;
            position: relative;
            @media screen and (min-width: 1024px) {
              &::before {
                content: "";
                display: block;
                width: 1px;
                height: 1px;
                background: transparent;
                position: absolute;
                bottom: 0;
                left: 0;
                transform: translateY(5px);
                transition: all ease 0.3s;
              }

              a {
                @include mixins.fz-body($size: 1rem);
                position: relative;
                width: 100%;
                height: 100%;
                z-index: 10;
              }

              &:hover::before {
                width: 100%;
                background-color: var(--soft-green);
                transition: all ease 0.3s;
              }
            }
          }
        }
      }

      h6 {
        @include mixins.fz-h5($color: #fff, $size: 1.25rem);
        text-transform: uppercase;
        white-space: nowrap;
      }

      @media screen and (max-width: 768px) {
        flex-direction: column;
      }

      @media screen and (max-width: 480px) {
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
      }
    }

    &_bottom {
      width: 100%;
      height: auto;
      padding-top: 30px;
      @include mixins.fz-body($color: var(--gray-6), $size: 1rem);
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 20px;

      .link_text {
        color: #FFF;

        @media screen and (mix-width: 1024px) {
          &:hover {
            text-decoration: underline;
            color: var(--soft-green);
          }
        }
      }

      @media screen and (max-width: 480px) {
        padding-bottom: 50px;
      }
    }
  }
}
</style>
