var num;

var defaultColors = ["rgb(149, 45, 67)", "rgba(253, 15, 15, 0.4)"];
var greenColor = "#D2FF28";
var blueColor = "cyan";

function toDefaultColor(id){
    var n = Number(id.replace("#line", ""));
    $(id).css("background-color", defaultColors[n&1]);
}

function toGreenColor(id){
    $(id).css("background-color", greenColor);
}

function toBlueColor(id){
    $(id).css("background-color", blueColor);
}   

$(document).ready(()=>{
    function changeBars(){
        num = Math.min(100, (Number($("#size").val())+1));
        $("#sortVis").empty();
        for(let i=0;i<num;i++)
            $("#sortVis").append(`<span class="line align-top ${(i&1)==0?"bg-darkred":"bg-lightred"}" id="line${i}"></span>`);
        $(".line").css("width", `${100/num}%`);
        for(let i=0;i<num;i++)
            $(`#line${i}`).css("height",`${Math.ceil(Math.random()*Math.floor(window.innerHeight/2))+1}px`);
    }
    changeBars();

    $("#size").on("input",changeBars);
    $("#refreshBars").click(changeBars);
    
    
    $("#sortButton").click(async function(){
        $("#sortButton, #size, #refreshBars").attr("disabled",true);
        switch($("#sortAlgo").val()){
            case '0': await selectionSort(num); break;
            case '1': await bubbleSort(num); break;
            case '2': await insertionSort(num); break;
            case '3': await quickSort(0, num-1); break;
            case '4': await mergeSort(0,num-1); break;
            case '5': await heapSort(num); break;
        }
        $("#sortButton, #size, #refreshBars").attr("disabled",false);
    });
        

});