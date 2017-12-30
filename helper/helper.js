/************************EVENT HELPER FUNCTION***********************/
function MouseMove_UpdateResizesquareWhileResizing(point){
    switch(resizesquareIndex){
        case 0:
        {
            for(var i=0; i<primitives.length ; i++)
                if(primitives[i].isChosen(point.x,point.y) && i!=choosingPrimitive)
                {
                    return;
                }
            TopLeftResizesquareHandle(primitives[choosingPrimitive],point.x-dragStart.x,point.y-dragStart.y);
            break;
        }
        case 1:
        {
            for(var i=0; i<primitives.length ; i++)
                if(primitives[i].isChosen(point.x,point.y) && i!=choosingPrimitive)
                {
                    return;
                }
            TopRightResizesquareHandle(primitives[choosingPrimitive],point.x-dragStart.x,point.y-dragStart.y);
            break;
        }
        case 2:
        {
            for(var i=0; i<primitives.length ; i++)
                if(primitives[i].isChosen(point.x,point.y) && i!=choosingPrimitive)
                {
                    return;
                }
            BotRightResizesquareHandle(primitives[choosingPrimitive],point.x-dragStart.x,point.y-dragStart.y);
            break;
        }
        case 3:
        {
            for(var i=0; i<primitives.length ; i++)
                if(primitives[i].isChosen(point.x,point.y) && i!=choosingPrimitive)
                {
                    return;
                }
            BotLeftResizesquareHandle(primitives[choosingPrimitive],point.x-dragStart.x,point.y-dragStart.y);
            break;
        }
    }
}

function MouseUp_HandlePrimitiveSelection(primitiveX,primitiveY){
    if(!SetChoosingPrimitive(primitiveX,primitiveY)){
        if(choosingPrimitive > -1){
            primitives[choosingPrimitive].StopChoosing();
            draw(canvas,context);
        }
        choosingPrimitive = -1;
        prevChoosingPrimitive = -1;
    }
    else {
        if(primitives[choosingPrimitive].isChoosing())
            return;
        if (prevChoosingPrimitive != choosingPrimitive && prevChoosingPrimitive > -1)
        {
            primitives[prevChoosingPrimitive].StopChoosing() ;
            primitives[choosingPrimitive].Choosing();
            draw(canvas,context);
            prevChoosingPrimitive = choosingPrimitive;
        }
        else if(prevChoosingPrimitive == -1){
            primitives[choosingPrimitive].Choosing();
            draw(canvas,context);
            prevChoosingPrimitive = choosingPrimitive;
        }
    }
}

function MouseUp_Line_SelectSamePrimitiveHandle(primitiveX,primitiveY){
    if(isSamePrimitive(primitives[choosingPrimitive],primitives[prevChoosingPrimitive])){
        choosingPrimitive = -1;
        prevChoosingPrimitive = -1;
        primitiveType = 0;
    }
        draw(canvas,context);
        return;
}

function MouseUp_Line_AddLine(x, y){
    if(prevChoosingPrimitive == -1) 
        prevChoosingPrimitive = choosingPrimitive;
    // if first primitive was stored then store 2 primitive to the line
    else if(!isSamePrimitive(primitives[prevChoosingPrimitive],primitives[choosingPrimitive])){
        lines.push(new Line(prevChoosingPrimitive,choosingPrimitive));
        prevChoosingPrimitive = -1;
        choosingPrimitive = -1;
        primitiveType = 0;
    }
}





/**************************************NON-EVENT HELPER FUNCTION******************************** */

function isSamePrimitive(primitive1, primitive2){
    return (primitive1.topleft.isCoincide(primitive2.topleft) && primitive2.botright.isCoincide(primitive2.botright)) ?
    true : false;
}

 
function SetChoosingPrimitive(x, y){
    for(var i = 0;i<primitives.length;i++){
        if(primitives[i].isChosen(x,y)) {
            choosingPrimitive = i;
            return true;
        }
    }
    var point = context.transform.transformOriginalToTransform(x,y);
    //  in case of not choosing any primitive, if there is a primitive has already choosing -> stop choosing it
    if(choosingPrimitive > -1 && primitives[choosingPrimitive].GetChosenSquareIndex(point.x,point.y) == -1){
        primitives[choosingPrimitive].StopChoosing();
        choosingPrimitive = -1;
    }
    else if(choosingPrimitive > -1 && primitives[choosingPrimitive].GetChosenSquareIndex(point.x,point.y) > -1){
        return true;
    }
    return false;
}

