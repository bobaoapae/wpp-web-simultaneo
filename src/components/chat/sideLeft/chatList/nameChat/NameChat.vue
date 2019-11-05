<template>
    <div
        id="name-chat"
        class="flex-grow-1"
        :class="{unread : isUnread}"
    >
        <span v-if="chat.contact.name">{{chat.contact.name }}</span>
        <span v-else>{{ chat.contact.id | formatNumber }}</span>
    </div>
</template>

<script>
export default {
    name: "NameChat",
    props: {
        chat: {
            type: Object,
            required: true
        }
    },
    filters: {
        formatNumber(value) {
            value = value.replace('@c.us', '');
             value = '+' + value;
            return value;
        }
    },
    computed: {
        isUnread() {
            if (this.chat.unreadCount > 0) {
                return true;
            } else {
                return false;
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