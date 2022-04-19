var a = observable(0);
bindInnerHTML(document.getElementById("testheader"), a);

var b = observable(0);
bindInnerHTML(document.getElementById("testparagraph"), b);

a("H1 Bound by JS!");
