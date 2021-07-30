<template>
    <div class="picture" v-observe-visibility="{
         throttle: 300,
         callback: handleChatVisible,
         once: true
    }">
        <transition mode="out-in" name="component-fade" v-if="!group">
            <img :key="'user'" src="@/assets/images/wpp-photo-user.svg" v-if="!picture"/>

            <img :key="'original'" :src="picture" v-else/>
        </transition>
        <transition mode="out-in" name="component-fade" v-else>
            <img :key="'group'" src="@/assets/images/wpp-photo-group.svg" v-if="!picture"/>

            <img :key="'original'" :src="picture" v-else/>
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
        },
        group: {
            type: Boolean,
            required: false
        },
        full: {
            type: Boolean,
            required: false
        }
    },
    data () {
        return {
            picture: ''
        };
    },
    methods: {
        ...mapActions(['findPictureFromId']),

        handleChatVisible (visible) {
            if (visible && this.id && this.id) {
                this.findPictureFromId({ id: this.id }).then(value => {
                    this.picture = value;
                    if (this.full) {
                        this.findPictureFromId({ id: this.id, full: this.full }).then(value => {
                            this.picture = value;
                        });
                    }
                });
            }
        }
    }
};
</script>

<style scoped>
.picture {
    display: flex;
    align-items: center;
    padding: 0 15px 0 13px;
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
