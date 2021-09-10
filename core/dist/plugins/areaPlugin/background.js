var Background = /** @class */ (function () {
    function Background(editor, element) {
        if (!element)
            return;
        var el = element instanceof HTMLElement ? element : document.createElement('div');
        el.classList += " rete-background " + (element === true ? 'default' : '');
        editor.view.area.appendChild(el);
    }
    return Background;
}());
export { Background };
