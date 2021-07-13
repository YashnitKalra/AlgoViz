select = $("select")[0];
$(select).val('0');


function createInputs(n){
    var obj = $(".input-group")[0];
    $(obj).empty();
    for(var i=0; i<n; i++){
        $(obj).append(`<input type="text" placeholder="${String.fromCharCode(65+i)}" class="form-control" id="${String.fromCharCode(65+i)}">`);
    }
}

async function takeInput(){
    switch(select.value){
        case "0": createInputs(2); break;
        case "1": createInputs(1); break;
    }
}
takeInput();

async function start(){
    $("button").attr("disabled",true);
    switch(select.value){
        case "0": await lcs(); break;
        case "1": await lps(); break;
    }
    $("button").attr("disabled",false);
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