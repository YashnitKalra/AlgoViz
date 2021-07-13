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

function get2DArray(n, m){
    var arr = new Array(n);
    for(var i=0; i<n; i++)
        arr[i] = new Array(m).fill(0);
    return arr;
}