import emojiRegex from 'emoji-regex'
import data from 'emoji-mart-vue-fast/data/apple.json'
import {EmojiIndex} from 'emoji-mart-vue-fast'

const emojiIndex = new EmojiIndex(data);
const unicodeEmojiRegex = emojiRegex();

export const msg = {

    emojiIndex() {
        return emojiIndex;
    },

    unicodeEmojiRegex() {
        return unicodeEmojiRegex;
    },

    processNativeEmojiToImage(text) {
        return text.replace(unicodeEmojiRegex, function (match, offset) {
            const before = text.substring(0, offset);
            if (before.endsWith('alt="') || before.endsWith('data-text="')) {
                // Emoji inside the replaced <img>
                return match
            }
            // Find emoji object by native emoji.
            let emoji = emojiIndex.nativeEmoji(match);
            if (!emoji) {
                // Can't find unicode emoji in our index
                return match
            }
            // See `emojiToHtml` function above.
            return emojiToHtml(emoji)
        });

        function emojiToHtml(emoji) {
            let style = `background-position: ${emoji.getPosition()};width: 20px;height: 20px;display:inline-block;`;
            // The src="data:image..." is needed to prevent border around img tags.
            return `<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-text="${emoji.native}" alt="${emoji.native}" class='emoji-set-apple emoji-type-image' style="${style} ">`
        }
    },

    urlify(text) {
        var urlRegex = /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi;

        return text.replace(urlRegex, function (url) {
            if (!url.match(/http/)) {
                url = `http://${url}`
            }

            return `<a href="${url}" target="_blank"> ${url} </a>`;
        })
    },

    formatMsg(text) {
        let mensagem = this.urlify(text);
        mensagem = this.formatStyle(mensagem);

        return mensagem;
    },


    formatStyle(msg) {
        let regex1 = new RegExp(/(?:^|[\s\W_])\*(\S|\S[^\n]*?\S)\*(?=$|[[\s\W_])/g);
        let replaceMask1 = `<strong>$1</strong>`;

        msg = msg.replace(regex1, function (match, p1, p2, p3, offset, string) {
            if (match.charAt(0) === '*') {
                return `<strong>${p1}</strong>`;
            } else {
                return `${match.charAt(0)}<strong>${p1}</strong>`;
            }
        });

        regex1 = new RegExp(/```([\s\S]*?\S[\s\S]*?)```/g);
        replaceMask1 = `<pre>$1</pre>`;

        msg = msg.replace(regex1, function (match, p1, p2, p3, offset, string) {
            if (match.charAt(0) === '`') {
                return `<pre>${p1}</pre>`;
            } else {
                return `${match.charAt(0)}<pre>${p1}</pre>`;
            }
        });

        regex1 = new RegExp(/(?:^|[\s\W_])\_(\S|\S[^\n]*?\S)\_(?=$|[[\s\W_])/g);
        replaceMask1 = `<i>$1</i>`;

        msg = msg.replace(regex1, function (match, p1, p2, p3, offset, string) {
            if (match.charAt(0) === '_') {
                return `<i>${p1}</i>`;
            } else {
                return `${match.charAt(0)}<i>${p1}</i>`;
            }
        });

        regex1 = new RegExp(/(?:^|[\s\W_])\~(\S|\S[^\n]*?\S)\~(?=$|[[\s\W_])/g);
        replaceMask1 = `<del>$1</del>`;

        msg = msg.replace(regex1, function (match, p1, p2, p3, offset, string) {
            if (match.charAt(0) === '~') {
                return `<del>${p1}</del>`;
            } else {
                return `${match.charAt(0)}<del>${p1}</del>`;
            }
        });

        return (msg);
    }
};