import { msg } from '@/helper';

const filters = {
    uppercase (value) {
        if (!value) return '';
        return value.toUpperCase();
    },

    capitalize (value) {
        if (!value) return '';
        let re = /(^|[.!?]\s+)([a-z])/g;
        return value.replace(re, (m, $1, $2) => $1 + $2.toUpperCase());
    },

    emojify (value) {
        if (!value) return '';
        return msg.processNativeEmojiToImage(value);
    },

    formatMsg (value) {
        if (!value) return '';
        return msg.formatMsg(value);
    },

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
};

export default filters;
