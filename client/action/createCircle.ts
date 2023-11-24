import { fabric } from "fabric";
import { Canvas } from 'fabric/fabric-impl';
import { Socket } from "socket.io-client";

const createCircle = (canvas: Canvas, id: number) => {
  if (!canvas) {
    return;
  }
  const canvasObj = new fabric.Rect({
    width: 100,
    height: 100,
    top: 100,
    left: 100,
    fill: "red",
    stroke: "red",
    strokeWidth: 1,
    centeredScaling: true,
    lockScalingFlip: true,
  });
  canvasObj.toObject = (function (toObject) {
    return function () {
      return fabric.util.object.extend(toObject.call(canvasObj), {
        id,
      });
    };
  })(canvasObj.toObject);

  canvas?.add(canvasObj);

  (canvasObj as fabric.Object).setCoords();
  canvas?.calcOffset();
}

export default createCircle;