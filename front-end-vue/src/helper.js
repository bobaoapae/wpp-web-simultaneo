export const msg = {
    formatMsg(msg) {
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