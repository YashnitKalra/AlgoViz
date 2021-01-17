$(document).ready(function(){
    var num;

    for(var i=1;i<=10;i++)
            $("#destinations").append(`<option value="${i}">${i}</option>`)

    function getRadioValue(arr){
        for(var i=0;i<arr.length;i++)
            if(arr[i].checked)
                return i;
    }

    function addBars(){
        num = Math.floor((Number($("#size").val())+1)*3.5);
        $("#sortVis").empty()
        var barWidth = 75/num;
        for(let i=0;i<num;i++)
            $("#sortVis").append(`<span width=${barWidth}px class="line align-top" id="line${i}"></span>`);
        $(".line").css("border-left-width", `${barWidth}rem`);
        for(let i=0;i<num;i++)
            $(`#line${i}`).css("height",`${Math.ceil(Math.random()*350)+1}px`);
    }
    
    $("#search").click(function(){
        $("#search").addClass("active").addClass("font-weight-bold");
        $("#sort").removeClass("active").removeClass("font-weight-bold");
        $("#sortOptions").css("display","none");
        $("#searchOptions").css("display","inline");
        $("#sortVis").addClass("d-none");
    });
    $("#sort").click(function(){
        $("#sort").addClass("active").addClass("font-weight-bold");
        $("#search").removeClass("active").removeClass("font-weight-bold");
        $("#searchOptions").css("display","none");
        $("#sortOptions").css("display","inline");
        $("#sortVis").removeClass("d-none");
        addBars();
    });
    $("#size").on("input",addBars);

    $("#sortButton").click(function(){
        var option = getRadioValue(document.getElementsByName("sortAlgo"));
        switch(option){
            case 0: selectionSort(num); break;
            case 1: bubbleSort(num); break;
            case 2: insertionSort(num); break;
            case 4: mergeSort(0,num-1); break;
        }
    });
});