function CheckObscure(x, y){
    for(var i=0; i<primitives.length ; i++)
        if(primitives[i].isChosen(x,y))
        {
            return i; 
        }
    return -1;
}

function ConnectTwoPrimitive(primitive1, primitive2){
    switch(primitive2.onWhatSide(primitive1))
        {
            case 0://dx>dy
            {
                DrawLine(primitive1.botright.x,
                    (primitive1.botright.y+primitive1.topright.y)/2,
                    primitive2.topleft.x,
                    (primitive2.topleft.y+primitive2.botleft.y)/2);
                break;
            }
            case 1://dx>dy
            {
                DrawLine(primitive1.topleft.x,
                    (primitive1.topleft.y+primitive1.botleft.y)/2,
                    primitive2.botright.x,
                    (primitive2.botright.y+primitive2.topright.y)/2);
                break;
            }
            case 2:
            {
                DrawLine((primitive1.botright.x+primitive1.botleft.x)/2,
                    primitive1.botright.y,
                    (primitive2.topleft.x+primitive2.topright.x)/2,
                    primitive2.topleft.y);
                break;
            }
            case 3:
            {
                DrawLine((primitive1.topleft.x+primitive1.topright.x)/2,
                    primitive1.topleft.y,
                    (primitive2.botright.x+primitive2.botleft.x)/2,
                    primitive2.botright.y);
                break;
            }
        }
    
}

function DrawLine(x1, y1, x2, y2){
    context.beginPath();
    context.moveTo(x1,y1);
    context.lineTo(x2,y2);
    context.stroke();
}

function SwapResizesquare(square1, square2){
    var temp = new ResizeSquare(square1.x,square1.y);
    square1.SwapWith(square2);
    square2.SwapWith(temp);
}

function TopLeftResizesquareHandle(primitive, incrementX, incrementY){
    //Mirror through bot right square
    if(primitive.GetChosenSquare(resizesquareIndex).x > primitive.GetChosenSquare(2).x
    &&primitive.GetChosenSquare(resizesquareIndex).y > primitive.GetChosenSquare(2).y){
        SwapResizesquare(primitive.GetChosenSquare(resizesquareIndex),primitive.GetChosenSquare(2));
        SwapResizesquare(primitive.GetChosenSquare(1),primitive.GetChosenSquare(3));
        resizesquareIndex = 2;
    }
    //Mirror through right edge
    else if(primitive.GetChosenSquare(resizesquareIndex).x > primitive.GetChosenSquare(2).x
    &&primitive.GetChosenSquare(resizesquareIndex).y < primitive.GetChosenSquare(2).y){
        SwapResizesquare(primitive.GetChosenSquare(resizesquareIndex),primitive.GetChosenSquare(1));
        SwapResizesquare(primitive.GetChosenSquare(3),primitive.GetChosenSquare(2));
        resizesquareIndex =1;
    }
    //Mirror through bot edge
    else if(primitive.GetChosenSquare(resizesquareIndex).x < primitive.GetChosenSquare(2).x
    &&primitive.GetChosenSquare(resizesquareIndex).y > primitive.GetChosenSquare(2).y){
        SwapResizesquare(primitive.GetChosenSquare(resizesquareIndex),primitive.GetChosenSquare(3));
        SwapResizesquare(primitive.GetChosenSquare(1),primitive.GetChosenSquare(2));
        resizesquareIndex =3;
    }
    else{
        primitive.GetChosenSquare(resizesquareIndex).UpdateCoordinate(incrementX,incrementY);
        primitive.GetChosenSquare(1).UpdateCoordinate(0,incrementY);
        primitive.GetChosenSquare(3).UpdateCoordinate(incrementX,0);
    }
}

function TopRightResizesquareHandle(primitive, incrementX, incrementY){
    if(primitive.GetChosenSquare(resizesquareIndex).x < primitive.GetChosenSquare(3).x
    &&primitive.GetChosenSquare(resizesquareIndex).y > primitive.GetChosenSquare(3).y){
        SwapResizesquare(primitive.GetChosenSquare(resizesquareIndex),primitive.GetChosenSquare(3));
        SwapResizesquare(primitive.GetChosenSquare(0),primitive.GetChosenSquare(2));
        resizesquareIndex = 3;
    }
    else if(primitive.GetChosenSquare(resizesquareIndex).x < primitive.GetChosenSquare(3).x
    &&primitive.GetChosenSquare(resizesquareIndex).y < primitive.GetChosenSquare(3).y){
        SwapResizesquare(primitive.GetChosenSquare(resizesquareIndex),primitive.GetChosenSquare(0));
        SwapResizesquare(primitive.GetChosenSquare(2),primitive.GetChosenSquare(3));
        resizesquareIndex = 0;
    }
    else if(primitive.GetChosenSquare(resizesquareIndex).x > primitive.GetChosenSquare(3).x
    &&primitive.GetChosenSquare(resizesquareIndex).y > primitive.GetChosenSquare(3).y){
        SwapResizesquare(primitive.GetChosenSquare(resizesquareIndex),primitive.GetChosenSquare(2));
        SwapResizesquare(primitive.GetChosenSquare(0),primitive.GetChosenSquare(3));
        resizesquareIndex = 2;
    }
    else{
        primitive.GetChosenSquare(resizesquareIndex).UpdateCoordinate(incrementX,incrementY);
        primitive.GetChosenSquare(0).UpdateCoordinate(0,incrementY);
        primitive.GetChosenSquare(2).UpdateCoordinate(incrementX,0);
    }
}

