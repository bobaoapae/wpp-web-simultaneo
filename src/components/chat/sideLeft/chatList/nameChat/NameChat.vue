<template>
    <div
        :class="{unread : isUnread}"
        class="flex-grow-1"
        id="name-chat"
    >
        <span v-html="filters.emojify(name)"></span>
    </div>
</template>

<script>
import filters from '@/filters';

export default {
    name: 'NameChat',
    props: {
        chat: {
            type: Object,
            required: true
        }
    },
    computed: {
        isUnread () {
            return this.chat.unreadCount > 0;
        },
        name () {
            if (this.chat.formattedTitle) {
                return this.chat.formattedTitle;
            }
            return '+' + this.chat.id.replace('@c.us', '');
        }
    },
    data () {
        return {
            filters
        };
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
