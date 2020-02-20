<template>
    <div class="msg-revoked">
        <div class="msg-revoked-container">
            <div class="icon">
                <span class="" data-icon="recalled-out">
                    <svg height="19" id="Layer_1" viewBox="0 0 18 19" width="18" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M13.628 12.463a5.17 5.17 0 0 0-7.207-7.209l7.207 7.209zm-1.23 1.229L5.19 6.484a5.17 5.17 0 0 0 7.208 7.208zM9.409 2.564a6.91 6.91 0 1 1 0 13.819 6.91 6.91 0 0 1 0-13.819z"
                            fill="#849882">
                        </path>
                    </svg>
                </span>
            </div>
            <span class="label">{{label}}</span>
            <MessageTime :msg="msg"/>
        </div>
    </div>
</template>

<script>
import MessageTime from '../messageTime/MessageTime';

export default {
    name: 'MessageRevoked',
    components: { MessageTime },
    props: {
        msg: {
            type: Object,
            required: true
        }
    },
    computed: {
        label () {
            if (this.msg.id.fromMe) {
                return 'Você apagou essa mensagem';
            }
            return 'Essa mensagem foi apagada';
        }
    }
};
</script>

<style scoped>
.msg-revoked {
    padding: 6px 7px 8px 9px;
    font-size: 14.2px;
    line-height: 19px;
}

.msg-revoked-container {
    font-style: italic;
    color: rgba(0, 0, 0, .45);
}

.label {
    margin-right: 70px;
}

.icon {
    margin-right: 3px;
    display: inline-block;
    overflow: hidden;
    vertical-align: -4px;
}
</style>
