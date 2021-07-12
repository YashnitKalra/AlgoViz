var src, dest, r, c;

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

function getVisitedArray(rows, cols){
    var visited = [];
    for(let i=0;i<rows;i++){
        temp = [];
        for(let j=0;j<cols;j++)
            temp.push(false);
        visited.push(temp);
    }
    return visited;
}

function addFourDirections(arr, visited, queue, r, c, rows, cols, p){
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
}

async function tracePath(parent, r, c){
    if(r==-1)
        return;
    await tracePath(parent, parent[r][c][0], parent[r][c][1]);
    speed = getSpeed();
    await sleep(speed);
    if(!(r==src[0] && c==src[1] || r==dest[0] && c==dest[1]))
        $(`#${r}_${c}`).addClass("bg-purple");
}

function getMinimumIndex(queue){
    var index = 0;
    var min = queue[0][2] + queue[0][3];
    for(let i=1;i<queue.length;i++){
        if(queue[i][2]+queue[i][3] < min){
            min = queue[i][2]+queue[i][3];
            index = i;
        }
    }
    return index;
}

async function a_star(arr, rows, cols){
    h = Math.abs(dest[0] - src[0]) + Math.abs(dest[1] - src[1]);
    var queue = [[src[0],src[1],h, 0]];
    var visited = getVisitedArray(rows, cols);
    visited[src[0]][src[1]] = true;
    var p = getParentArray(rows, cols);
    var temp,r,c,g;
    while(queue.length>0){
        index = getMinimumIndex(queue);
        temp = queue.splice(index,1)[0];
        r = temp[0]; c = temp[1]; g = temp[3];
        if(r==dest[0] && c==dest[1]){
            await tracePath(p, r, c);
            return;
        }
        if(!(r==src[0] && c==src[1]))
            $(`#${r}_${c}`).addClass("bg-primary");
        if(r-1>=0 && !visited[r-1][c] && arr[r-1][c]!=-1){
            visited[r-1][c] = true;
            h = Math.abs(dest[0]-r+1) + Math.abs(dest[1]-c);
            queue.push([r-1, c, h, g+1]);
            p[r-1][c] = [r, c];
        }
        if(c-1>=0 && !visited[r][c-1] && arr[r][c-1]!=-1){
            visited[r][c-1] = true;
            h = Math.abs(dest[0]-r) + Math.abs(dest[1]-c+1);
            queue.push([r, c-1, h, g+1]);
            p[r][c-1] = [r, c];
        }
        if(r+1<rows && !visited[r+1][c] && arr[r+1][c]!=-1){
            visited[r+1][c] = true;
            h = Math.abs(dest[0]-r-1) + Math.abs(dest[1]-c);
            queue.push([r+1, c, h, g+1]);
            p[r+1][c] = [r, c];
        }
        if(c+1<cols && !visited[r][c+1] && arr[r][c+1]!=-1){
            visited[r][c+1] = true;
            h = Math.abs(dest[0]-r) + Math.abs(dest[1]-c-1);
            queue.push([r, c+1, h, g+1]);
            p[r][c+1] = [r, c];
        }
        speed = getSpeed();
        await sleep(speed);
        if(!(r==src[0] && c==src[1]))
            $(`#${r}_${c}`).removeClass("bg-primary").addClass("bg-lightyellow");
    }
}

async function bfs(arr, rows, cols){
    var queue = [src];
    var visited = getVisitedArray(rows, cols);
    var p = getParentArray(rows, cols);
    visited[src[0]][src[1]] = true;
    while(queue.length>0){
        r = queue[0][0]; c = queue.shift()[1];
        if(r==dest[0] && c==dest[1]){
            await tracePath(p, r, c);
            return;
        }
        if(!(r==src[0] && c==src[1]))
            $(`#${r}_${c}`).addClass("bg-primary");
        addFourDirections(arr, visited, queue, r, c, rows, cols, p);
        speed = getSpeed();
        await sleep(speed);
        if(!(r==src[0] && c==src[1]))
            $(`#${r}_${c}`).removeClass("bg-primary").addClass("bg-lightyellow");
    }
}

async function bidrirectional(arr, rows, cols){
    var q1 = [src];
    var q2 = [dest];
    var p1 = getParentArray(rows,cols);
    var p2 = getParentArray(rows,cols);
    var visited1 = getVisitedArray(rows, cols);
    var visited2 = getVisitedArray(rows, cols);
    visited1[src[0]][src[1]] = true;
    visited2[dest[0]][dest[1]] = true;
    var r1,r2,c1,c2;
    while(q1.length>0 && q2.length>0){
        r1 = q1[0][0]; c1=q1.shift()[1];
        r2 = q2[0][0]; c2=q2.shift()[1];
        if(visited2[r1][c1]){
            await tracePath(p1, r1, c1);
            await tracePath(p2, r1, c1);
            return;
        }else if(visited1[r2][c2]){
            await tracePath(p1, r2, c2);
            await tracePath(p2, r2, c2);
            return;
        }
        if(!(r1==src[0] && c1==src[1]))
            $(`#${r1}_${c1}`).addClass("bg-primary");
        if(!(r2==dest[0] && c2==dest[1]))   
            $(`#${r2}_${c2}`).addClass("bg-primary");
        addFourDirections(arr, visited1, q1, r1, c1, rows, cols, p1);
        addFourDirections(arr, visited2, q2, r2, c2, rows, cols, p2);
        speed = getSpeed();
        await sleep(speed);
        if(!(r1==src[0] && c1==src[1]))
            $(`#${r1}_${c1}`).removeClass("bg-primary").addClass("bg-lightyellow");
        if(!(r2==dest[0] && c2==dest[1]))   
            $(`#${r2}_${c2}`).removeClass("bg-primary").addClass("bg-lightyellow");
    }
}