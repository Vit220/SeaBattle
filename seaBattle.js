var seaBattle = {
    ships: [
        {
            name: "0",
            life: [],
            deadArea: [],
            lifeTwo: [],
            deadAreaTwo: []
        },
        {
            name: "1",
            life: [],
            deadArea: [],
            lifeTwo: [],
            deadAreaTwo: []
        },
        {
            name: "2",
            life: [],
            deadArea: [],
            lifeTwo: [],
            deadAreaTwo: []
        },
        {
            name: "3",
            life: [],
            deadArea: [],
            lifeTwo: [],
            deadAreaTwo: []
        },
        {
            name: "4",
            life: [],
            deadArea: [],
            lifeTwo: [],
            deadAreaTwo: []
        },
        {
            name: "5",
            life: [],
            deadArea: [],
            lifeTwo: [],
            deadAreaTwo: []
        },
        {
            name: "6",
            life: [],
            deadArea: [],
            lifeTwo: [],
            deadAreaTwo: []
        },
        {
            name: "7",
            life: [],
            deadArea: [],
            lifeTwo: [],
            deadAreaTwo: []
        },
        {
            name: "8",
            life: [],
            deadArea: [],
            lifeTwo: [],
            deadAreaTwo: []
        },
        {
            name: "9",
            life: [],
            deadArea: [],
            lifeTwo: [],
            deadAreaTwo: []
        }
    ],

    verifiedCoordinates: [],                                                                                             //кооры которые уже использовались

    tryCoordinates: [],                                                                                                  //текущий подбитый корабль

    checkForZeroArray: function (arr) {
        var array = arr;
        for (var i = 0; i < array.length; i++) {
            if (array[i] !== 0) {
                return false;
            }
        }
        return true;

    },

    afterMiss: function (param) {
        var self = this,
            td = param.className.split(" "),
            miss = td[0].split("_");

        self.message("Вы стреляете в " + miss[0] + "-" + miss[1] + " - промазали!", 1);
    },

    verificationAfterFire: function (param, playerOneOrTwo) {                                                           //добавляет промахи вокруг убитого коробля
        var self = this,
            $playerOne,
            $playerTwo,
            arrZero,
            td = param;
        for (var i = 0; i < self.ships.length; i++) {
            if (playerOneOrTwo === 2) {
                for (var j = 0; j < self.ships[i].lifeTwo.length; j++) {
                    if ($(td).hasClass(self.ships[i].lifeTwo[j])) {

                        var message = self.ships[i].lifeTwo[j].split("_");
                        self.message("Вы стреляете в " + message[0] + "-" + message[1] + " - попали!", 1);

                        self.ships[i].lifeTwo[j] = 0;
                        arrZero = self.checkForZeroArray(self.ships[i].lifeTwo);
                        if (arrZero) {
                            $playerTwo = $("#playerTwo");
                            for (var s = 0; s < self.ships[i].deadAreaTwo.length; s++) {
                                $playerTwo.find("." + self.ships[i].deadAreaTwo[s]).addClass("miss");
                            }
                        }
                    }
                }
            }
            for (var r = 0; r < self.ships[i].life.length; r++) {
                if (td == self.ships[i].life[r]) {
                    self.tryCoordinates = [];
                    self.tryCoordinates.push(i);
                    self.tryCoordinates.push(self.ships[i].life[r]);
                    self.ships[i].life[r] = 0;

                    arrZero = self.checkForZeroArray(self.ships[i].life);
                    if (arrZero) {
                        self.tryCoordinates = [];
                        $playerOne = $("#playerOne");
                        for (var t = 0; t < self.ships[i].deadArea.length; t++) {
                            self.verifiedCoordinates.push(self.ships[i].deadArea[t]);
                            $playerOne.find("." + self.ships[i].deadArea[t]).addClass("miss");
                        }
                    }
                }
            }
        }
    },

    checkFinal: function (param) {
        var self = this,
            final = false,
            playerOneOrTwo,
            $playerTwo;

        for (var i = 0; i < self.ships.length; i++) {
            if (!param) {
                playerOneOrTwo = self.ships[i].life;
            } else {
                playerOneOrTwo = self.ships[i].lifeTwo;
            }
            if (self.checkForZeroArray(playerOneOrTwo)) {
                final = true;
            } else {
                final = false;
                break;
            }
        }
        if (final) {
            if (!param) {
                $playerTwo = $("#playerTwo");
                for (var g = 0; g < self.ships.length; g++) {
                    for (var n = 0; n < self.ships[g].lifeTwo.length; n++) {
                        $playerTwo.find('.' + self.ships[g].lifeTwo[n]).addClass("sheep").not('.fire');

                    }
                }
                alert("losing");
            } else {

                alert("win");
            }
        }
    },

    randomFire: function () { //ход бота
        var self = this,
            randomX,
            randomY,
            randomXY,
            numShip,
            wounded = false,
            $player;

        function fun() {
            self.randomFire();
        }

        function ifAllZeroArr(array) {
            var start = array.indexOf(0),
                l = array.length,
                i = 1;

            if (start === -1) {
                // nothing found
                return null;
            }

            while (true) {
                var left = start - i,
                    rigth = start + i;
                if (left >= 0 && array[left] !== 0) {
                    return array[left];
                }
                if (rigth <= l - 1 && array[rigth] !== 0) {
                    return array[rigth];
                }
                // return null end is rich
                if (left < 0 && rigth > l - 1) {
                    return null;
                }
                i++;
            }
        }

        function findTwoZero(arr) {

            var array = arr,
                arrayResult = [];

            for (var i = 0; i < array.length; i++) {
                if (array[i] === 0) {
                    arrayResult.push(array[i]);

                }
            }

            if (arrayResult.length > 1) {
                return true;
            }

            return false;


        }

        if (self.tryCoordinates.length == 0) {                                                                           // если послд ход промазал или убил
            randomX = self.randomNumber(1, 10);
            randomY = self.randomNumber(1, 10);
            randomXY = randomX + "_" + randomY;
        } else {
            numShip = self.tryCoordinates[0];
            if (!findTwoZero(self.ships[numShip].life)) {
                wounded = true;
                var shipXY = self.tryCoordinates[1];
                var coordinate = shipXY.split("_");
                switch (self.randomNumber(1, 4)) {
                    case 1:
                    {
                        if (randomX < 10 && randomX >= 1) {
                            randomX = +coordinate[0] + 1;
                        } else {
                            randomX = +coordinate[0] - 1;
                        }
                        randomY = coordinate[1];
                        break;
                    }
                    case 2:
                    {
                        if (randomX <= 10 && randomX > 1) {
                            randomX = +coordinate[0] - 1;
                        } else {
                            randomX = +coordinate[0] + 1;
                        }
                        randomY = coordinate[1];
                        break;
                    }
                    case 3:
                    {
                        if (randomY <= 10 && randomY > 1) {
                            randomY = +coordinate[0] - 1;
                        } else {
                            randomY = +coordinate[1] + 1;
                        }
                        randomX = coordinate[0];
                        break;
                    }
                    case 4:
                    {
                        if (randomY < 10 && randomY >= 1) {
                            randomY = +coordinate[0] + 1;
                        } else {
                            randomY = +coordinate[1] - 1;
                        }
                        randomX = coordinate[0];
                        break;
                    }
                }
                if (randomX > 10 || randomX < 1 || randomY > 10 || randomY < 1) {
                    self.randomFire();
                    return
                } else {
                    randomXY = randomX + "_" + randomY;
                }
            } else {
                randomXY = ifAllZeroArr(self.ships[numShip].life);
                var xAndY = randomXY.split("_");
                randomX = xAndY[0];
                randomY = xAndY[1];
                if (randomXY === null) {
                    self.tryCoordinates = [];
                    self.randomFire();
                    return
                }
            }
        }
        for (var i = 0; i < self.verifiedCoordinates.length; i++) {                                                     //не повторять выстрел в 1 точку
            if (self.verifiedCoordinates[i] == randomXY) {
                self.randomFire();
                return
            }
        }
        self.verifiedCoordinates.push(randomXY);

        $player = $("#playerOne").find("." + randomXY);
        if ($player.hasClass("sheep")) {
            $player.addClass("fire");
            self.message("Противник стреляет в " + randomX + "-" + randomY + " - попал!");
            self.verificationAfterFire(randomXY, 1);
            setTimeout(fun, 100);

        } else {
            $player.addClass("miss");
            self.message("Противник стреляет в " + randomX + "-" + randomY + " - промазал!");
            if (!wounded) {                                                                                              //если корабль убит весь
                self.tryCoordinates = [];
            }
        }
    },

    message: function (text, param) {
        var div,
            p,
            line,
            firstP;

        div = document.getElementById("logForSeaBattle");
        p = document.createElement('p');
        line = document.createElement('h');
        firstP = div.getElementsByTagName('p')[0];
        p.innerHTML = text;
        line.innerHTML = "---------------------------------";
        if (param === 1) {
            p.className = "colorBrown";
        } else {
            p.className = "colorCoral";
        }
        div.insertBefore(p, firstP);
        div.insertBefore(line, firstP);
    },


    randomNumber: function (min, max) {
        var rand = min + Math.random() * (max + 1 - min);
        rand = rand ^ 0;                                                                                                // округление битовым оператором
        return rand;
    },

    arrShips: function (arr, param, playerOneOrTwo) {
        var numbXY = param,
            test,
            self = this;
        for (var j = 0; j < self.ships.length; j++) {
            if ("life" === arr) {
                if (playerOneOrTwo === "#playerOne") {
                    test = self.ships[j].life;
                } else {
                    test = self.ships[j].lifeTwo;
                }
            } else {
                if (playerOneOrTwo === "#playerOne") {
                    test = self.ships[j].deadArea;
                } else {
                    test = self.ships[j].deadAreaTwo;
                }
            }

            for (var i = 0; i < test.length; i++) {
                if (numbXY === test[i]) {
                    return true;
                }
            }
        }
        return false;
    },

    randomLocation: function (maxLengthShip, numberShip, playerOneOrTwo) {
        var self = this;
        var randomX,
            randomY,
            randomXY,
            numbXY,
            lifeOneOrTwo,
            test,
            tdClass,
            deadAreaOneOrTwo,
            $player;
        randomX = self.randomNumber(1, 10);
        randomY = self.randomNumber(1, 10);
        numbXY = randomY + "_" + randomX;

        $player = $(playerOneOrTwo);

        if (playerOneOrTwo === "#playerOne") {
            self.ships[numberShip].life = [];
            self.ships[numberShip].deadArea = [];
            lifeOneOrTwo = self.ships[numberShip].life;
            deadAreaOneOrTwo = self.ships[numberShip].deadArea;

        } else {
            self.ships[numberShip].lifeTwo = [];
            self.ships[numberShip].deadAreaTwo = [];
            lifeOneOrTwo = self.ships[numberShip].lifeTwo;
            deadAreaOneOrTwo = self.ships[numberShip].deadAreaTwo;
        }

        if (self.arrShips("life", numbXY, playerOneOrTwo) || self.arrShips("deadArea", numbXY, playerOneOrTwo)) {
            lifeOneOrTwo = [];
            return self.randomLocation(maxLengthShip, numberShip, playerOneOrTwo);
        }


        function findCoor(param, xOrY, playerOneOrTwo) {
            var tdClass,
                numbXY;
            if (xOrY === 1) {
                for (var k = 1; k < maxLengthShip; k++) {
                    if (param == true) {
                        randomY--;
                    } else {
                        randomY++;
                    }
                    numbXY = randomY + "_" + randomX;
                    tdClass = $player.find("." + numbXY);
                    if (self.arrShips("deadArea", numbXY, playerOneOrTwo)) {
                        return self.randomLocation(maxLengthShip, numberShip, playerOneOrTwo);
                    }
                    lifeOneOrTwo.push(+randomY + "_" + randomX);
                    test = [1, param];
                }
            } else {
                for (var d = 1; d < maxLengthShip; d++) {
                    if (param == true) {
                        randomX--;
                    } else {
                        randomX++;
                    }
                    numbXY = randomY + "_" + randomX;
                    tdClass = $player.find("." + numbXY);
                    if (self.arrShips("deadArea", numbXY, playerOneOrTwo)) {
                        return self.randomLocation(maxLengthShip, numberShip, playerOneOrTwo);
                    }
                    lifeOneOrTwo.push(+randomY + "_" + randomX);
                    test = [2, param];
                }
            }
        }

        randomXY = self.randomNumber(1, 2);                                                                             //в какой плоскости будет корабль
        lifeOneOrTwo.push(+randomY + "_" + randomX);

        if (randomXY === 1) {
            if (randomY >= 5) {
                findCoor(true, 1, playerOneOrTwo);
            } else {
                findCoor(false, 1, playerOneOrTwo);
            }

        } else {
            if (randomX >= 5) {
                findCoor(true, 2, playerOneOrTwo);
            } else {
                findCoor(false, 2, playerOneOrTwo);
            }
        }


        var one = lifeOneOrTwo[0],
            two = lifeOneOrTwo[1],
            three = lifeOneOrTwo[2],
            four = lifeOneOrTwo[3];
        self.addClass(lifeOneOrTwo, maxLengthShip, $player, test, playerOneOrTwo);

        self.deadZone(numberShip, randomXY, playerOneOrTwo);
    },

    addClass: function (lifeOneOrTwo, maxLengthShip, $player, test, playerOneOrTwo) {
        var one = lifeOneOrTwo[0],
            two = lifeOneOrTwo[1],
            three = lifeOneOrTwo[2],
            four = lifeOneOrTwo[3];
        if (playerOneOrTwo === "#playerTwo") {
            return;
        }
        if (lifeOneOrTwo.length == maxLengthShip) {
            switch (lifeOneOrTwo.length) {
                case 4 :
                {
                    if (test[0] === 2) {
                        if (test[1]) {
                            $player.find('.' + one).addClass("sheep").addClass("four_1");
                            $player.find('.' + two).addClass("sheep").addClass("four_2");
                            $player.find('.' + three).addClass("sheep").addClass("four_3");
                            $player.find('.' + four).addClass("sheep").addClass("four_4");
                        } else {
                            $player.find('.' + one).addClass("sheep").addClass("four_1left");
                            $player.find('.' + two).addClass("sheep").addClass("four_2left");
                            $player.find('.' + three).addClass("sheep").addClass("four_3left");
                            $player.find('.' + four).addClass("sheep").addClass("four_4left");
                        }
                    } else {
                        if (test[1]) {
                            $player.find('.' + one).addClass("sheep").addClass("four_1down");
                            $player.find('.' + two).addClass("sheep").addClass("four_2down");
                            $player.find('.' + three).addClass("sheep").addClass("four_3down");
                            $player.find('.' + four).addClass("sheep").addClass("four_4down");
                        } else {
                            $player.find('.' + one).addClass("sheep").addClass("four_1up");
                            $player.find('.' + two).addClass("sheep").addClass("four_2up");
                            $player.find('.' + three).addClass("sheep").addClass("four_3up");
                            $player.find('.' + four).addClass("sheep").addClass("four_4up");
                        }
                    }
                    break;
                }
                case 3 :
                {
                    if (test[0] === 2) {
                        if (test[1]) {
                            $player.find('.' + one).addClass("sheep").addClass("three_1");
                            $player.find('.' + two).addClass("sheep").addClass("three_2");
                            $player.find('.' + three).addClass("sheep").addClass("three_3");
                        } else {
                            $player.find('.' + one).addClass("sheep").addClass("three_1left");
                            $player.find('.' + two).addClass("sheep").addClass("three_2left");
                            $player.find('.' + three).addClass("sheep").addClass("three_3left");
                        }
                    } else {
                        if (test[1]) {
                            $player.find('.' + one).addClass("sheep").addClass("three_1down");
                            $player.find('.' + two).addClass("sheep").addClass("three_2down");
                            $player.find('.' + three).addClass("sheep").addClass("three_3down");
                        } else {
                            $player.find('.' + one).addClass("sheep").addClass("three_1up");
                            $player.find('.' + two).addClass("sheep").addClass("three_2up");
                            $player.find('.' + three).addClass("sheep").addClass("three_3up");
                        }
                    }
                    break;
                }
                case 2 :
                {
                    if (test[0] === 2) {
                        if (test[1]) {
                            $player.find('.' + one).addClass("sheep").addClass("two_1");
                            $player.find('.' + two).addClass("sheep").addClass("two_2");
                        } else {
                            $player.find('.' + one).addClass("sheep").addClass("two_1left");
                            $player.find('.' + two).addClass("sheep").addClass("two_2left");
                        }
                    } else {
                        if (test[1]) {
                            $player.find('.' + one).addClass("sheep").addClass("two_1down");
                            $player.find('.' + two).addClass("sheep").addClass("two_2down");
                        } else {
                            $player.find('.' + one).addClass("sheep").addClass("two_1up");
                            $player.find('.' + two).addClass("sheep").addClass("two_2up");
                        }
                    }
                    break;
                }
                default :
                {
                    $player.find('.' + one).addClass("sheep").addClass("one");
                }
            }
        }
    },


    deadZone: function (numberShip, xOrY, playerOneOrTwo) {                                                             //зона вокруг корабля
        var self = this,
            arr,
            area,
            $player,
            numbersId;
        $player = $(playerOneOrTwo);
        if (playerOneOrTwo === "#playerOne") {
            var lifeOneOrTwo = self.ships[numberShip].life;
            var deadAreaOneOrTwo = self.ships[numberShip].deadArea;
        } else {
            lifeOneOrTwo = self.ships[numberShip].lifeTwo;
            deadAreaOneOrTwo = self.ships[numberShip].deadAreaTwo;
        }
        //console.log(numberShip);
        arr = lifeOneOrTwo.slice();
        console.log(arr);
        area = deadAreaOneOrTwo;
        function test(numbersId, area, playerOneOrTwo) {
            var arr,
                numX,
                numY;

            function numXY(numX, numY) {
                arr = numX + "_" + numY;
                // $player = $(playerOneOrTwo).find('.' + arr);
                if (!self.arrShips("life", arr, playerOneOrTwo)) {
                    deadAreaOneOrTwo.push(arr);
                    if(playerOneOrTwo === "#playerOne"){
                        $player = $(playerOneOrTwo).find('.' + arr).removeClass("ui-droppable").addClass("deadZone");
                    }
                }
            }
            numX = numbersId[0];
            numY = numbersId[1];

            numX++;
            numXY(numX, numY);
            numX = numbersId[0];
            numY = numbersId[1];
            numX--;
            numXY(numX, numY);
            numX = numbersId[0];
            numY = numbersId[1];
            numY++;
            numXY(numX, numY);
            numX = numbersId[0];
            numY = numbersId[1];
            numY--;
            numXY(numX, numY);
            numX = numbersId[0];
            numY = numbersId[1];
            numX++;
            numY--;
            numXY(numX, numY);
            numX = numbersId[0];
            numY = numbersId[1];
            numX++;
            numY++;
            numXY(numX, numY);
            numX = numbersId[0];
            numY = numbersId[1];
            numX--;
            numY++;
            numXY(numX, numY);
            numX = numbersId[0];
            numY = numbersId[1];
            numX--;
            numY--;
            numXY(numX, numY);
        }

        for (var i = 0; i < arr.length; i++) {
            // console.log(numbersId);
            numbersId = arr[i].split("_");
            test(numbersId, deadAreaOneOrTwo, playerOneOrTwo);
        }
    },

    placementOfShips: function () {
        var self = this;

        self.randomLocation(4, 0, "#playerOne");
        self.randomLocation(4, 0, "#playerTwo");

        self.randomLocation(3, 1, "#playerOne");
        self.randomLocation(3, 1, "#playerTwo");

        self.randomLocation(3, 2, "#playerOne");
        self.randomLocation(3, 2, "#playerTwo");

        self.randomLocation(2, 3, "#playerOne");
        self.randomLocation(2, 3, "#playerTwo");

        self.randomLocation(2, 4, "#playerOne");
        self.randomLocation(2, 4, "#playerTwo");

        self.randomLocation(2, 5, "#playerOne");
        self.randomLocation(2, 5, "#playerTwo");

        self.randomLocation(1, 6, "#playerOne");
        self.randomLocation(1, 6, "#playerTwo");

        self.randomLocation(1, 7, "#playerOne");
        self.randomLocation(1, 7, "#playerTwo");

        self.randomLocation(1, 8, "#playerOne");
        self.randomLocation(1, 8, "#playerTwo");

        self.randomLocation(1, 9, "#playerOne");
        self.randomLocation(1, 9, "#playerTwo");

    },

     locationShips: function(dragObject, dropElem, className){

         var self = this,
             $className = className;


         $className = parseInt(className.split("_")[1], 10);

         console.log($className);









         dragObject.elem.style.display = 'none';

         var coordinates = $(dropElem).attr("class").split(' ', 1);

         seaBattle.ships[$className].life.push(coordinates.toString());

         seaBattle.deadZone($className  , 1, "#playerOne");
         setTimeout(function() { $(dropElem).addClass("one"); }, 200);



     }


};



