
window.addEventHandle=addEventHandle;//addEventListener
//例子:addEventHandle(document,"click",fn,Bool) Bool默认false
//注意ie8的attachEvent fn执行顺序相反 后绑定,先执行

window.removeEventHandle=removeEventHandle;//removeEventListener
//例子:removeEventHandle(document,"click",fn,Bool) Bool默认false

window.eventDelegate=eventDelegate;//e.target 委托
//例子:eventDelegate('#list', 'li', 'click', function () { console.log(this); });

function addEventHandle(target,type,fn,Bool=false) {
    if (target.addEventListener)    target.addEventListener(type,fn,Bool);
    else    target.attachEvent("on"+type,fn);
}

function removeEventHandle(target,type,fn,Bool=false) {
    if(target.removeEventListener)  target.removeEventListener(type,fn,Bool);
    else    target.detachEvent("on"+type,fn);
}

//事件委托-兼容

function eventDelegate (parentSelector,targetSelector,events,foo) {
    // 触发执行的函数
    function triFunction (e) {
        // 兼容性处理
        var event = e || window.event;

        // 获取到目标阶段指向的元素
        var target = event.target || event.srcElement;

        // 获取到代理事件的函数
        var currentTarget = event.currentTarget;

        // 处理 matches 的兼容性
        if (!Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.matchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector ||
                Element.prototype.oMatchesSelector ||
                Element.prototype.webkitMatchesSelector ||
                function(s) {
                    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                        i = matches.length;
                    while (--i >= 0 && matches.item(i) !== this) {}
                    return i > -1;
                };
        }

        // 遍历外层并且匹配
        while (target !== currentTarget) {
            // 判断是否匹配到我们所需要的元素上
            if (target.matches(targetSelector)) {
                var sTarget = target;
                // 执行绑定的函数，注意 this
                foo.call(sTarget, Array.prototype.slice.call(arguments))
            }

            target = target.parentNode;
        }
    }

    // 如果有多个事件的话需要全部一一绑定事件
    events.split('.').forEach(function (evt) {
        // 多个父层元素的话也需要一一绑定
        Array.prototype.slice.call(document.querySelectorAll(parentSelector)).forEach(
            function ($p) {$p.addEventHandle(evt, triFunction);
        });
    });
}
