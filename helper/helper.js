function MouseDown_HandlePrimitiveSelection(){
    //test if prevprimitive is still chosing
    if(prevChoosingPrimitive&&prevChoosingPrimitive.stillChoosing()&&choosingPrimitive) {
        prevChoosingPrimitive.choose = false;
        prevChoosingPrimitive = choosingPrimitive;
        choosingPrimitive.isChoosing();
        draw(canvas,context);
    }
}
function MouseUp_HandlePrimitiveSelection(primitiveX,primitiveY){
    if(!SetChoosingPrimitive(primitiveX,primitiveY)){
        if(choosingPrimitive){
            choosingPrimitive.choose = false;
            draw(canvas,context);
        }
        choosingPrimitive = null;
        prevChoosingPrimitive = null;
    }
    else {
        if(choosingPrimitive.choose)
            return;
        if (prevChoosingPrimitive != choosingPrimitive && prevChoosingPrimitive)
        {
            prevChoosingPrimitive.choose = false;
            choosingPrimitive.choose = true;
            draw(canvas,context);
            prevChoosingPrimitive = choosingPrimitive;
        }
        else if(prevChoosingPrimitive == null){
            choosingPrimitive.choose = true;
            draw(canvas,context);
            prevChoosingPrimitive = choosingPrimitive;
        }
    }
}