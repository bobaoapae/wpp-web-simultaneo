<template>
    <div class="modal-del-msg" v-if="isShow">
        <div class="box-modal">
            <div>
                <div class="title">Apagar mensagem?</div>
                <div class="footer">
                    <div class="cancelar" @click="handleCancel">
                        Cancelar
                    </div>

                    <div class="apagar" @click="handleClick(false)">
                        Apagar para mim
                    </div>

                    <div class="apagar" @click="handleClick(true)" v-if="msg.canBeRevoke">
                        Apagar para todos
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
    name: 'ModalDeleteMsg',
    computed: {
        ...mapState(['modalDeleteMsg']),

        isShow () {
            return this.modalDeleteMsg.show;
        },

        msg () {
            return this.modalDeleteMsg.msg;
        }
    },
    methods: {
        ...mapMutations(['TOGGLE_MODAL_DELETE_MSG']),

        handleCancel () {
            this.TOGGLE_MODAL_DELETE_MSG({ show: false });
        },

        handleClick (fromAll) {
            if (fromAll) {
                this.msg.revoke();
            } else {
                this.msg.delete();
            }
            this.show = false;
        }
    }
};
</script>

<style scoped>
.modal-del-msg {
    position: absolute;
    z-index: 99;
    width: 100%;
    background-color: hsla(0, 0%, 100%, .85);
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.box-modal {
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 17px 50px 0 rgba(0, 0, 0, .19), 0 12px 15px 0 rgba(0, 0, 0, .24);
    padding: 22px 24px 20px;
    box-sizing: border-box;
    display: flex;
    overflow: hidden;
    width: 400px;
    flex-direction: column;
    flex: none;
}

.title {
    text-align: left;
    margin-bottom: 20px;
    font-size: 20px;
    font-weight: 400;
}

.footer {

    text-align: right;
    padding: 50px 5px 0;
    display: flex;
    flex-wrap: wrap-reverse;
    justify-content: flex-end;
    overflow: hidden;
    white-space: nowrap;
}

.cancelar {
    padding: 10px 24px;
    border-radius: 3px;
    margin-bottom: 5px;
    cursor: pointer;
    color: #07bc4c;
    text-transform: uppercase;
    position: relative;
    font-size: 14px;
    transition: box-shadow .18s ease-out, background .18s ease-out, color .18s ease-out;
    display: inline-block;
    line-height: normal;
    white-space: pre-wrap;
}

.apagar {
    margin-left: 4px;
    background-color: #05cd51;
    padding: 10px 24px;
    border-radius: 3px;
    margin-bottom: 5px;
    cursor: pointer;
    color: #fff;
    text-transform: uppercase;
    position: relative;
    font-size: 14px;
    transition: box-shadow .18s ease-out, background .18s ease-out, color .18s ease-out;
    display: inline-block;
    line-height: normal;
    white-space: pre-wrap;

}
</style>
