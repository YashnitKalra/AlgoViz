var speed;

function getSpeed(){
    return Number($("#speed").val());
}

function getLineId(index){
    return `#line${index}`;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getRadioValue(arr){
    for(var i=0;i<arr.length;i++)
        if(arr[i].checked)
            return i;
}