async function lcs(){
    var s1 = $("#A").val();
    var s2 = $("#B").val();
    var arr = new Array(s1.length + 1);
    for(var i=0; i<=s1.length; i++)
        arr[i] = new Array(s2.length + 1);
    createTable(s1, s2);
    for(var i=0; i<=s1.length; i++){
        arr[i][0] = 0;
        $(`#${i}_${0}`).text(0);
    }
    for(var i=0; i<=s2.length; i++){
        arr[0][i] = 0;
        $(`#${0}_${i}`).text(0);
    }
    var cell;
    for(var i=1; i<=s1.length; i++){
        $(`#r${i}`).addClass("bg-lightred");
        for(var j=1; j<=s2.length; j++){
            $(`#c${j}`).addClass("bg-lightred");
            cell = $(`#${i}_${j}`);
            if(s1[i-1]==s2[j-1])
                arr[i][j] = 1 + arr[i-1][j-1];
            else
                arr[i][j] = Math.max(arr[i-1][j], arr[i][j-1]);
            $(cell).text(arr[i][j]).addClass("bg-success");
            await sleep(getSpeed());
            $(cell).removeClass("bg-success");
            $(`#c${j}`).removeClass("bg-lightred");
        }
        $(`#r${i}`).removeClass("bg-lightred");
    }

    await backTrackLcs(arr, s1, s2);
}

async function backTrackLcs(arr, s1, s2){
    var r = s1.length;
    var c = s2.length;
    $(`#${r}_${c}`).addClass("bg-info");
    var ans = []
    while(r>0 && c>0){
        if(s1[r-1] == s2[c-1]){
            ans.push(s1[r-1]);
            r--; c--;
        }
        else
            arr[r-1][c] > arr[r][c-1] ? r-- : c--;
        await sleep(getSpeed());
        $(`#${r}_${c}`).addClass("bg-info");
    }
    $("#dpVis").append(`<h3>Result: ${ans.reverse().join("")}</h3>`);
}

async function lps(){
    console.log("lps");
}