function BotRightResizesquareHandle(primitive, incrementX, incrementY){
    if(primitive.GetChosenSquare(resizesquareIndex).x < primitive.GetChosenSquare(0).x
    &&primitive.GetChosenSquare(resizesquareIndex).y < primitive.GetChosenSquare(0).y){
        SwapResizesquare(primitive.GetChosenSquare(resizesquareIndex),primitive.GetChosenSquare(0));
        SwapResizesquare(primitive.GetChosenSquare(1),primitive.GetChosenSquare(3));
        resizesquareIndex = 0;
    }
    else if(primitive.GetChosenSquare(resizesquareIndex).x < primitive.GetChosenSquare(0).x
    &&primitive.GetChosenSquare(resizesquareIndex).y > primitive.GetChosenSquare(0).y){
        SwapResizesquare(primitive.GetChosenSquare(resizesquareIndex),primitive.GetChosenSquare(3));
        SwapResizesquare(primitive.GetChosenSquare(1),primitive.GetChosenSquare(0));
        resizesquareIndex = 3;
    }
    else if(primitive.GetChosenSquare(resizesquareIndex).x > primitive.GetChosenSquare(0).x
    &&primitive.GetChosenSquare(resizesquareIndex).y < primitive.GetChosenSquare(0).y){
        SwapResizesquare(primitive.GetChosenSquare(resizesquareIndex),primitive.GetChosenSquare(1));
        SwapResizesquare(primitive.GetChosenSquare(0),primitive.GetChosenSquare(3));
        resizesquareIndex = 1;
    }
    else{
        primitive.GetChosenSquare(resizesquareIndex).UpdateCoordinate(incrementX,incrementY);
        primitive.GetChosenSquare(3).UpdateCoordinate(0,incrementY);
        primitive.GetChosenSquare(1).UpdateCoordinate(incrementX,0);
    }
}

function BotLeftResizesquareHandle(primitive, incrementX, incrementY){
    if(primitive.GetChosenSquare(resizesquareIndex).x > primitive.GetChosenSquare(1).x
    &&primitive.GetChosenSquare(resizesquareIndex).y < primitive.GetChosenSquare(1).y){
        SwapResizesquare(primitive.GetChosenSquare(resizesquareIndex),primitive.GetChosenSquare(0));
        SwapResizesquare(primitive.GetChosenSquare(1),primitive.GetChosenSquare(3));
        resizesquareIndex = 1;
    }
    else if(primitive.GetChosenSquare(resizesquareIndex).x > primitive.GetChosenSquare(1).x
    &&primitive.GetChosenSquare(resizesquareIndex).y > primitive.GetChosenSquare(1).y){
        SwapResizesquare(primitive.GetChosenSquare(resizesquareIndex),primitive.GetChosenSquare(2));
        SwapResizesquare(primitive.GetChosenSquare(0),primitive.GetChosenSquare(1));
        resizesquareIndex = 2;
    }
    else if(primitive.GetChosenSquare(resizesquareIndex).x < primitive.GetChosenSquare(1).x
    &&primitive.GetChosenSquare(resizesquareIndex).y < primitive.GetChosenSquare(1).y){
        SwapResizesquare(primitive.GetChosenSquare(resizesquareIndex),primitive.GetChosenSquare(0));
        SwapResizesquare(primitive.GetChosenSquare(2),primitive.GetChosenSquare(1));
        resizesquareIndex = 0;
    }
    else{
        primitive.GetChosenSquare(resizesquareIndex).UpdateCoordinate(incrementX,incrementY);
        primitive.GetChosenSquare(2).UpdateCoordinate(0,incrementY);
        primitive.GetChosenSquare(0).UpdateCoordinate(incrementX,0);
    }
}