<template>
    <div class="quoted-msg-content">
        <MsgSymbol :type="type" />

        <div class="box-content">
            <span class="content" v-if="caption" v-html="caption"></span>
            <span class="content" v-else-if="body && type === 'chat'  " v-html="body"></span>
            <MsgType :type="type" v-else/>
        </div>
    </div>
</template>

<script>
    import MsgSymbol from "./msgSymbol/MsgSymbol";
    import MsgType from "./msgType/MsgType";



    export default {
        name: "quotedMsgContent",
        components: {MsgType, MsgSymbol},
        props: {
            body: {
                required: true
            },
            type: {
                type: String,
                required:true
            },
            caption: {
                required: true
            }
        }
    }
</script>

<style scoped>
    .quoted-msg-content {
        display: flex;
        align-items: center;


    }

    .box-content {
        -webkit-line-clamp: 3;
        color: rgba(0,0,0,.6);
        display: -webkit-box;
        font-size: 13.2px;
        line-height: 20px;
        max-height: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: pre-wrap;
        word-wrap: break-word;
        -webkit-box-orient: vertical;
    }
    
    .content {
        color: rgba(0,0,0,0.6);
        font-size: 13.2px;
        white-space: pre-wrap;
        word-wrap: break-word;

        overflow-y: hidden;
        text-overflow: ellipsis;

    }
</style>