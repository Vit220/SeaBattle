var dragManager = new function() {


    var dragObject = {};

    var self = this,
        $class,
        height,
        width;




    function onMouseDown(e){
        e = fixEvent(e);

        console.log("drag");
        $(document).mousedown(function (e) {
          // console.log($(document));
            if ((e.which == 3)) {

                $class = $("."+ e.target.className);

                height = $class.css('height');
                width = $class.css('width');

                $class.css('height', width)
                    .css('width', height);

                return false;
            }
        });

        if (e.which != 1) return;

        var elem = findDraggable(e);
        if (!elem) return;

        dragObject.elem = elem;


        dragObject.downX = e.pageX;
        dragObject.downY = e.pageY;

        return false;
    }

    function onMouseMove(e) {
        if (!dragObject.elem) return; // элемент не зажат

        e = fixEvent(e);
       // moveAt(e);

        if ( !dragObject.avatar ) { // если перенос не начат...
            var moveX = e.pageX - dragObject.downX;
            var moveY = e.pageY - dragObject.downY;

            // если мышь передвинулась в нажатом состоянии недостаточно далеко
            if ( Math.abs(moveX) < 3 && Math.abs(moveY) < 3 ) {
                return;
            }

            // начинаем перенос
            dragObject.avatar = createAvatar(e); // создать аватар
            if (!dragObject.avatar) { // отмена переноса, нельзя "захватить" за эту часть элемента
                dragObject = {};
                return;
            }

            // аватар создан успешно
            // создать вспомогательные свойства shiftX/shiftY
            var coords = getCoords(dragObject.avatar);
            dragObject.shiftX = dragObject.downX - coords.left;
            dragObject.shiftY = dragObject.downY - coords.top;

            startDrag(e); // отобразить начало переноса
        }


        // отобразить перенос объекта при каждом движении мыши
        dragObject.avatar.style.left = e.pageX - dragObject.shiftX + 'px';
        dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px';

        return false;
    }
   /* function moveAt(e) {
        self.style.left = e.pageX-25+'px';
        self.style.top = e.pageY-25+'px';
    }*/

    function onMouseUp(e) {
        if (dragObject.avatar) { // если перенос идет
            e = fixEvent(e);
            if (e.which != 1 ) { // не левой кнопкой
                return false;
            }
            //if(e.which == 1){
                finishDrag(e);
            //}

        }

        // перенос либо не начинался, либо завершился
        // в любом случае очистим "состояние переноса" dragObject
        dragObject = {};
    }

    function finishDrag(e) {
        var dropElem = findDroppable(e);

        if (!dropElem) {
            self.onDragEnd(dragObject, dropElem);
        } else {
            self.onDragEnd(dragObject, dropElem);
        }
    }

    function createAvatar(e) {

        // запомнить старые свойства, чтобы вернуться к ним при отмене переноса
        var avatar = dragObject.elem;
        var old = {
            parent: avatar.parentNode,
            nextSibling: avatar.nextSibling,
            position: avatar.position || '',
            left: avatar.left || '',
            top: avatar.top || '',
            zIndex: avatar.zIndex || ''
        };

        // функция для отмены переноса
        avatar.rollback = function() {
            old.parent.insertBefore(avatar, old.nextSibling);
            avatar.style.position = old.position;
            avatar.style.left = old.left;
            avatar.style.top = old.top;
            avatar.style.zIndex = old.zIndex
        };

        return avatar;
    }

    function startDrag(e) {
        var avatar = dragObject.avatar;

        // инициировать начало переноса
        document.body.appendChild(avatar);
        avatar.style.zIndex = 9999;
        avatar.style.position = 'absolute';
    }

    function findDraggable(event) {
        var elem = event.target;
        while(elem != document && elem.getAttribute('draggable') == null) {
            elem = elem.parentNode;
        }
        return elem == document ? null : elem;
    }

    function findDroppable(event) {

        var elem = getElementUnderClientXY(dragObject.avatar, event.clientX, event.clientY);

        while(elem != document && elem.getAttribute('droppable') == null) {
            elem = elem.parentNode;
        }

        return elem == document ? null : elem;
    }

    document.onmousemove = onMouseMove;
    document.onmouseup = onMouseUp;
    document.onmousedown = onMouseDown;

    this.onDragEnd = function(dragObject, dropElem) { };
    this.onDragCancel = function(dragObject) { };

};
