<template>
    <div class="picture" v-b-visible.once="handleChatVisible">
        <transition mode="out-in" name="component-fade">
            <img key="user" src="@/assets/images/wpp-photo-user.svg" v-if="!picture"/>

            <img key="original" :src="picture" v-else/>
        </transition>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    name: 'Picture',
    props: {
        id: {
            type: String,
            required: true
        }
    },
    data () {
        return {
            picture: ''
        };
    },
    methods: {
        ...mapActions(['getPicture']),

        handleChatVisible (visible) {
            if (visible) {
                // this.getPicture({
                //     chatId: this.id
                // });
            }
        }
    }
};
</script>

<style scoped>
.picture {
    display: flex;
    padding: 0 15px 0 13px;
    align-items: center;
}

    img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
    }

.component-fade-enter-active, .component-fade-leave-active {
    transition: opacity 0.08s ease;
}

.component-fade-enter, .component-fade-leave-to {
    opacity: 0;
}
</style>
