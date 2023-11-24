import React from 'react'

import { Canvas } from 'fabric/fabric-impl';
import { Socket } from 'socket.io-client';
import createCircle from '@/action/createCircle';

export interface IProps {
  canvas: Canvas | null;
  socket?: Socket | "connecting" | null
}

const Tools = ({ canvas, socket }: IProps) => {
  return (
    <div className='fixed top-0 h-2  pt-4 pl-4 z-10'>
      <button onClick={() => {
        if (!canvas || !socket || socket === "connecting") {
          return;
        }

        const id = Date.now();
        createCircle(canvas, id);
        socket.emit("UPDATE_DATA", {
          action: "CREATE",
          item: id,
        });
      }} className='bg-green-300 p-5 border border-green-500 rounded-lg'>
        +
      </button>
    </div>
  )
}

export default Tools