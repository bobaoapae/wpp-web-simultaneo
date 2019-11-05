<template>
    <div class="message-document">
        <div class="preview" v-if="msg.body">
            <img :src="srcFormated" alt="">
        </div>

        <div class="document-container" @click="downloadDocument" :title="formatedTitle">
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
                
                <div class="box-download-button">
                    <span role="button">
                        <img src="@/assets/images/wpp-icon-document-download.svg" alt="">
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

            <MessageTime :msg="msg" />
        </div>
    </div>
</template>

<script>
    import MessageTime from "../messageTime/MessageTime";
    import api from '@/api.js';
    export default {
        name: "MessageDocument",
        components: {
            MessageTime
        },
        props: {
            msg: {
                type: Object,
                required: true
            }
        },
        computed: {
            formatedTitle() {
                return `baixar "${this.msg.filename}"`;
            },
            fileType() {
                const splt = this.msg.filename.split('.');
                return splt[splt.length -1].toLocaleUpperCase();
            },
            srcFormated() {
                return "data:image/jpeg;base64," + this.msg.body;
            },
            fileSize() {

                //return this.msg.size;

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
            showPages() {
                return this.fileType === 'PDF' ||
                        this.fileSize === 'DOCX' ||
                        this.fileSize === 'XLSX'
            }

        },
        methods: {
            downloadDocument() {
                api.get(`/api/whatsApp/mediaMessage/${this.msg.id._serialized}/false`)
                    .then(r => {
                        const element = document.createElement('a');
                        console.log(r.data.base64);
                        element.setAttribute('href', r.data.base64);
                        element.setAttribute('download', r.data.fileName);

                        element.style.display = 'none';
                        document.body.appendChild(element);

                        element.click();

                        document.body.removeChild(element);
                    })
            }
        }
    }
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
        background: rgba(0,0,0,0.06);
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
        color: rgba(0,0,0,0.45);
    }


    .dot {
        color: #cbd5da;
        margin: 0 4px;
    }

</style>