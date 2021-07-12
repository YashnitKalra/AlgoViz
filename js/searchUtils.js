$(document).ready(()=>{
    var pixels = 110 - Math.floor(Number($("#rows").val())) ,cols=50;
    var srcSelected = 0, destSelected = 0, obstacleSelected = 0, eraseSelected = 0, eraseButtonPressed=0;
    var temp, tempSrc, tempDest, searchStarted = 0;
    var arr = [];

    

    $("#eraseButton").click(function(){
        if(srcSelected==0 && destSelected==0){  // if src and dest are not selected currently
            if(eraseButtonPressed==0){  // press erase button
                eraseButtonPressed=1;
                $(this).removeClass("btn-outline-light").addClass("btn-light");
            }else{  // unpress erase button
                eraseButtonPressed=0;
                eraseSelected=0;
                $(this).removeClass("btn-light").addClass("btn-outline-light");
            }
        }
    });

    function makeGrid(){
        // 0 => empty, -1 => blocked, 1 => src, 2 => dest
        srcSelected = 0; destSelected = 0; obstacleSelected = 0; eraseSelected = 0; eraseButtonPressed=0; arr = [];
        $("#eraseButton").removeClass("btn-outline-light").removeClass("btn-light").addClass("btn-outline-light");
        $("#searchVis").empty();
        var occupy = Math.ceil(pixels*2.8) + 1;
        var availableHeight = Math.floor(window.innerHeight - $("#searchVis").position().top);
        rows = Math.floor(availableHeight/occupy);
        cols = Math.floor(window.innerWidth/occupy);
        for(let i=0;i<rows;i++){
            temp = [];
            $("#searchVis").append(`<div id="r${i}" class="d-flex justify-content-center">`);
            for(let j=0;j<cols;j++){
                $(`#r${i}`).append(`<div class='box' id="${i}_${j}" style="padding:${pixels}px;"></div>`);
                temp.push(0);
            }
            arr.push(temp);
            $("#searchVis").append("</div>");
        }
        $("#0_0").addClass("bg-success");
        $(`#${rows-1}_${cols-1}`).addClass("bg-danger");
        for(let i=0; i<rows; i++)
            $(`#${i}_${cols-1}`).css("border-right","1px solid rgb(230, 212, 212)");
        for(let j=0; j<cols; j++)
            $(`#${rows-1}_${j}`).css("border-bottom","1px solid rgb(230, 212, 212)");
        arr[0][0]=1;
        arr[rows-1][cols-1] = 2;
        createBoxEvents();
    }
    makeGrid();
    $("#refreshGrid").click(makeGrid);

    $("#randomMazeButton").click(function (){
        for(let i=0;i<rows;i++)
            for(let j=0;j<cols;j++)
                if(arr[i][j]<1){
                    $(`#${i}_${j}`).removeClass("bg-purple").removeClass("bg-lightyellow");
                    if(Math.random()<0.3){
                        $(`#${i}_${j}`).addClass("bg-dark");
                        arr[i][j] = -1;
                    }else{
                        $(`#${i}_${j}`).removeClass("bg-dark");
                        arr[i][j] = 0;
                    }
                }
    });

    function changeRows(){
        pixels = 110 - Math.floor(Number($("#rows").val()));
        makeGrid();
    }

    $("#rows").on("input",changeRows);

    function clearTracedPath(){
        for(let i=0;i<rows;i++)
            for(let j=0;j<cols;j++)
                $(`#${i}_${j}`).removeClass("bg-lightyellow").removeClass("bg-purple");
    }

    $("#searchButton").click(async function(){
        searchStarted = 1;
        clearTracedPath();
        var option = getRadioValue(document.getElementsByName("searchAlgo"));
        findSrcDest(arr, rows, cols);
        $("#searchButton, #rows, #refreshBars, #eraseButton, #randomMazeButton, #refreshGrid, input").attr("disabled",true);
        switch(option){
            case 0: await a_star(arr, rows, cols); break;
            case 1: await bfs(arr, rows, cols); break;
            case 2: await bidrirectional(arr, rows, cols); break;
        }
        searchStarted = 0;
        $("#searchButton, #rows, #refreshBars, #eraseButton, #randomMazeButton, #refreshGrid, input").attr("disabled",false);
    });

    function setBoxValue(obj, val){
        temp = obj.id.split("_");
        arr[Number(temp[0])][Number(temp[1])] = val;
    }

    function getBoxValue(obj){
        temp = obj.id.split("_");
        return arr[Number(temp[0])][Number(temp[1])];
    }

    function createBoxEvents(){
        $(".box").click(function(){
            if(searchStarted==0){   // if searching for path is not started
                if(getBoxValue(this)==1 && destSelected==0 && srcSelected==0){   // clicked on src
                    srcSelected = 1;
                    tempSrc = this;
                }
                else if(srcSelected==1 && getBoxValue(this)!=2){ // set src which is not dest
                    srcSelected = 0;
                    setBoxValue(tempSrc, 0);
                    setBoxValue(this, 1);
                    $(tempSrc).removeClass("bg-success");
                    $(this).removeClass("bg-dark").removeClass("bg-lightgreen").addClass("bg-success");
                }
                else if(getBoxValue(this)==2 && srcSelected==0 && destSelected==0){   // clicked on dest
                    destSelected = 1;
                    tempDest = this;
                }
                else if(destSelected==1 && getBoxValue(this)!=1){    // set dest which is not src
                    destSelected = 0;
                    setBoxValue(tempDest, 0);
                    setBoxValue(this, 2);
                    $(tempDest).removeClass("bg-danger");
                    $(this).removeClass("bg-dark").removeClass("bg-lightred").addClass("bg-danger");
                }
                else if(srcSelected==0 && destSelected==0){ // neither src is selected nor dest
                    if(eraseButtonPressed==1 && eraseSelected==0){  // start erasing
                        eraseSelected=1;
                        setBoxValue(this, 0);
                    }
                    else if(eraseButtonPressed==1 && eraseSelected==1){ // stop erasing
                        eraseSelected=0;
                        setBoxValue(this, 0);
                    }
                    else if(getBoxValue(this)<1 && obstacleSelected==0){ // start making obstacles
                        obstacleSelected = 1;
                        setBoxValue(this, -1);
                    }
                    else if(getBoxValue(this)<1 && obstacleSelected==1){    // stop making obstacles
                        obstacleSelected = 0;
                        setBoxValue(this, -1);
                    }
                }
            }
        });

        $(".box").hover(function(){ // MOUSE-ENTER
            if(searchStarted==0){   // search not started
                if(srcSelected==1){ // while src is selected
                    if(getBoxValue(this)!=2){
                        if(getBoxValue(this)==-1)
                            $(this).removeClass("bg-dark");
                        $(this).addClass("bg-lightgreen");
                    }
                }
                else if(destSelected==1){   // while dest is selected
                    if(getBoxValue(this)!=1){
                        if(getBoxValue(this)==-1)
                            $(this).removeClass("bg-dark");
                        $(this).addClass("bg-lightred");
                    }
                }
                else if(srcSelected==0 && destSelected==0){
                    if(eraseButtonPressed==1){  // erase options
                        if(getBoxValue(this)==-1){    // current box is obstacle
                            $(this).removeClass("bg-dark");
                            if(eraseSelected==1){  // erase it
                                setBoxValue(this, 0);
                            }
                        }
                    }
                    else if(getBoxValue(this)<1 && obstacleSelected==0){ // show it can be obstacle
                        $(this).addClass("bg-dark");
                    }
                    else if(getBoxValue(this)<1 && obstacleSelected==1){    // make it obstacle
                        $(this).addClass("bg-dark");
                        setBoxValue(this, -1);
                    }
                }
            }
        },
        function(){  // MOUSE-LEAVE
            if(searchStarted==0){   // if search not started
                if(srcSelected==1){ // while src is selected
                    if(getBoxValue(this)!=2){
                        $(this).removeClass("bg-lightgreen");
                        if(getBoxValue(this)==-1)
                            $(this).addClass("bg-dark");
                    }
                }
                else if(destSelected==1){   // while dest is selected
                    if(getBoxValue(this)!=2){
                        $(this).removeClass("bg-lightred");
                        if(getBoxValue(this)==-1)
                            $(this).addClass("bg-dark");
                    }
                }
                else if(srcSelected==0 && destSelected==0){
                    if(eraseButtonPressed==1){  // erase options
                        if(getBoxValue(this)==-1){  // current box is obstacle
                            if(eraseSelected==0)
                                $(this).addClass("bg-dark");
                        }
                    }
                    else if(getBoxValue(this)==0 && obstacleSelected==0)
                        $(this).removeClass("bg-dark");
                }
            }
        });
    }
});