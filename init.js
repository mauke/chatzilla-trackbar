/* vi: set sw=4 et sts=4: */
// fake plugin.id = 'trackbar'
plugin.major = 0;
plugin.minor = 8;
plugin.version = plugin.major + '.' + plugin.minor;
plugin.id = 'trackbar';
plugin.description = "draws a bar each time you switch away from a tab to mark your position";

function plug(name) {
    return plugin.id + ':' + name;
}

const marker = plug('marker');

function mk_msg_row(c) {
    var ns = 'http://www.w3.org/1999/xhtml';
    var td = document.createElementNS(ns, 'html:td');
    td.setAttribute ('colspan', '3');
    if (typeof c === 'object') {
        if (c.nodeType === undefined) {
            c = document.createElementNS(ns, 'html:' + c.tag);
        }
    } else {
        c = document.createTextNode(c);
    }
    td.appendChild(c);
    var tr = document.createElementNS(ns, 'html:tr');
    tr.setAttribute('class', 'msg');
    tr.appendChild(td);
    return tr;
}

plugin.init = function init() {
};

plugin.enable = function enable() {
    client.commandManager.addHook(
        'set-current-view',
        function (e) {
            var cur = client.currentObject;
            if (cur == e.view) return;
            if (cur.TYPE !== 'IRCChannel' && cur.TYPE !== 'IRCUser') return;
            var row = mk_msg_row({tag: 'hr'});
            row.setAttribute('msg-type', plugin.id);
            var old = cur[marker];
            if (old && old.parentNode) {
                old.parentNode.removeChild(old);
            }
            cur[marker] = row;
            addHistory(cur, row, false);
        },
        plug('set-current-view'),
        /*before:*/ true
    );
    return true;
};

plugin.disable = function disable() {
    client.commandManager.removeHook(
        'set-current-view',
        plug('set-current-view'),
        /*before: */ true
    );
    return true;
};
