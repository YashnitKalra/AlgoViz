function swapHeight(id1, id2){
    var height1 = $(id1).height();
    var height2 = $(id2).height();
    $(id1).css("height", height2);
    $(id2).css("height",height1);
 }

async function selectionSort(n){
    var value;
    for(let i=0;i<n;i++){
        speed = getSpeed();
        var index = i;
        var id1 = getLineId(i);
        var minVal = $(id1).height();
        toGreenColor(id1);
        for(let j=i;j<n;j++){
            value = $(getLineId(j)).height();
            if(minVal>value){
                minVal = value;
                index = j; 
            }
        }
        var id2 = getLineId(index);
        toBlueColor(id2);
        await sleep(speed);
        toDefaultColor(id1);
        toDefaultColor(id2);
        swapHeight(id1, id2);
    }
}

async function bubbleSort(n){
    var id1,id2;
    for(let i=0;i<n-1;i++){
        for(let j=0;j<n-i-1;j++){
            speed = getSpeed();
            id1 = getLineId(j);
            id2 = getLineId(j+1);
            toGreenColor(id1);
            toBlueColor(id2);
            await sleep(speed);
            if($(id1).height()>$(id2).height())
                swapHeight(id1, id2);
            toDefaultColor(id1);
            toDefaultColor(id2);
        }
    }
}

async function insertionSort(n){
    var j, height1, height2;
    for(let i=1;i<n;i++){
        speed = getSpeed();
        height1 = $(getLineId(i)).height();
        toGreenColor(getLineId(i));
        j = i-1;
        while(j>=0 && $(getLineId(j)).height()>height1){
            height2 = $(getLineId(j)).height();
            $(getLineId(j+1)).css("height", `${height2}px`);
            j--;
        }
        toBlueColor(getLineId(j+1));
        await sleep(speed);
        toDefaultColor(getLineId(i));
        toDefaultColor(getLineId(j+1));
        $(getLineId(j+1)).css("height", `${height1}px`);
    }
}

async function partition(l, h){
    toBlueColor(getLineId(h));
    let pivot = $(getLineId(h)).height(), height;
    let i = l-1;
    if(l-1>=0)
        toBlueColor(getLineId(l-1));
    toBlueColor(getLineId(i+1));
    for(let j=l;j<h;j++){
        speed = getSpeed();
        height = $(getLineId(j)).height();
        toGreenColor(getLineId(j));
        await sleep(speed);
        if(height<pivot){
            toDefaultColor(getLineId(i+1));
            i++;
            toBlueColor(getLineId(i+1));
            swapHeight(getLineId(i), getLineId(j));
        }
        toDefaultColor(getLineId(j));
    }
    swapHeight(getLineId(i+1), getLineId(h));
    toDefaultColor(getLineId(h));
    toDefaultColor(getLineId(i+1));
    if(l-1>=0)
        toDefaultColor(getLineId(l-1));
    return i+1;
}

async function quickSort(l, h){
    if(l<h){
        let pi = await partition(l, h);
        await quickSort(l, pi-1);
        await quickSort(pi+1, h);
    }
}

async function mergeSort(l,r){
    if(l<r){
        var mid = Math.floor((r+l)/2);
        await mergeSort(l,mid);
        await mergeSort(mid+1,r)
        var left = [];
        var right = [];
        for(let i=l;i<=mid;i++)
            left.push($(getLineId(i)).height());
        for(let i=mid+1;i<=r;i++)
            right.push($(getLineId(i)).height());
        let i=0,j=0,k=l;
        while(i<left.length && j<right.length){
            speed = getSpeed();
            toGreenColor(getLineId(k));
            await sleep(speed);
            if(left[i]<=right[j]){
                $(getLineId(k)).css("height",left[i]);
                i++;
            }else{
                $(getLineId(k)).css("height",right[j]);
                j++;
            }
            toDefaultColor(getLineId(k));
            k++;
        }
        while(i<left.length){
            speed=getSpeed();
            toGreenColor(getLineId(k));
            await sleep(speed);
            $(getLineId(k)).css("height",left[i]);
            toDefaultColor(getLineId(k));
            i++; k++;
        }
        while(j<right.length){
            speed=getSpeed();
            toGreenColor(getLineId(k));
            await sleep(speed);
            $(getLineId(k)).css("height",right[j]);
            toDefaultColor(getLineId(k));
            j++; k++;
        }
    }
}

async function heapify(n, i){
    let largest = i;
    let l = 2*i + 1;
    let r = 2*i + 2;
    if(l<n && $(getLineId(l)).height()>$(getLineId(largest)).height())
        largest = l;
    if(r<n && $(getLineId(r)).height()>$(getLineId(largest)).height())
        largest = r;
    if(largest!=i){
        toGreenColor(getLineId(i));
        toBlueColor(getLineId(largest));
        speed = getSpeed();
        await sleep(speed);
        swapHeight(getLineId(i), getLineId(largest));
        toDefaultColor(getLineId(i));
        toDefaultColor(getLineId(largest));
        await heapify(n, largest);
    }
}

async function heapSort(n){
    for(let i=Math.floor(n/2)-1;i>=0;i--)
        await heapify(n, i);
    
    for(let i=n-1;i>=0;i--){
        await swapHeight(getLineId(0), getLineId(i));
        await heapify(i, 0);
    }
}