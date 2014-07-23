var base_url = 'https://github.com/mygetlist/pin/blob/e8d7757fc7b0800fddee76642c302fb13383ad4a/';
function linkify(start, el) {
    var text = el.text().trim();
    var url = start + text;
    el.empty();
    $('<a target="_blank"></a>')
        .attr('href', url)
        .text(text)
        .appendTo(el);
    return el;
}

$(document).ready(function() {
    $('dt').each(function(_, dt) {
        dt = $(dt);
        var url = base_url + dt.text();
        dt.next('dd').find('tr').each(function(_, row) {
            row = $(row);
            var cell = row.find('td:first-child');
            linkify(url + '#L', cell)
        });
    });
    $('dl').accordion({
        collapsible: true,
        heightStyle: "content",
        active: -1
    });
});

