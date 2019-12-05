<template>
    <div
            :class="{unread : isUnread}"
            class="flex-grow-1"
            id="name-chat"
    >
        <span v-html="nameEmojify"></span>
    </div>
</template>

<script>
    import {msg} from '@/helper.js'

    export default {
        name: "NameChat",
        props: {
            chat: {
                type: Object,
                required: true
            }
        },
        computed: {
            isUnread() {
                return this.chat.unreadCount > 0;
            },
            nameEmojify() {
                if (this.chat.contact.name) {
                    return msg.processNativeEmojiToImage(this.chat.contact.name);
                } else {
                    return "+" + this.chat.id.replace('@c.us', '');
                }
            }
        }
    };
</script>

<style scoped>
    #name-chat {
        font-size: 17px;
        color: #000000;

        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .unread {
        font-weight: 500 !important;
        color: #262626 !important;
    }
</style>