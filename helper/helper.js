// function MouseDown_HandlePrimitiveSelection(){
//     //test if prevprimitive is still chosing
//     if(prevChoosingPrimitive&&prevChoosingPrimitive.isChoosing()&& choosingPrimitive && primitiveType !=3) {
//         prevChoosingPrimitive.StopChoosing();
//         prevChoosingPrimitive = choosingPrimitive;
//         choosingPrimitive.isChoosing();
//         draw(canvas,context);
//     }
//     else if(primitiveType == 3){
//         if(choosingPrimitive) choosingPrimitive.StopChoosing();
//         if(prevChoosingPrimitive) prevChoosingPrimitive.StopChoosing();
//         draw(canvas,context);
//         choosingPrimitive = null;
//         prevChoosingPrimitive = null;
//     }
// }
/************************EVENT HELPER FUNCTION***********************/
function MouseUp_HandlePrimitiveSelection(primitiveX,primitiveY){
    if(!SetChoosingPrimitive(primitiveX,primitiveY)){
        if(choosingPrimitive){
            choosingPrimitive.StopChoosing();
            draw(canvas,context);
        }
        choosingPrimitive = null;
        prevChoosingPrimitive = null;
    }
    else {
        if(choosingPrimitive.isChoosing())
            return;
        if (prevChoosingPrimitive != choosingPrimitive && prevChoosingPrimitive)
        {
            prevChoosingPrimitive.StopChoosing() ;
            choosingPrimitive.Choosing();
            draw(canvas,context);
            prevChoosingPrimitive = choosingPrimitive;
        }
        else if(prevChoosingPrimitive == null){
            choosingPrimitive.Choosing();
            draw(canvas,context);
            prevChoosingPrimitive = choosingPrimitive;
        }
    }
}

function MouseUp_Line_SelectSamePrimitiveHandle(primitiveX,primitiveY){
    if(isSamePrimitive(choosingPrimitive,prevChoosingPrimitive)){
        choosingPrimitive = null;
        prevChoosingPrimitive = null;
        primitiveType = 0;
    }
        draw(canvas,context);
        return;
}

function MouseDown_HandlePrimitiveResize(){
    if(choosingPrimitive ){
        if(choosingPrimitive.GetChosenSquare(prevMousePositionX,prevMousePositionY)){
            dragForResize = true;
        }
    }
}

/**************************************NON-EVENT HELPER FUNCTION******************************** */

function isSamePrimitive(primitive1, primitive2){
    return (primitive1.topleft.isCoincide(primitive2.topleft) && primitive2.botright.isCoincide(primitive2.botright)) ?
    true : false;
}

 
function SetChoosingPrimitive(x, y){
    for(var i = 0;i<primitives.length;i++){
        if(primitives[i].isChosenOROverlapping(x,y)) {
            choosingPrimitive = primitives[i];
            return true;
        }
    }
    return false;
}


