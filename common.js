(function () {

if (typeof exports == 'undefined')
    exports = window;

exports.USERNAME_LENGTH = 30;
exports.MESSAGE_LENGTH = 120;
exports.CHAT_HISTORY = 40;

exports.parseBlack = function (black) {
    var info = {card: black};
    info.text = black.replace(/_/g, '__________');
    var tokens = black.split(/(_)/g);
    info.blankCount = (tokens.length-1)/2 || 1;
    for (var i = 1; i < tokens.length; i += 2) {
        var blank = {};
        var before = tokens[i-1], after = tokens[i+1];
        if (before.match(/\b(?:the|a|an|my|your|yo'|his|her|their)\s+$/i))
            blank.omitArticle = true;
        if (before.match(/\bbeing\s+$/i))
            blank.omitBeing = true;
        if (after)
            blank.omitPeriod = true;
        tokens[i] = blank;
    }
    info.tokens = tokens;

    var skipQuestion = false;
    if (tokens.length == 1)
        skipQuestion = true;

    info.skipQuestion = skipQuestion;
    return info;
};

var ABBREV = 60;

exports.applySubmission = function (black, sub, abbrev) {
    var bits = [];
    var first = black.tokens[0];
    if (!abbrev)
        bits.push(first + (black.skipQuestion ? ' ' : ''));
    else if (!black.skipQuestion)
        bits.push(first.length > ABBREV ? '[...] ' : first);

    var whites = sub.cards;
    for (var i = 0; i < whites.length; i++) {
        var white = whites[i];
        var blank = black.tokens[i*2 + 1] || {};
        if (blank.omitBeing) {
            var beingSkip = white.match(/^being\s+(.+)$/i);
            if (beingSkip)
                white = beingSkip[1];
        }
        if (blank.omitArticle) {
            var articleSkip = white.match(/^(?:the|a|an|my|your)\s+(.+)$/i);
            if (articleSkip)
                white = articleSkip[1];
        }
        if (blank.omitPeriod)
            white = white.replace(/[.]$/, '');

        bits.push({white: white});

        var next = black.tokens[i*2 + 2];
        if (next)
            bits.push((abbrev && next.length > ABBREV) ? ' [...] ' : next);
    }

    return bits;
};

exports.randomId = function () {
        return '' + (Math.floor(Math.random() * 1e16) + 1);
};

})();
