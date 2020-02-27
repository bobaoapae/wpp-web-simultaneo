<template>
    <div class="message-audio" :class="{'played' : msg.ack === 4}" v-b-visible.once="onVisible">
        <div class="audio-container">
            <div class="audio-picture">
                <Picture :id="msg.senderObj.id" v-if="msg.isPtt"/>
                <img src="@/assets/images/wpp-icon-audio.svg" v-else/>
            </div>
            <div class="audio-wrapper">
                <span class="audio-time" v-if="!audioPlaying">{{msg.duration | timeFormatted}}</span>
                <span class="audio-time" v-else>{{audioTime | timeFormatted}}</span>
                <div class="audio-controls">
                    <div class="box-spinner" v-if="srcLoading && !srcAudio">
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
                    <img src="@/assets/images/wpp-icon-audio-play.svg" @click="handleClickPlayAudio"
                         v-else-if="!audioPlaying"/>
                    <img src="@/assets/images/wpp-icon-audio-pause.svg" @click="handleClickPauseAudio" v-else/>
                    <div class="audio-progress-container">
                        <span class="audio-progress-mark" :class="{'ptt' : msg.isPtt}"
                              :style="{width: `${audioProgress}%`}"></span>
                        <input dir="ltr" type="range" class="audio-progress" min="0" max="100" v-model="audioProgress"
                               ref="audioProgress" @input="handleProgressInput">
                        <audio :src="srcAudio" v-if="srcAudio && !srcError" preload="auto" ref="audio"
                               @play="handlePlayAudio"
                               @pause="handlePauseAudio"
                               @timeupdate="handleTimeUpdate"/>
                    </div>
                </div>
            </div>
            <MessageTime :msg="msg" :class="{'custom-time' : !msg.id.fromMe}"/>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import MessageTime from '../messageTime/MessageTime';
import Picture from '../picture/Picture';

export default {
    name: 'MessageAudio',
    components: {
        Picture,
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
            srcAudio: '',
            srcLoading: false,
            srcError: false,
            audioPlaying: false,
            audioProgress: 0,
            audioTime: 0
        };
    },
    methods: {
        ...mapActions(['downloadMedia']),

        handleMarkPlayed () {
            if (this.msg.ack !== 4) {
                this.msg.markPlayed();
            }
        },

        getAudio () {
            this.srcLoading = true;
            this.downloadMedia({ id: this.msg.id._serialized }).then(e => {
                this.srcAudio = e.base64.replace('vorbis', 'ogg');
                this.srcError = false;
            }).catch(e => {
                this.srcError = true;
            }).finally(() => {
                this.srcLoading = false;
            });
        },

        handleClickPlayAudio () {
            this.$refs.audio.play();
        },

        handleClickPauseAudio () {
            this.$refs.audio.pause();
        },

        handleProgressInput (evt) {
            let progressValue = evt.target.valueAsNumber;
            this.audioProgress = progressValue;
        },

        handlePlayAudio (evt) {
            this.handleMarkPlayed();
            this.audioPlaying = true;
        },

        handlePauseAudio (evt) {
            this.audioPlaying = false;
        },

        handleTimeUpdate (evt) {
            this.audioTime = evt.target.currentTime;
            this.audioProgress = (evt.target.currentTime / evt.target.duration) * 100;
            if (this.audioProgress >= 100) {
                this.audioProgress = 0;
                evt.target.currentTime = 0;
            }
        },

        onVisible (visible) {
            if (visible && !this.srcAudio) {
                this.getAudio();
            }
        }
    },
    filters: {
        timeFormatted (secs) {
            let secNum = parseInt(secs, 10);
            let hours = Math.floor(secNum / 3600);
            let minutes = Math.floor(secNum / 60) % 60;
            let seconds = secNum % 60;

            return [hours, minutes, seconds]
                .map(v => v < 10 ? '0' + v : v)
                .filter((v, i) => v !== '00' || i > 0)
                .join(':');
        }
    }
};
</script>

<style scoped>
.message-audio {
    padding: 5px;
    width: 336px;
    height: 67px;
}

.audio-container {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
}

.audio-picture img {
    padding: 0 15px 0 13px;
    border-radius: 50%;
}

.message-in .audio-container {
    flex-direction: row-reverse;
}

.audio-wrapper {
    position: relative;
    width: 100%;
}

.audio-controls {
    align-items: center;
    display: flex;
    direction: ltr;
}

.audio-progress-container {
    top: -1px;
    position: relative;
    width: 100%;
}

.audio-progress {
    height: 21px;
    box-sizing: border-box;
    appearance: none;
    background-color: transparent !important;
    outline: none;
    border: none;
    display: block;
    width: 100%;
}

.audio-progress-mark {
    top: 9px;
    height: 3px;
    width: 0;
    background-color: #889a7b;
    pointer-events: none;
    z-index: 10;
    position: absolute;
    left: 0;
}

.custom-time {
    right: 85px;
}

.message-in .audio-progress-mark {
    background-color: #00a5f4;
}

.message-in .audio-progress-mark.ptt {
    background-color: #31c76a;
}

.message-in .message-audio.played .audio-progress-mark.ptt {
    background-color: #00a5f4;
}

.audio-progress::-webkit-slider-thumb {
    background-color: #889a7b
}

.audio-progress::-moz-range-thumb {
    background-color: #889a7b
}

.message-in .audio-progress::-webkit-slider-thumb {
    background-color: #00a5f4
}

.message-in .audio-progress::-webkit-slider-thumb.ptt {
    background-color: #31c76a
}

.message-in .message-audio.played .audio-progress::-webkit-slider-thumb {
    background-color: #2ab5eb
}

.audio-progress::-webkit-slider-runnable-track {
    height: 3px
}

.audio-progress::-webkit-slider-runnable-track {
    background-color: #e6e6e6;
}

.message-out .audio-progress::-webkit-slider-runnable-track {
    background-color: #c6dfb2;
}

.audio-progress:active::-webkit-slider-thumb {
    width: 15px;
    height: 15px;
    margin-top: -6px
}

.audio-progress:disabled::-webkit-slider-thumb {
    display: none
}

.audio-progress::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 13px;
    height: 13px;
    margin-top: -5px;
    border-radius: 50%;
    border: none;
    transition: all .1s ease
}

.audio-progress::-moz-range-track {
    background-color: #e6e6e6;
}

.audio-time {
    bottom: -8px;
    left: 35px;
    color: rgba(0, 0, 0, .45);
    font-size: 11px;
    line-height: 15px;
    position: absolute;
}

.box-spinner {
    padding: 5px;
    margin-right: 10px;
}

.box-download {
    padding: 5px;
    margin-right: 10px;
}

.box-range {
    min-width: 200px;
    min-height: 20px;
    display: flex;
    align-items: center;
    margin-right: 10px;
}

.box-range::before {
    content: '';
    width: 100%;
    height: 3px;
    background-color: rgba(0, 0, 0, .2);
    display: block;
    border-radius: 10px;
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
