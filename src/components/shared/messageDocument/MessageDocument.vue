<template>
    <div class="message-document">
        <div class="preview" v-if="msg.body">
            <img :src="srcFormated" alt="">
        </div>

        <div :title="formatedTitle" @click="downloadDocument" class="document-container">
            <div class="d-flex justify-content-between align-items-center">

                <div class="box-img">
                    <img src="@/assets/images/wpp-type-document-pdf.png" v-if="fileType === 'PDF'">
                    <img src="@/assets/images/wpp-type-document-docx.png" v-else-if="fileType === 'DOCX'">
                    <img src="@/assets/images/wpp-type-document-txt.png" v-else-if="fileType === 'TXT'">
                    <img src="@/assets/images/wpp-type-document-xlsx.png" v-else-if="fileType === 'XLSX'">
                    <img src="@/assets/images/wpp-type-document-others.png" v-else>
                </div>

                <div class="box-file-name">
                    <span class="file-name">{{msg.filename}}</span>
                </div>

                <div class="box-spinner" v-if="generatingLink">
                    <svg
                        class="_2bESe"
                        height="34"
                        viewBox="0 0 43 43"
                        width="34">
                        <circle
                            class="oWVod _1y_Nu _2BA8e"
                            cx="21.5"
                            cy="21.5"
                            fill="none"
                            r="20"
                            stroke-width="3">

                        </circle>
                    </svg>
                </div>
                <div class="box-download-button" v-else>
                    <span role="button">
                        <img alt="" src="@/assets/images/wpp-icon-document-download.svg">
                    </span>
                </div>
            </div>
        </div>

        <div class="info">
            <span v-if="showPages">{{msg.pageCount}} página<span v-if="msg.pageCount > 1">s</span></span>
            <span class="dot" v-if="showPages">•</span>
            <span>{{fileType}}</span>
            <span class="dot">•</span>
            <span>{{fileSize}}</span>

            <MessageTime :msg="msg"/>
        </div>
    </div>
</template>

<script>
import MessageTime from '../messageTime/MessageTime';
import { mapActions } from 'vuex';

export default {
    name: 'MessageDocument',
    components: {
        MessageTime
    },
    props: {
        msg: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            generatingLink: false
        };
    },
    computed: {
        formatedTitle () {
            return `baixar "${this.msg.filename}"`;
        },
        fileType () {
            const splt = this.msg.filename.split('.');
            return splt[splt.length - 1].toLocaleUpperCase();
        },
        srcFormated () {
            return 'data:image/jpeg;base64,' + this.msg.body;
        },
        fileSize () {
            // return this.msg.size;

            let tamanhoArquivo = this.msg.size / 1024;

            if (tamanhoArquivo < 1) {
                tamanhoArquivo = tamanhoArquivo.toFixed(0) + ' B';
            } else if (tamanhoArquivo <= 1024) {
                tamanhoArquivo = tamanhoArquivo.toFixed(0) + ' kB';
            } else {
                tamanhoArquivo = (tamanhoArquivo / 1024).toFixed(0) + ' mB';
            }

            return tamanhoArquivo;
        },
        showPages () {
            return this.fileType === 'PDF' ||
                this.fileSize === 'DOCX' ||
                this.fileSize === 'XLSX';
        }

    },
    methods: {
        ...mapActions(['downloadMedia']),

        downloadDocument () {
            if (!this.generatingLink) {
                this.generatingLink = true;
                this.downloadMedia({ id: this.msg.id._serialized, base64: false }).then(e => {
                    const element = document.createElement('a');
                    element.setAttribute('href', e);
                    element.toggleAttribute('download');

                    element.style.display = 'none';
                    document.body.appendChild(element);

                    element.click();

                    document.body.removeChild(element);
                }).catch(reason => {
                    console.error(reason);
                    alert('Falha ao baixar o arquivo, atualize a pagina e tente novamente.');
                }).finally(() => {
                    this.generatingLink = false;
                });
            }
        }
    }
};
</script>

<style scoped>
.message-document {
    padding: 3px;
    width: 276px;
}

.preview {
    height: 100px;
    overflow: hidden;
}

.preview img {
    max-width: 100%;
}

.document-container {
    /*rgba(0,0,0,0.1)
    #cfe9ba*/
    background: rgba(0, 0, 0, 0.06);
    cursor: pointer;
    padding: 13px 19px;
    border-radius: 6px;
}

.box-img img {
    height: 30px;
    width: 26px;
    overflow: hidden;
    object-fit: cover;
}

.box-file-name {
    margin: 0 10px;
    flex: 1 1 auto;
    overflow: hidden;
    position: relative;
    text-overflow: ellipsis;
    top: -2px;
    white-space: nowrap;
    font-size: 14.2px;
    color: #262626;
}

.info {
    padding-left: 3px;
}

.info span {
    font-size: 11px;
    color: rgba(0, 0, 0, 0.45);
}

.dot {
    color: #cbd5da;
    margin: 0 4px;
}

svg {
    animation: _3rafi 2s linear infinite;
}

._2BA8e {
    stroke: #849982;
}

.oWVod {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    animation: _1NbMv 1.5s ease-in-out infinite;
}

@keyframes _3rafi {
    100% {
        transform: rotate(1turn);
    }
}

@keyframes _1NbMv {
    0% {
        stroke-dasharray: 1, 150;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -35;
    }
    100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -124;
    }
}

</style>
