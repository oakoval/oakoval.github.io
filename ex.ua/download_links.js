function download_links() {
    var filter = /\.(mkv|avi)$/;
    var $select = open(null, 'select', 'menubar=no,resizable=1,location=no,scrollbars=no,status=no,width=600');
    //$select.resizeTo(600, 800);
    $select.document.title = 'Виберіть файли';
    var links = document.querySelectorAll('table a[title][rel=nofollow]');
    var $style = document.createElement('style');
    $style.setAttribute('type', 'text/css');
    $style.innerHTML = 'label, button {display:block}';
    $select.document.head.appendChild($style);
    for(var i=0; i<links.length; i++) {
        var t = links[i].innerHTML;
        if (t.match(filter)) {
            var $label = document.createElement('label');
            var $input = document.createElement('input');
            $input.setAttribute('type', 'checkbox');
            $input.setAttribute('value', links[i].href);
            $input.setAttribute('checked', 'checked');
            $label.appendChild($input);
            $label.appendChild(document.createTextNode(t));
            $select.document.body.appendChild($label);
        }
    }
    var $submit = document.createElement('button');
    $submit.innerHTML = 'Отримати список посилань';
    $submit.onclick = function() {
        var links = $select.document.querySelectorAll('input[type=checkbox]:checked');
        var list = [];
        for(var i=0; i<links.length; i++)
            list.push(links.item(i).getAttribute('value'));
        function open_in_window(e) {
            if (e) console.log(e);
            open().document.write(list.join('<br/>'));
        }
        var requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        if (requestFileSystem)
            requestFileSystem(TEMPORARY, 1024*64, function(fs) {
                fs.root.getFile('list.txt', {create:true}, function(f) {
                    f.createWriter(function(w) {
                        w.onwriteend = function() {
                            open(f.toURL());
                        };
                        w.onerror = open_in_window;
                        var blob = new Blob([list.join('\n')], {type : 'text/pain'});
                        w.write(blob);
                    })
                }, open_in_window);
            }, open_in_window);
        else
            open_in_window();
        $select.close();
    };
    $select.document.body.appendChild($submit);
}
download_links();