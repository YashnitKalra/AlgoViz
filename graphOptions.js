$(document).ready(()=>{
    var canvas = document.querySelector("#canvas");
    var ctx = canvas.getContext("2d");
    var between = 50;
    canvas.height = 12 * between;
    canvas.width = 12 * between;
    var top = 50;
    var left = 50;
    var right = canvas.width;
    var bottom = canvas.height;
    var adjList = [];
    var vertices = [];

    ctx.textBaseline = 'middle';
    ctx.textAlign = "center";

    // graph grid
    function createGraphGrid(){
        drawLine(left, top, right, top, "black");
        drawLine(left, top, left, bottom, "black");
        for(var i=1; i<=10; i++){0
            ctx.strokeText(`${i}`, left + i*between, top-10);
            ctx.strokeText(`${i}`, left-10, top + i*between);
        }
    }
    createGraphGrid();

    $("#clearGraph").click(()=>{
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        createGraphGrid();
        vertices = [];
        adjList = [];
        $("#vertex1, #vertex2").empty();
    });

    function drawLine(x1, y1, x2, y2, color){
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    function addVertex(x, y){
        if(x<1 || x>10 || y<1 || y>10){
            alert("Co-ordinate out of range");
        }else{
            x = left + x * between;
            y = top + y * between;
            vertices.push([x, y]);
            ctx.fillStyle = "rgb(149, 45, 67)";
            ctx.beginPath();
            ctx.arc(x, y, 15, 0, 2*Math.PI);
            ctx.fill();
            ctx.strokeStyle = "white";
            ctx.strokeText(`${vertices.length}`, x, y);
            $("#vertex1, #vertex2").append(`<option value="${vertices.length}">${vertices.length}</option>`)
            adjList.push([]);
        }
    }

    function addOverlapVertex(x, y, val){
        ctx.fillStyle = "rgb(149, 45, 67)";
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, 2*Math.PI);
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.strokeText(val, x, y);
    }

    $("#addVertexButton").click(function(){
        var x = parseInt($("#x").val());
        var y = parseInt($("#y").val());
        addVertex(x, y);
    });

    $("#vertex1, #vertex2").change(()=>{
        var v1 = vertices[parseInt($("#vertex1").val())-1];
        var v2 = vertices[parseInt($("#vertex2").val())-1];
        var x1 = (v1[0] - left)/between;
        var x2 = (v2[0] - left)/between;
        var y1 = (v1[1] - top)/between;
        var y2 = (v2[1] - top)/between;
        var d = Math.pow(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2), 0.5);
        $("#weight").val(d);
    });

    $("#addEdgeButton").click(()=>{
        var v1 = parseInt($("#vertex1").val())-1;
        var v2 = parseInt($("#vertex2").val())-1;
        if(v1!=v2){
            var w = parseFloat($("#weight").val());
            adjList[v1].push([v2, w]);
            adjList[v2].push([v1, w]);
            drawLine(vertices[v1][0], vertices[v1][1], vertices[v2][0], vertices[v2][1], "white");
            addOverlapVertex(vertices[v1][0], vertices[v1][1], v1 + 1);
            addOverlapVertex(vertices[v2][0], vertices[v2][1], v2 + 1);
            ctx.strokeText(w, (vertices[v1][0] + vertices[v2][0])/2, (vertices[v1][1] + vertices[v2][1])/2);
        }
    });
});