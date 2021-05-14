import emojiRegex from 'emoji-regex';
import data from 'emoji-mart-vue-fast/data/apple.json';
import { EmojiIndex } from 'emoji-mart-vue-fast';
import { escape, unescape } from 'html-escaper';

const emojiIndex = new EmojiIndex(data);
const unicodeEmojiRegex = emojiRegex();

export const msg = {

    emojiIndex () {
        return emojiIndex;
    },

    unicodeEmojiRegex () {
        return unicodeEmojiRegex;
    },

    processNativeEmojiToImage (text) {
        return text.replace(unicodeEmojiRegex, replace);

        function emojiToHtml (emoji) {
            let style = `background-position: ${emoji.getPosition()};width: 22px;height: 22px;display:inline-block;`;
            // The src="data:image..." is needed to prevent border around img tags.
            return `<img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-text="${emoji.native}" alt="${emoji.native}" class='emoji-set-apple emoji-type-image' style="${style} ">`;
        }

        function replace (match, offset) {
            const before = text.substring(0, offset);
            if (before.endsWith('alt="') || before.endsWith('data-text="')) {
                // Emoji inside the replaced <img>
                return match;
            }
            // Find emoji object by native emoji.
            let emoji = emojiIndex.nativeEmoji(match);
            if (!emoji) {
                // Can't find unicode emoji in our index
                return match;
            }
            // See `emojiToHtml` function above.
            return emojiToHtml(emoji);
        }
    },

    emailUrlfy (text) {
        let emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi;

        // se der algum erro, testar essa Regex
        // emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;

        return text.replace(emailRegex, function (url) {
            return `<a href="mailto:${url}" title="mailto:${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
        });
    },

    urlify (text) {
        // eslint-disable-next-line no-useless-escape
        const urlRegex = /(^|\W\.|[^/\w.]|_)((?:http|https):\/\/|mailto:)?(\b\w[0-9a-z!#$%&'*+/=?^_`{|}~\-]*(?:\.[0-9a-z!#$%&'*+/=?^_`{|}~\-]+)*@)?((?!_)(?:(?:(?:\w|[^\s -«»‘’“”]|%[0-9a-f][0-9a-f])|(?:\w|[^\s -«»‘’“”]|%[0-9a-f][0-9a-f])(?:\w|[^\s -«»‘’“”]|%[0-9a-f][0-9a-f]|-)*(?:\w|[^\s -«»‘’“”]|%[0-9a-f][0-9a-f]))\.)+(?:abbott|abudhabi|ac|academy|ad|adult|ae|aero|af|africa|ag|agency|ai|al|alsace|am|amsterdam|ao|app|apple|ar|archi|army|art|as|asia|associates|at|attorney|au|auction|audi|audio|auto|aw|aws|ax|axa|az|ba|baby|band|bank|bar|barcelona|barclaycard|barclays|basketball|bb|bd|be|beer|berlin|best|bet|bf|bg|bh|bi|bible|bid|bike|bio|biz|bj|black|blog|blue|bm|bn|bnpparibas|bo|bot|boutique|box|br|bradesco|broker|brother|brussels|bs|bt|build|builders|business|buzz|bw|by|bz|bzh|ca|cab|cafe|cam|camera|camp|canon|capital|car|cards|care|careers|cars|casa|cash|casino|cat|cc|cd|center|ceo|cern|cf|cg|ch|chat|cheap|chrome|church|ci|city|ck|cl|claims|cleaning|click|clinic|clothing|cloud|club|cm|cn|co|coach|codes|coffee|college|com|community|company|computer|construction|consulting|contractors|cool|coop|coupons|courses|cr|credit|cricket|cruises|cu|cv|cw|cx|cy|cymru|cz|dance|date|dating|de|deals|delivery|dental|dentist|desi|design|dev|dhl|diamonds|diet|digital|direct|directory|discount|dj|dk|dm|do|doctor|dog|domains|download|dz|earth|ec|eco|edu|education|ee|eg|email|energy|engineering|enterprises|equipment|es|estate|et|eu|eus|events|exchange|expert|exposed|express|fail|faith|family|fan|fans|farm|fashion|fi|film|finance|financial|fish|fishing|fit|fitness|fj|flights|flowers|fm|fo|football|forex|forsale|foundation|fr|frl|fun|fund|furniture|futbol|fyi|ga|gal|gallery|game|games|garden|gd|gdn|ge|gf|gg|gh|gi|gift|gifts|gives|gl|glass|gle|global|gm|gn|gold|golf|goog|google|gov|gp|gq|gr|graphics|gratis|green|group|gs|gt|guide|guitars|guru|gy|haus|health|healthcare|help|here|hermes|hitachi|hk|hn|hockey|holdings|holiday|honda|horse|hospital|host|hosting|hot|house|how|hr|ht|hu|icu|id|ie|il|im|immo|in|inc|industries|info|ink|institute|insure|int|international|investments|io|ipiranga|iq|ir|irish|is|ist|istanbul|it|jcb|je|jewelry|jio|jll|jm|jo|jobs|jp|ke|kg|kh|ki|kim|kitchen|kiwi|kn|komatsu|kp|kpmg|kr|krd|kred|kw|ky|kyoto|kz|la|land|lat|law|lawyer|lb|lc|lease|leclerc|legal|lgbt|li|life|lighting|limited|limo|link|live|lk|llc|loan|loans|lol|london|love|lr|ls|lt|ltd|ltda|lu|luxe|luxury|lv|ly|ma|madrid|makeup|management|market|marketing|markets|mba|mc|md|me|media|melbourne|men|menu|mg|mil|mk|ml|mm|mn|mo|mobi|moda|moe|moi|mom|monash|money|monster|mortgage|moscow|movie|mp|mq|mr|ms|mt|mu|museum|mv|mw|mx|my|mz|na|nagoya|name|nc|ne|net|network|neustar|new|news|nf|ng|ngo|ni|nikon|ninja|nl|no|np|nrw|ntt|nu|nyc|nz|observer|office|okinawa|om|one|ong|onl|online|ooo|org|organic|ovh|pa|page|paris|partners|parts|party|pe|pet|pf|pg|ph|pharmacy|photo|photography|photos|physio|pics|pictet|pictures|pink|pioneer|pizza|pk|pl|place|plumbing|plus|pm|pn|poker|porn|post|pr|press|pro|prod|productions|promo|properties|property|ps|pt|pub|pw|py|qa|quebec|racing|radio|re|realestate|realtor|realty|recipes|red|reisen|ren|rent|rentals|repair|report|rest|restaurant|review|reviews|rich|rio|rip|ro|rocks|rodeo|rs|ru|rugby|run|rw|sa|saarland|sale|salon|sap|saxo|sb|sbi|sc|school|schule|science|scot|sd|se|security|services|ses|sex|sexy|sg|sh|sharp|shiksha|shoes|shop|shopping|show|si|singles|site|sk|ski|sl|sm|sn|sncf|so|soccer|social|softbank|software|solar|solutions|sony|soy|space|sport|spot|sr|st|stockholm|storage|store|stream|studio|study|style|su|supply|support|surf|sv|swiss|sx|sy|sydney|systems|sz|taipei|tatar|tattoo|tax|taxi|tc|td|team|tech|technology|tel|tf|tg|th|theater|tickets|tips|tj|tk|tl|tm|tn|to|today|tokyo|tools|top|total|tours|town|toyota|toys|tr|trade|trading|training|travel|trust|tt|tube|tv|tw|tz|ua|ug|uk|university|uno|uol|us|uy|uz|va|vacations|vanguard|vc|ve|vegas|ventures|vet|vg|vi|video|vin|vip|vision|vlaanderen|vn|vote|voyage|vu|wales|wang|watch|webcam|weber|website|wedding|wf|whoswho|wiki|win|wine|work|works|world|ws|wtf|xin|xyz|yahoo|yandex|ye|yoga|yt|za|zip|zm|zone|zw|бел|дети|москва|онлайн|орг|рус|рф|сайт|укр|भारत|বাংলা|გე|닷컴|한국)(?!\.(?:\w|[^\s -«»‘’“”]|%[0-9a-f][0-9a-f])|(?:\w|[^\s -«»‘’“”]|%[0-9a-f][0-9a-f])(?:\w|[^\s -«»‘’“”]|%[0-9a-f][0-9a-f]|-)*(?:\w|[^\s -«»‘’“”]|%[0-9a-f][0-9a-f])))(?:(?!(?:\w|[^\s -«»‘’“”]|%[0-9a-f][0-9a-f])|(?:\w|[^\s -«»‘’“”]|%[0-9a-f][0-9a-f])(?:\w|[^\s -«»‘’“”]|%[0-9a-f][0-9a-f]|-)*(?:\w|[^\s -«»‘’“”]|%[0-9a-f][0-9a-f]))|(?=_))(?:(?=[^:/?#])|(:\d{1,5})?(\/(?:\w|[^\s -«»‘’“”]|%[0-9a-f][0-9a-f]|[^\s%])*?)?(\?(?![+@!.?,(\[{<«‘“:]*(?!(?:\w|[^\s -«»‘’“”]|%[0-9a-f][0-9a-f]|[^\s%])|#))(?:\w|[^\s -«»‘’“”]|%[0-9a-f][0-9a-f]|[^\s%])*?)?(#(?:\w|[^\s -«»‘’“”]|%[0-9a-f][0-9a-f]|[^\s%])*?)?(?=[+@!.?,(\[{<«‘“:]*(?!(?:\w|[^\s -«»‘’“”]|%[0-9a-f][0-9a-f]|[^\s%])|#)))/gi;
        const verifyRegex = /\.(?:abbott|abudhabi|ac|academy|ad|adult|ae|aero|af|africa|ag|agency|ai|al|alsace|am|amsterdam|ao|app|apple|ar|archi|army|art|as|asia|associates|at|attorney|au|auction|audi|audio|auto|aw|aws|ax|axa|az|ba|baby|band|bank|bar|barcelona|barclaycard|barclays|basketball|bb|bd|be|beer|berlin|best|bet|bf|bg|bh|bi|bible|bid|bike|bio|biz|bj|black|blog|blue|bm|bn|bnpparibas|bo|bot|boutique|box|br|bradesco|broker|brother|brussels|bs|bt|build|builders|business|buzz|bw|by|bz|bzh|ca|cab|cafe|cam|camera|camp|canon|capital|car|cards|care|careers|cars|casa|cash|casino|cat|cc|cd|center|ceo|cern|cf|cg|ch|chat|cheap|chrome|church|ci|city|ck|cl|claims|cleaning|click|clinic|clothing|cloud|club|cm|cn|co|coach|codes|coffee|college|com|community|company|computer|construction|consulting|contractors|cool|coop|coupons|courses|cr|credit|cricket|cruises|cu|cv|cw|cx|cy|cymru|cz|dance|date|dating|de|deals|delivery|dental|dentist|desi|design|dev|dhl|diamonds|diet|digital|direct|directory|discount|dj|dk|dm|do|doctor|dog|domains|download|dz|earth|ec|eco|edu|education|ee|eg|email|energy|engineering|enterprises|equipment|es|estate|et|eu|eus|events|exchange|expert|exposed|express|fail|faith|family|fan|fans|farm|fashion|fi|film|finance|financial|fish|fishing|fit|fitness|fj|flights|flowers|fm|fo|football|forex|forsale|foundation|fr|frl|fun|fund|furniture|futbol|fyi|ga|gal|gallery|game|games|garden|gd|gdn|ge|gf|gg|gh|gi|gift|gifts|gives|gl|glass|gle|global|gm|gn|gold|golf|goog|google|gov|gp|gq|gr|graphics|gratis|green|group|gs|gt|guide|guitars|guru|gy|haus|health|healthcare|help|here|hermes|hitachi|hk|hn|hockey|holdings|holiday|honda|horse|hospital|host|hosting|hot|house|how|hr|ht|hu|icu|id|ie|il|im|immo|in|inc|industries|info|ink|institute|insure|int|international|investments|io|ipiranga|iq|ir|irish|is|ist|istanbul|it|jcb|je|jewelry|jio|jll|jm|jo|jobs|jp|ke|kg|kh|ki|kim|kitchen|kiwi|kn|komatsu|kp|kpmg|kr|krd|kred|kw|ky|kyoto|kz|la|land|lat|law|lawyer|lb|lc|lease|leclerc|legal|lgbt|li|life|lighting|limited|limo|link|live|lk|llc|loan|loans|lol|london|love|lr|ls|lt|ltd|ltda|lu|luxe|luxury|lv|ly|ma|madrid|makeup|management|market|marketing|markets|mba|mc|md|me|media|melbourne|men|menu|mg|mil|mk|ml|mm|mn|mo|mobi|moda|moe|moi|mom|monash|money|monster|mortgage|moscow|movie|mp|mq|mr|ms|mt|mu|museum|mv|mw|mx|my|mz|na|nagoya|name|nc|ne|net|network|neustar|new|news|nf|ng|ngo|ni|nikon|ninja|nl|no|np|nrw|ntt|nu|nyc|nz|observer|office|okinawa|om|one|ong|onl|online|ooo|org|organic|ovh|pa|page|paris|partners|parts|party|pe|pet|pf|pg|ph|pharmacy|photo|photography|photos|physio|pics|pictet|pictures|pink|pioneer|pizza|pk|pl|place|plumbing|plus|pm|pn|poker|porn|post|pr|press|pro|prod|productions|promo|properties|property|ps|pt|pub|pw|py|qa|quebec|racing|radio|re|realestate|realtor|realty|recipes|red|reisen|ren|rent|rentals|repair|report|rest|restaurant|review|reviews|rich|rio|rip|ro|rocks|rodeo|rs|ru|rugby|run|rw|sa|saarland|sale|salon|sap|saxo|sb|sbi|sc|school|schule|science|scot|sd|se|security|services|ses|sex|sexy|sg|sh|sharp|shiksha|shoes|shop|shopping|show|si|singles|site|sk|ski|sl|sm|sn|sncf|so|soccer|social|softbank|software|solar|solutions|sony|soy|space|sport|spot|sr|st|stockholm|storage|store|stream|studio|study|style|su|supply|support|surf|sv|swiss|sx|sy|sydney|systems|sz|taipei|tatar|tattoo|tax|taxi|tc|td|team|tech|technology|tel|tf|tg|th|theater|tickets|tips|tj|tk|tl|tm|tn|to|today|tokyo|tools|top|total|tours|town|toyota|toys|tr|trade|trading|training|travel|trust|tt|tube|tv|tw|tz|ua|ug|uk|university|uno|uol|us|uy|uz|va|vacations|vanguard|vc|ve|vegas|ventures|vet|vg|vi|video|vin|vip|vision|vlaanderen|vn|vote|voyage|vu|wales|wang|watch|webcam|weber|website|wedding|wf|whoswho|wiki|win|wine|work|works|world|ws|wtf|xin|xyz|yahoo|yandex|ye|yoga|yt|za|zip|zm|zone|zw|бел|дети|москва|онлайн|орг|рус|рф|сайт|укр|भारत|বাংলা|გე|닷컴|한국)/i;

        if (!verifyRegex.test(text)) {
            return text;
        }

        return text.replace(urlRegex, function (url) {
            url = url.trim();
            let href = url;

            if (url.match(/@/)) {
                href = `mailto:${url}`;
            } else if (!url.match(/http/i)) {
                href = `http://${url}`;
            }

            if (url.includes('chat.whatsapp')) {
                return `<a href="#" @click="groupInviteLinkClick('${url}')">${unescape(url)}</a><hr/><button class="btn btn-block" style="color: #0056b3;flex-grow: 1;overflow: hidden;font-size: 14px;line-height: 20px;text-overflow: ellipsis;white-space: nowrap;" @click="groupViewInfo('${url}')">Ver Grupo</button></br>`;
            }

            return `<a href="${href}" target="_blank">${unescape(url)}</a></br>`;
        });
    },

    linkify (inputText) {
        let replacedText, replacePattern1, replacePattern2, replacePattern3;

        // URLs starting with http://, https://, or ftp://
        replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim;
        replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

        // URLs starting with "www." (without // before it, or it'd re-link the ones done above).
        replacePattern2 = /(^|[^/])(www\.[\S]+(\b|$))/gim;
        replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

        // Change email addresses to mailto:: links.
        replacePattern3 = /(([a-zA-Z0-9\-_.])+@[a-zA-Z_]+?(\.[a-zA-Z]{2,6})+)/gim;
        replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

        return replacedText;
    },

    formatMsg (text) {
        text = escape(text);
        text = this.urlify(text);
        text = this.formatStyle(text);
        return text;
    },

    formatStyle (msg) {
        let regex1 = new RegExp(/(?:^|[\s\W_])\*(\S|\S[^\n]*?\S)\*(?=$|[[\s\W_])/g);
        msg = msg.replace(regex1, function (match, p1, p2, p3, offset, string) {
            if (match.charAt(0) === '*') {
                return `<strong>${p1}</strong>`;
            }
            return `${match.charAt(0)}<strong>${p1}</strong>`;
        });

        regex1 = new RegExp(/```([\s\S]*?\S[\s\S]*?)```/g);

        msg = msg.replace(regex1, function (match, p1, p2, p3, offset, string) {
            if (match.charAt(0) === '`') {
                return `<pre>${p1}</pre>`;
            }
            return `${match.charAt(0)}<pre>${p1}</pre>`;
        });

        regex1 = new RegExp(/(?:^|[\s\W_])_(\S|\S[^\n]*?\S)_(?=$|[[\s\W_])/g);

        msg = msg.replace(regex1, function (match, p1, p2, p3, offset, string) {
            if (match.charAt(0) === '_') {
                return `<i>${p1}</i>`;
            }
            return `${match.charAt(0)}<i>${p1}</i>`;
        });

        regex1 = new RegExp(/(?:^|[\s\W_])~(\S|\S[^\n]*?\S)~(?=$|[[\s\W_])/g);

        msg = msg.replace(regex1, function (match, p1, p2, p3, offset, string) {
            if (match.charAt(0) === '~') {
                return `<del>${p1}</del>`;
            }
            return `${match.charAt(0)}<del>${p1}</del>`;
        });

        return (msg);
    }
};
