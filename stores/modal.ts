import { defineStore } from "pinia";

export const useModalStore = defineStore('modal', {
    state: () => ({

        adminBurgerState: false,
        isVisible: false,
        currentModal: '',
        modalProps: {},

    }),
    actions: {
        showModal(modalName: string, props: Object, scroll?: boolean) {
            this.isVisible = true;
            this.currentModal = modalName;
            this.modalProps = props;

            if (scroll) {
                document.body.style.overflow = "hidden";
            }
            // document.body.style.overflow = "hidden";
            
        },
        closeModal() {
            this.isVisible = false;
            this.currentModal = '';
            this.modalProps = {};
            document.body.style.overflow = "unset";
        },
        setAdminBurgerBtn() {
            this.adminBurgerState = !this.adminBurgerState
        }
    }
})