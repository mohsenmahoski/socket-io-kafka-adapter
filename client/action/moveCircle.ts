import { fabric } from "fabric";
import { Canvas } from 'fabric/fabric-impl';

const moveCircle = (canvas: Canvas, data: {
  left: number; top: number; id: number
}) => {
  const objects = canvas?.getObjects() as fabric.Object[];
  const findItem = objects.find((it: fabric.Object) => {
    return it.toObject().id === data.id;
  });

  if (findItem) {
    (findItem as fabric.Object).top = data.top;
    (findItem as fabric.Object).left = data.left;
    (findItem as fabric.Object).setCoords();
    canvas?.renderAll();
  }
}

export default moveCircle;