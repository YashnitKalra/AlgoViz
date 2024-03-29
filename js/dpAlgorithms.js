async function lcs(){
    var s1 = $("#A").val();
    var s2 = $("#B").val();
    var arr = get2DArray(s1.length+1, s2.length+1);
    createTableWithEmptySpace(s1, s2);
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
    var ans = []
    while(r>0 && c>0){
        if(s1[r-1] == s2[c-1]){
            $(`#${r}_${c}`).addClass("bg-info text-light");
            ans.push(s1[r-1]);
            r--; c--;
        }
        else{
            $(`#${r}_${c}`).addClass("bg-danger text-light");
            arr[r-1][c] > arr[r][c-1] ? r-- : c--;
        }
        await sleep(getSpeed());
    }
    $("#dpVis").append(`<h3>LCS: <strong>${ans.reverse().join("")}<strong></h3>`);
}

// ****************************************************************************************************

async function lps(){
    var s = $("#A").val();
    createTable(s, s);
    var arr = get2DArray(s.length, s.length);
    for(var i=0; i<s.length; i++){
        arr[i][i] = 1;
        $(`#${i}_${i}`).text('1');
    }
    for(var i=1; i<s.length; i++){
        for(var j=0; j<s.length-i; j++){
            var k = j+i;
            if(s[j]==s[k])
                arr[j][k] = 2 + arr[j+1][k-1];
            else
                arr[j][k] = Math.max(arr[j+1][k], arr[j][k-1]);
            $(`#${j}_${k}`).text(arr[j][k]).addClass("bg-success");
            $(`#r${j},#c${k}`).addClass("bg-lightred");
            await sleep(getSpeed());
            $(`#r${j},#c${k}`).removeClass("bg-lightred");
            $(`#${j}_${k}`).removeClass("bg-success");
        }
    }
    await backTrackLps(arr, s);
}

async function backTrackLps(arr, s){
    var r = 0, c = arr.length-1;
    var pre = [], suf = [];
    while(c>=r){
        if(s[r]==s[c]){
            pre.push(s[r]);
            if(r!=c)
                suf.push(s[c]);
            $(`#${r}_${c}`).addClass("bg-info text-light");
            r++; c--;
        }
        else{
            $(`#${r}_${c}`).addClass("bg-danger text-light");
            arr[r+1][c] > arr[r][c-1] ? r++ : c--;
        }
        await sleep(getSpeed());
    }
    $("#dpVis").append(`<h3>Longest Palindromic Subsequence: <strong>${pre.join("") + suf.reverse().join("")}</strong></h3>`);
}

// ****************************************************************************************************************************************

async function subsetSum(){
    var nums = $("#A").val().split(",");
    for(var i = 0; i<nums.length; i++)
        if(isNaN(nums[i]))
            return;
    nums = nums.map(Number);
    var sum = $("#B").val();
    if(isNaN(sum))
        return;
    sum = Number(sum);
    createNumberTable([0].concat(nums), 0, sum);
    var arr = get2DArray(nums.length+1, sum+1);
    arr[0][0] = true;
    $("#0_0").text('T');
    for(var i=1; i<=sum; i++)
        $(`#${0}_${i}`).text('F');
    for(var i=1; i<=nums.length; i++){
        $(`#r${i}`).addClass("bg-lightred");
        for(var j=0; j<=sum; j++){
            $(`#c${j}`).addClass("bg-lightred");
            arr[i][j] = arr[i-1][j];
            if(j>=nums[i-1])
                arr[i][j] |= arr[i-1][j-nums[i-1]];
            $(`#${i}_${j}`).text(arr[i][j]?'T':'F').addClass("bg-success");
            await sleep(getSpeed());
            $(`#c${j}`).removeClass("bg-lightred");
            $(`#${i}_${j}`).removeClass("bg-success");
        }
        $(`#r${i}`).removeClass("bg-lightred");
    }
    if(arr[nums.length][sum])
        await backTrackSubsetSum(arr, nums);
    else
        $("#dpVis").append(`<h3>Subset: <strong>Does not exist</strong></h3>`);
}

async function backTrackSubsetSum(arr, nums){
    var r = arr.length-1;
    var c = arr[0].length-1;
    res = []
    while(r>0 && c>0){
        if(arr[r-1][c]){
            $(`#${r}_${c}`).addClass("bg-danger text-light");
            r--;
        }
        else{
            $(`#${r}_${c}`).addClass("bg-info text-light");
            c -= nums[r-1];
            res.push(nums[r-1]);
            r--;
        }
        await sleep(getSpeed());
    }
    $("#dpVis").append(`<h3>Subset: <strong>{${res.reverse().join(", ")}}</strong></h3>`);
}

// ****************************************************************************************************************************************
async function booleanParanthezisation(){
    let s = $("#A").val().trim().toUpperCase();
    let N = s.length;
    for(let i=0; i<N; i++)
        if(i%2==0 && !(s[i]=='T' || s[i]=='F') || i%2==1 && !(s[i]=='|' || s[i]=='&' || s[i]=='^')){
            alert("Invalid Input");
            return;
        }
    let arr = [];
    for(let i=0; i<N; i+=2)
        arr.push(s[i]);
    let p = arr.join("");
    let n = parseInt(N/2) + 1;
    createTable(p, p);
    let dp = new Array(n);
    for(let i=0; i<n; i++){
        dp[i] = new Array(n);
        for(let j=0; j<n; j++)
            dp[i][j] = new Array(2).fill(0);
        dp[i][i][s[i*2]=='T'?1:0]++;
        $(`#${i}_${i}`).html(`<span class="text-danger">${dp[i][i][0]}</span> <span class="text-darkgreen"">${dp[i][i][1]}</span>`);
    }

    for(let j=1; j<n; j++){
        for(let i=0; i<n-j; i++){
            let start = i, end = i+j;
            $(`#c${start},#c${end}`).addClass("bg-lightred");
            for(let k=start; k<end; k++){
                let index = k*2 + 1;
                for(let x=0; x<=1; x++)
                    for(let y=0; y<=1; y++)
                        if(s[index]=='|')
                            dp[start][end][x|y] += (dp[start][k][x] * dp[k+1][end][y]);
                        else if(s[index]=='&')
                            dp[start][end][x&y] += (dp[start][k][x] * dp[k+1][end][y]);
                        else
                            dp[start][end][x^y] += (dp[start][k][x] * dp[k+1][end][y]);
                $(`#c${k}`).addClass("bg-lightgreen");
                $(`#${start}_${end}`).html(`<span class="text-danger">${dp[start][end][0]}</span> <span class="text-darkgreen">${dp[start][end][1]}</span>`);
                await sleep(getSpeed());
                $(`#c${k}`).removeClass("bg-lightgreen");
                        
            }
            $(`#c${start},#c${end}`).removeClass("bg-lightred");
        }
    }
    $("#dpVis").append(`<h3>Ways to get True: <strong>${dp[0][n-1][1]}</strong></h3><h3>Ways to get False: <strong>${dp[0][n-1][0]}</strong></h3>`);
}