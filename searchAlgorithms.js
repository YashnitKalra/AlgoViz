var src, dest, r, c, p;

function findSrcDest(arr, rows, cols){
    for(let i=0;i<rows;i++)
        for(let j=0;j<cols;j++)
            if(arr[i][j]==1)
                src = [i, j];
            else if(arr[i][j]==2)
                dest = [i, j];
}

function getParentArray(rows, cols){
    var parent = [];
    var temp;
    for(let i=0;i<rows;i++){
        temp = [];
        for(let j=0;j<cols;j++)
            temp.push([-1, -1]);
        parent.push(temp);
    }
    return parent;
}

async function tracePath(parent, r, c){
    if(r==-1)
        return;
    await tracePath(parent, parent[r][c][0], parent[r][c][1]);
    speed = getSpeed();
    await sleep(speed);
    $(`#${r}_${c}`).addClass("bg-purple");
}

async function bfs(arr, rows, cols){
    queue = [src];
    visited = [];
    p = getParentArray(rows, cols);
    var temp;
    for(let i=0;i<rows;i++){
        temp = [];
        for(let j=0;j<cols;j++)
            temp.push(false);
        visited.push(temp);
    }
    visited[src[0]][src[1]] = true;
    while(queue.length>0){
        r = queue[0][0]; c = queue.shift()[1];
        if(r==dest[0] && c==dest[1]){
            await tracePath(p, p[r][c][0], p[r][c][1]);
            return;
        }
        if(!(r==src[0] && c==src[1]))
            $(`#${r}_${c}`).addClass("bg-lightyellow");
        if(r-1>=0 && !visited[r-1][c] && arr[r-1][c]!=-1){
            visited[r-1][c] = true;
            queue.push([r-1, c]);
            p[r-1][c] = [r, c];
        }
        if(c-1>=0 && !visited[r][c-1] && arr[r][c-1]!=-1){
            visited[r][c-1] = true;
            queue.push([r, c-1]);
            p[r][c-1] = [r, c];
        }
        if(r+1<rows && !visited[r+1][c] && arr[r+1][c]!=-1){
            visited[r+1][c] = true;
            queue.push([r+1, c]);
            p[r+1][c] = [r, c];
        }
        if(c+1<cols && !visited[r][c+1] && arr[r][c+1]!=-1){
            visited[r][c+1] = true;
            queue.push([r, c+1]);
            p[r][c+1] = [r, c];
        }
        speed = getSpeed();
        await sleep(speed);
    }
}