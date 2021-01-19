$(document).ready(function(){
    var num,rows=20,cols=50;
    var srcSelected = 0, destSelected = 0, obstacleSelected = 0, eraseSelected = 0, eraseButtonPressed=0;
    var temp, tempSrc, tempDest;
    var arr = [];

    for(var i=1;i<=10;i++)
            $("#destinations").append(`<option value="${i}">${i}</option>`)

    function getRadioValue(arr){
        for(var i=0;i<arr.length;i++)
            if(arr[i].checked)
                return i;
    }

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
        for(let i=0;i<rows;i++){
            temp = [];
            $("#searchVis").append(`<div id="r${i}" style="height:${screen.height/34}px;">`);
            for(let j=0;j<cols;j++){
                $(`#r${i}`).append(`<div class='box' id="${i}_${j}">&nbsp;</div>`);
                temp.push(0);
            }
            arr.push(temp);
            $("#searchVis").append("</div>");
        }
        $("#0_0").addClass("bg-success");
        $(`#${rows-1}_${cols-1}`).addClass("bg-danger");
        $(`#r${rows-1}`).css("border-bottom","1px solid black");
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
                    if(Math.random()<0.3){
                        $(`#${i}_${j}`).addClass("bg-dark");
                        arr[i][j] = -1;
                    }else{
                        $(`#${i}_${j}`).removeClass("bg-dark");
                        arr[i][j] = 0;
                    }
                }
    });

    function addBars(){
        num = Math.floor((Number($("#size").val())+1)*3.5);
        $("#sortVis").empty()
        var barWidth = 75/num;
        for(let i=0;i<num;i++)
            $("#sortVis").append(`<span width=${barWidth}px class="line align-top" id="line${i}"></span>`);
        $(".line").css("border-left-width", `${barWidth}rem`);
        for(let i=0;i<num;i++)
            $(`#line${i}`).css("height",`${Math.ceil(Math.random()*Math.floor(screen.height/2))+1}px`);
    }
    
    $("#search").click(function(){
        $("#search").addClass("active").addClass("font-weight-bold");
        $("#sort").removeClass("active").removeClass("font-weight-bold");
        $("#sortOptions").css("display","none");
        $("#searchOptions").css("display","flex");
        $("#sortVis").addClass("d-none");
        $("#searchVis").removeClass("d-none");
        // makeGrid();
    });
    $("#sort").click(function(){
        $("#sort").addClass("active").addClass("font-weight-bold");
        $("#search").removeClass("active").removeClass("font-weight-bold");
        $("#searchOptions").css("display","none");
        $("#sortOptions").css("display","flex");
        $("#searchVis").addClass("d-none");
        $("#sortVis").removeClass("d-none");
        addBars();
    });
    $("#size").on("input",addBars);
    $("#refreshBars").click(addBars);

    $("#sortButton").click(async function(){
        var option = getRadioValue(document.getElementsByName("sortAlgo"));
        $("#sortButton, #size, #refreshBars").attr("disabled",true);
        switch(option){
            case 0: await selectionSort(num); break;
            case 1: await bubbleSort(num); break;
            case 2: await insertionSort(num); break;
            case 3: await quickSort(0, num-1); break;
            case 4: await mergeSort(0,num-1); break;
            case 5: await heapSort(num); break;
        }
        $("#sortButton, #size, #refreshBars").attr("disabled",false);
    });

    $("#searchButton").click(function(){
        // console.log(arr);
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
            if(getBoxValue(this)==1 && destSelected==0){   // clicked on src
                srcSelected = 1;
                tempSrc = this;
                // setBoxValue(this, 0);
            }
            else if(srcSelected==1 && getBoxValue(this)!=2){ // set src which is not dest
                srcSelected = 0;
                setBoxValue(this, 1);
                setBoxValue(tempSrc, 0);
                $(tempSrc).removeClass("bg-success");
                $(this).removeClass("bg-dark").removeClass("bg-lightgreen").addClass("bg-success");
            }
            else if(getBoxValue(this)==2 && srcSelected==0){   // clicked on dest
                destSelected = 1;
                tempDest = this;
                // setBoxValue(this, 0);
            }
            else if(destSelected==1 && getBoxValue(this)!=1){    // set dest which is not src
                destSelected = 0;
                setBoxValue(this, 2);
                setBoxValue(tempDest, 0);
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
        });

        $(".box").hover(function(){ // MOUSE-ENTER
            if(srcSelected==1){ // while src is selected
                if(getBoxValue(this)!=2)
                    $(this).addClass("bg-lightgreen");
            }
            else if(destSelected==1){   // while dest is selected
                if(getBoxValue(this)!=1)
                    $(this).addClass("bg-lightred");
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
        },
        function(){  // MOUSE-LEAVE
            if(srcSelected==1){ // while src is selected
                if(getBoxValue(this)!=2)
                    $(this).removeClass("bg-lightgreen");
            }
            else if(destSelected==1){   // while dest is selected
                if(getBoxValue(this)!=2)
                    $(this).removeClass("bg-lightred");
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
        });
    }
});