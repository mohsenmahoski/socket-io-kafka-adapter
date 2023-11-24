"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Socket, io } from 'socket.io-client';
import { fabric } from "fabric";
import { Canvas } from 'fabric/fabric-impl';
import Tools from './tools';
import createCircle from '@/action/createCircle';
import moveCircle from '@/action/moveCircle';
import { useRouter } from 'next/navigation';

export interface IUpdateAction {
  action: "CREATE" | "MOVE";
  item: number | { left: number; top: number, id: number }
}

export const CreateCanvas = ({ port }: { port: string | undefined }) => {
  const socketRef = useRef<Socket<any> | null | "connecting">();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const [loading, setLoading] = useState(true);


  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    canvas.width = window.innerWidth - 100;
    canvas.height = window.innerHeight - 1;

    canvas.style.position = "relative";

    const context = canvas.getContext("2d");
    if (context) {
      contextRef.current = context;
    }

    fabricRef.current = new fabric.Canvas(canvasRef.current, {
      selection: false,
    });


    fabricRef.current.on("object:moving", (data: fabric.IEvent) => {
      const selectedObject = data.target as fabric.Object;
      if (selectedObject) {
        const { left, top, id } = selectedObject.toObject();
        if (socketRef.current && socketRef.current !== "connecting") {
          socketRef.current.emit("UPDATE_DATA", {
            action: "MOVE",
            item: {
              left, top, id
            }
          });
        }
      }
    });

    setLoading(false);

    if (socketRef.current && socketRef.current !== "connecting") {
      socketRef.current.on("UPDATE_DATA", (data: any): void => {
        if (socketRef.current && socketRef.current !== "connecting" && fabricRef.current) {
          switch (data.action) {
            case "CREATE":
              createCircle(fabricRef.current, data.item);
              break;
            case "MOVE":
              moveCircle(fabricRef.current, data.item);
              break;
            default:
              console.log("not_supported_action");
          }
        }
      });
    }

  };

  const joinToNamespace = () => {
    socketRef.current = "connecting";
    console.log("??????????????", port);
    const serverPort = port ?? 5000;
    const socket = io(`http://localhost:${serverPort}/board`, {
      transports: ["websocket"],
    });

    socket.on("disconnect", () => {
      //
    });

    socket.on("connect", () => {
      socketRef.current = socket;
      initCanvas();
    });
  };

  useEffect(() => {
    if (!socketRef.current) {
      joinToNamespace();
    }
  }, []);

  return (
    <div className="w-screen h-screen bg-gray-200">
      {
        loading ? <div className='fixed top-0 left-0 h-screen w-screen z-20 bg-slate-400 flex justify-center items-center'>
          <h1 className='text-6xl'>Loading ...</h1>
        </div> : <></>
      }
      <Tools canvas={fabricRef.current} socket={socketRef.current} />
      <canvas id="canvas" className="canvas" ref={canvasRef} />
    </div>
  )
} 
