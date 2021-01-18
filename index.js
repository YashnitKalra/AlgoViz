$(document).ready(function(){
    var num,rows=20,cols=50;
    var obstacle=0, erase=0, obstacleSelected = 1;
    var srcSelected = 0, destSelected = 0;
    var temp;
    var arr = [];

    for(var i=1;i<=10;i++)
            $("#destinations").append(`<option value="${i}">${i}</option>`)

    function getRadioValue(arr){
        for(var i=0;i<arr.length;i++)
            if(arr[i].checked)
                return i;
    }

    function makeGrid(){
        // 0 => empty, -1 => blocked, 1 => src, 2 => dest
        $("#searchVis").empty();
        for(let i=0;i<rows;i++){
            temp = [];
            $("#searchVis").append(`<div id="r${i}">`);
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
    }
    makeGrid();

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
        $("#searchOptions").css("display","inline");
        $("#sortVis").addClass("d-none");
        $("#searchVis").removeClass("d-none");
        makeGrid();
    });
    $("#sort").click(function(){
        $("#sort").addClass("active").addClass("font-weight-bold");
        $("#search").removeClass("active").removeClass("font-weight-bold");
        $("#searchOptions").css("display","none");
        $("#sortOptions").css("display","inline");
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

    function setBoxValue(obj, val){
        temp = obj.id.split("_");
        arr[Number(temp[0])][Number(temp[1])] = val;
    }

    function getBoxValue(obj){
        temp = obj.id.split("_");
        return arr[Number(temp[0])][Number(temp[1])];
    }

    $(".box").click(function(){
        if(getBoxValue(this)==1 && destSelected==0){   // clicked on src
            srcSelected = 1;
            setBoxValue(this, 0);
        }
        else if(srcSelected==1 && getBoxValue(this)<1){ // set src which is not dest
            srcSelected = 0;
            setBoxValue(this, 1);
        }
        else if(getBoxValue(this)==2 && srcSelected==0){   // clicked in dest
            destSelected = 1;
            setBoxValue(this, 0);
        }
        else if(destSelected==1 && getBoxValue(this)<1){    // set dest which is not src
            destSelected = 0;
            setBoxValue(this, 2);
        }
    });

    $(".box").hover(function(){ // MOUSE-ENTER
        if(srcSelected==1){ // while src is selected
            if(getBoxValue(this)<=1)
                $(this).addClass("bg-success");
        }
        else if(destSelected==1){   // while dest is selected
            if(getBoxValue(this)<1)
                $(this).addClass("bg-danger");
        }
    },
    function(){  // MOUSE-LEAVE
        if(srcSelected==1){ // while src is selected
            if(getBoxValue(this)<=1)
                $(this).removeClass("bg-success");
        }
        else if(destSelected==1){   // while dest is selected
            if(getBoxValue(this)<1)
                $(this).removeClass("bg-danger");
        }
    });
});