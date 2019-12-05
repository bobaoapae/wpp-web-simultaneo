import emojiRegex from 'emoji-regex'
import data from 'emoji-mart-vue-fast/data/apple.json'
import { EmojiIndex } from 'emoji-mart-vue-fast'

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
            let style = `background-position: ${emoji.getPosition()};width: 22px;height: 22px;display:inline-block;`;
            // The src="data:image..." is needed to prevent border around img tags.
            return `<img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-text="${emoji.native}" alt="${emoji.native}" class='emoji-set-apple emoji-type-image' style="${style} ">`
        }
    },

    emailUrlfy(text) {
        var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi;

        // se der algum erro, testar essa Regex
        //emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;


        return text.replace(emailRegex, function (url) {
            return `<a href="mailto:${url}" title="mailto:${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
        });
    },

    urlify(text) {
        // var urlRegex = /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi;

        var urlRegex = /(^|\W\.|[^/\w.]|_)((?:http|https):|mailto:)?(\b\w[0-9a-z!#$%&'*+/=?^_`{|}~\-]*(?:\.[0-9a-z!#$%&'*+/=?^_`{|}~\-]+)*@)?((?!_)(?:(?:(?:\w|[^\s-«»‘’“”]|%[0-9a-f][0-9a-f])|(?:\w|[^\s-«»‘’“”]|%[0-9a-f][0-9a-f])(?:\w|[^\s-«»‘’“”]|%[0-9a-f][0-9a-f]|-)*(?:\w|[^\s-«»‘’“”]|%[0-9a-f][0-9a-f]))\.)+(?:abb|abbott|abudhabi|ac|academy|accountant|actor|ad|ads|adult|ae|aero|af|africa|ag|agency|ai|al|am|amsterdam|ao|apartments|app|ar|archi|army|arpa|art|as|asia|associates|at|attorney|au|auction|audio|auspost|auto|aw|aws|ax|az|ba|baby|band|bank|bar|barcelona|barclaycard|barclays|basketball|bayern|bb|bd|be|beer|bentley|berlin|best|bet|bf|bg|bh|bi|bible|bid|bike|bio|biz|bj|black|blog|blue|bm|bn|bnpparibas|bo|bot|boutique|box|br|bradesco|brother|brussels|bs|bt|build|builders|business|buzz|bw|by|bz|bzh|ca|cab|cafe|cam|camera|camp|canon|capital|car|cards|care|career|careers|cars|casa|cash|casino|cat|cba|cc|cd|ceb|center|ceo|cern|cf|cg|ch|chat|cheap|chrome|church|ci|city|ck|cl|claims|cleaning|click|clinic|clothing|cloud|club|cm|cn|co|coach|codes|coffee|college|com|community|company|computer|construction|consulting|contractors|cooking|cool|coop|coupons|courses|cr|credit|creditcard|cricket|crs|cu|cv|cw|cx|cy|cymru|cz|dance|date|dating|de|deals|delivery|dental|dentist|desi|design|dev|dhl|diet|digital|direct|directory|discount|dj|dk|dm|do|doctor|dog|domains|download|dz|earth|ec|eco|edu|education|ee|eg|email|energy|engineer|engineering|enterprises|equipment|es|estate|et|eu|eus|events|exchange|expert|exposed|express|fail|faith|family|fan|fans|farm|fashion|fi|film|finance|financial|fish|fit|fitness|fj|flowers|fm|fo|football|forsale|foundation|fox|fr|frl|fun|fund|furniture|futbol|fyi|ga|gal|gallery|game|games|garden|gd|gdn|ge|gent|gf|gg|gh|gi|gift|gifts|gl|glass|gle|global|gm|gmbh|gn|gold|golf|goog|google|gop|gov|gp|gq|gr|graphics|gratis|green|group|gs|gt|gu|guide|guru|gy|haus|health|help|here|hk|hn|holdings|holiday|homes|honda|horse|hospital|host|hosting|hot|house|how|hr|ht|hu|icu|id|ie|il|im|immo|in|inc|info|ink|institute|insurance|insure|int|international|investments|io|iq|ir|irish|is|ist|istanbul|it|je|jetzt|jewelry|jll|jm|jnj|jo|jobs|joburg|jp|ke|kg|kh|ki|kim|kitchen|kiwi|koeln|kp|kpmg|kr|krd|kred|kw|ky|kz|la|land|lat|law|lawyer|lb|lc|leclerc|legal|lgbt|li|life|lighting|limited|limo|link|live|lk|llc|loan|loans|lol|london|lotto|love|lr|ls|lt|ltd|ltda|lu|lundbeck|luxe|luxury|lv|ly|ma|madrid|management|map|market|marketing|markets|mba|mc|md|me|media|melbourne|men|menu|mg|miami|mil|mk|ml|mm|mn|mo|mobi|moda|moe|moi|mom|monash|money|monster|mortgage|moscow|movie|mp|mr|ms|mt|mu|museum|mv|mw|mx|my|mz|na|nagoya|name|nc|ne|net|network|neustar|news|nf|ng|ngo|ni|nico|ninja|nl|no|np|nrw|nu|nyc|nz|observer|office|okinawa|om|one|ong|onl|online|ooo|orange|org|organic|osaka|ovh|pa|page|paris|partners|parts|party|pe|pet|pf|pg|ph|pharmacy|photo|photography|photos|physio|pics|pictet|pictures|pink|pioneer|pizza|pk|pl|place|plus|pm|pn|poker|politie|porn|post|pr|press|pro|prod|productions|promo|properties|property|ps|pt|pub|pw|py|qa|quebec|radio|re|realestate|realtor|realty|recipes|red|ren|rent|rentals|repair|report|rest|restaurant|review|reviews|ricoh|rio|rip|ro|rocks|rodeo|rs|ru|rugby|run|rw|sa|sale|salon|sandvik|sap|saxo|sb|sbi|sc|school|science|scot|sd|se|security|services|ses|sex|sexy|sg|sh|sharp|shiksha|shoes|shop|shopping|show|si|singles|site|sk|ski|sl|sm|sn|sncf|so|soccer|social|softbank|software|solar|solutions|sony|soy|space|sport|sr|st|storage|store|stream|studio|study|style|su|supply|support|surf|sv|swiss|sx|sy|sydney|systems|sz|taipei|tatar|tattoo|tax|taxi|tc|td|team|tech|technology|tel|telefonica|teva|tf|tg|th|theater|tienda|tips|tj|tk|tl|tm|tn|to|today|tokyo|tools|top|total|tours|town|toyota|toys|tr|trade|trading|training|travel|trust|tt|tube|tv|tw|tz|ua|ug|uk|university|uno|uol|us|uy|uz|va|vanguard|vc|ve|vegas|ventures|vet|vg|vi|video|vin|vip|vision|vlaanderen|vn|vote|voyage|vu|wales|wang|watch|weather|webcam|weber|website|wedding|wf|wien|wiki|win|wine|work|works|world|ws|wtf|xin|xyz|yandex|ye|yoga|you|yt|za|zip|zm|zone|zw|бел|дети|москва|онлайн|орг|рус|рф|сайт|укр|بازار|भारत|বাংলা|გე|한국)(?!\.(?:\w|[^\s-«»‘’“”]|%[0-9a-f][0-9a-f])|(?:\w|[^\s-«»‘’“”]|%[0-9a-f][0-9a-f])(?:\w|[^\s-«»‘’“”]|%[0-9a-f][0-9a-f]|-)*(?:\w|[^\s-«»‘’“”]|%[0-9a-f][0-9a-f])))(?:(?!(?:\w|[^\s-«»‘’“”]|%[0-9a-f][0-9a-f])|(?:\w|[^\s-«»‘’“”]|%[0-9a-f][0-9a-f])(?:\w|[^\s-«»‘’“”]|%[0-9a-f][0-9a-f]|-)*(?:\w|[^\s-«»‘’“”]|%[0-9a-f][0-9a-f]))|(?=_))(?:(?=[^:/?#])|(:\d{1,5})?((?:\w|[^\s-«»‘’“”]|%[0-9a-f][0-9a-f]|[^\s%])*?)?(\?(?![+@!.?,(\[{<«‘“:]*(?!(?:\w|[^\s-«»‘’“”]|%[0-9a-f][0-9a-f]|[^\s%])|#))(?:\w|[^\s-«»‘’“”]|%[0-9a-f][0-9a-f]|[^\s%])*?)?(#(?:\w|[^\s-«»‘’“”]|%[0-9a-f][0-9a-f]|[^\s%])*?)?(?=[+@!.?,(\[{<«‘“:]*(?!(?:\w|[^\s-«»‘’“”]|%[0-9a-f][0-9a-f]|[^\s%])|#)))/gi;


        return text.replace(urlRegex, function (url) {
            url = url.trim();



            let href = url;

            if (url.match(/@/)) {
                href = `mailto:${url}`;
            } else if (!url.match(/http|ftp|sftp|ssh/i)) {
                href = `http://${url}`
            }

            return ` <a href="${href.toLowerCase()}" target="_blank">${url}</a>`;
        })
    },

    formatMsg(text) {
        //let mensagem = this.emailUrlfy(text);
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