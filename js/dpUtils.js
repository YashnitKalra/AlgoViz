select = $("select")[0];
$(select).val('0');


function createInputs(arr){
    var obj = $(".input-group")[0];
    $(obj).empty();
    for(var i=0; i<arr.length; i++){
        $(obj).append(`<input type="text" placeholder="${arr[i]}" class="form-control" id="${String.fromCharCode(65+i)}">`);
    }
}

async function takeInput(){
    switch(select.value){
        case "0": createInputs(["String 1", "String 2"]); break;
        case "1": createInputs(["String"]); break;
        case "2": createInputs(["1,2,3...", "Sum"]); break;
        case "3": createInputs(["Boolean Expression"]); break;
    }
}
takeInput();

async function start(){
    $("button").attr("disabled",true);
    switch(select.value){
        case "0": await lcs(); break;
        case "1": await lps(); break;
        case "2": await subsetSum(); break;
        case "3": await booleanParanthezisation(); break;
    }
    $("button").attr("disabled",false);
}

function createNumberTable(a, colStart, colEnd){
    res = ["<table class='table table-bordered'><tr><th></th>"];
    for(var i=colStart; i<=colEnd; i++)
        res.push(`<th id='c${i}'>${i}</th>`);
    res.push('</tr>');
    for(var i=0; i<a.length; i++){
        res.push(`<tr><th id="r${i}">${a[i]}</th>`);
        for(var j=colStart; j<=colEnd; j++)
            res.push(`<td id="${i}_${j}"></td>`);
        res.push('</tr>');
    }
    $("#dpVis").empty().append(res.join(""));
}

function createTable(a, b){
    res = ["<table class='table table-bordered'><tr><th></th>"];
    for(var i=0; i<b.length; i++)
        res.push(`<th id='c${i}'>'${b[i]}'</th>`);
    res.push('</tr>');
    for(var i=0; i<a.length; i++){
        res.push(`<tr><th id="r${i}">'${a[i]}'</th>`);
        for(var j=0; j<b.length; j++)
            res.push(`<td id="${i}_${j}"></td>`);
        res.push('</tr>');
    }
    $("#dpVis").empty().append(res.join(""));
}

function createTableWithEmptySpace(a, b){
    res = ["<table class='table table-bordered'><tr><th></th><th>''</th>"];
    for(var i=0; i<b.length; i++)
        res.push(`<th id='c${i+1}'>'${b[i]}'</th>`);
    res.push("</tr><tr><th>''</th>");

    for(var i=0; i<=b.length; i++)
        res.push(`<td id="0_${i}"></td>`);

    for(var i=0; i<a.length; i++){
        res.push(`<tr><th id="r${i+1}">'${a[i]}'</th>`);
        for(var j=0; j<=b.length; j++)
            res.push(`<td id="${i+1}_${j}"></td>`);
        res.push('</tr>');
    }
    $("#dpVis").empty().append(res.join(""));
}