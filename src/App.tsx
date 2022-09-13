import React from "react";
import { Stage, Layer, Rect, Text, Arrow } from "react-konva";

type ArchvData = { services: string[]; grpc: { from: string; to: string }[] };
type ServiceTypes = { gateway: string[]; aggregator: string[]; data: string[] };
type Position = { x: number; y: number };

const testData = {
  services: [],
  grpc: [],
};

export default function App() {
  let types = inferServiceTypes(testData);

  let width = window.innerWidth;
  let height = window.innerHeight - 30;
  return (
    <div>
      <h1>archv</h1>
      <Stage width={width} height={height}>
        <Layer>{buildMicroserviceGraph(width, height, types, testData)}</Layer>
      </Stage>
    </div>
  );
}

const aggregatorInferPercentage = 0.9;
function inferServiceTypes(data: ArchvData): ServiceTypes {
  let outMap = new Map<string, number>();

  data.grpc.forEach((grpc) => {
    outMap.set(grpc.from, 0);
    outMap.set(grpc.to, 0);
  });

  data.grpc.forEach((grpc) => {
    let out = outMap.get(grpc.from) || 0;
    outMap.set(grpc.from, out + 1);
  });

  let highestOut = 0;
  let highestOutSvc = "";
  outMap.forEach((value, key) => {
    if (value > highestOut) {
      highestOut = value;
      highestOutSvc = key;
    }
  });

  let result: ServiceTypes = { gateway: [], aggregator: [], data: [] };
  outMap.forEach((value, key) => {
    if (value >= highestOut * aggregatorInferPercentage) {
      result.gateway.push(key);
    } else if (value > 0) {
      result.aggregator.push(key);
    } else {
      result.data.push(key);
    }
  });
  return result;
}

const hBorder = 10;

function buildMicroserviceGraph(
  width: number,
  height: number,
  splitData: ServiceTypes,
  data: ArchvData
) {
  let result: any[] = [];

  const w = 100;
  const h = 80;
  let x = hBorder;
  let y = 50;

  let svcPositions = new Map<String, Position>();

  [
    { svc: splitData.gateway, color: "#fe8a71" },
    { svc: splitData.aggregator, color: "#f6cd61" },
    { svc: splitData.data, color: " #3da4ab" },
  ].forEach((svcDef) => {
    const svcList = svcDef.svc;
    const color: string = svcDef.color;
    for (let i = 0; i < svcList.length; i++) {
      const svc = svcList[i];
      if (x + w + hBorder > width) {
        x = hBorder;
        y += h + 5;
      }

      result.push(
        <Rect
          x={x}
          y={y}
          width={w}
          height={h}
          fill={color}
          stroke="black"
          strokeWidth={1}
        ></Rect>
      );
      svcPositions.set(svc, { x: x, y: y });
      result.push(
        <Text text={svc} x={x + 5} y={y + h / 2 - 10} width={w - 10}></Text>
      );
      x += w + 5;
    }
    x = hBorder;
    y += 150;
  });

  // draw grpc connections between services
  data.grpc.forEach((grpc) => {
    const from = svcPositions.get(grpc.from);
    const to = svcPositions.get(grpc.to);
    if (from && to) {
      result.push(
        <Arrow
          strokeWidth={1}
          stroke="black"
          fill="black"
          points={[from.x + w / 2, from.y + h / 2, to.x + w / 2, to.y + h / 2]}
        />
      );
    }
  });
  return result;
}
