function openMethod() {
    var hash = location.hash.slice(1);
    $('dt code').each(function(i, el) {
        if (hash == el.innerHTML) {
            $('dl').accordion({active: i});
            hash = null;
        }
    });

    if (hash)
        $('dt').each(function(i, el) {
            if (hash == $(el).text())
                $('dl').accordion({active: i});
        });
}

$(function() {
    $('dl').accordion({
        collapsible: true,
        heightStyle: "content",
        active: -1,
        activate: function(e, ui) {
            var method = ui.newHeader.find('code').html();
            if (!method)
                method = ui.newHeader.text();
            history.pushState(null, method, '#' + method);
        }
    });
    $('dd').each(function(_, el) {
        var $el = $(el);
        if ($el.text().indexOf('logintoken') >=0)
            el.previousElementSibling.appendChild($('<img src="../img/key.png">')[0]);
//                $el.find('ul:first-child li').each(function(i, e) {
//
//                });
        if($el.find('em').length)
            el.previousElementSibling.appendChild($(
                $el.find('em.error').length
                    ? '<span class="error">\u2620</span>'
                    : '<span>\u26A0</span>'
            )[0]);
    });
    if (location.hash)
        openMethod();
    $(window).on('hashchange', openMethod);



//    $('#query_form').dialog({
//        position: {
//            at: "right top"
//        }
//    });
});