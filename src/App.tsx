import React, { useEffect } from "react";
import { Stage, Layer, Rect, Text, Line } from "react-konva";
import { useSub, Store, ArchvData, Connection } from "./state";

type ServiceTypes = { gateway: string[]; aggregator: string[]; data: string[] };
type Position = { x: number; y: number };
type SectionInfo = { y: number; midSection: boolean };

export default function App() {
  const { archvData, selectedService } = useSub(
    ({ archvData, selectedService }) => ({ archvData, selectedService })
  );

  useEffect(() => {
    if (archvData) {
      return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const urlData = urlParams.get("data");
    if (urlData) {
      let data: ArchvData = JSON.parse(window.atob(urlData));
      Store.set(({ archvData }) => ({
        archvData: data,
      }));
    }
  }, [archvData]);

  function onFileChange(e: any) {
    let reader = new FileReader();
    reader.onloadend = () => {
      let data: ArchvData = JSON.parse(reader.result as string);
      Store.set(({ archvData }) => ({
        archvData: data,
      }));
    };
    reader.readAsText(e.target.files[0]);
  }

  let content;
  if (archvData) {
    let width = window.innerWidth;
    let height = window.innerHeight - 30;
    let types = inferServiceTypes(archvData);
    content = (
      <Stage width={width} height={height}>
        <Layer>
          {buildMicroserviceGraph(
            width,
            height,
            types,
            archvData,
            selectedService
          )}
        </Layer>
      </Stage>
    );
  } else {
    content = <span>Please upload a arch.json file above</span>;
  }

  return (
    <div>
      <h1>archv</h1>
      <div>
        <input type="file" onChange={onFileChange} />
      </div>
      {content}
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
  outMap.forEach((value, key) => {
    if (value > highestOut) {
      highestOut = value;
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

const vBorder = 10;
const hBorder = 100;
const w = 100;
const h = 80;
const sectionGap = 100;
const svcGap = 5;
const busW = 8; //use a even number here
const outLineGap = 2;

function buildMicroserviceGraph(
  width: number,
  height: number,
  splitData: ServiceTypes,
  data: ArchvData,
  selectedService?: string
) {
  let result: any[] = [];

  let x = hBorder;
  let y = vBorder;

  let svcPositions = new Map<String, Position>();
  let sectionEndsY: SectionInfo[] = [];
  let svcsPerRow = (width - hBorder * 2) / w + svcGap;
  let selectedConnections = selectedService
    ? outGoingGrpcFor(selectedService, data)
    : [];

  let numSection = 0; //TODO use a normal loop instead of forEach here, numSection becomes the i of the loop
  [
    { svc: splitData.gateway, color: "#fe8a71" },
    { svc: splitData.aggregator, color: "#f6cd61" },
    { svc: splitData.data, color: " #3da4ab" },
  ].forEach((section) => {
    const svcList = section.svc;
    const color: string = section.color;
    const numRows = Math.ceil(svcList.length / svcsPerRow);
    let row = 0;
    for (let i = 0; i < svcList.length; i++) {
      const svc = svcList[i];
      if (x + w + hBorder > width) {
        x = hBorder;
        if (row % 2 === 1) {
          y += h + sectionGap / 2;
          sectionEndsY.push({ y, midSection: true });
        } else {
          y += h + svcGap;
        }
        row += 1;
      }

      let stroke;
      let strokeWidthSvc;
      let strokeWidthCon;
      if (selectedService === svc) {
        stroke = "blue";
        strokeWidthSvc = 3;
        strokeWidthCon = 2;
      } else {
        stroke = "black";
        strokeWidthSvc = 1;
        strokeWidthCon = 1;
      }

      result.push(
        <Rect
          x={x}
          y={y}
          width={w}
          height={h}
          fill={color}
          stroke={stroke}
          strokeWidth={strokeWidthSvc}
          onClick={() =>
            Store.set(({ selectedService }) => ({
              selectedService: svc,
            }))
          }
        ></Rect>
      );
      svcPositions.set(svc, { x: x, y: y });
      result.push(
        <Text text={svc} x={x + 5} y={y + h / 2 - 10} width={w - 10}></Text>
      );

      //outgoing connections
      const out = outGoingGrpcFor(svc, data);
      let incoming = findIncoming(svc, selectedConnections);
      if (incoming) {
        //TODO paint this in blue (add metadata to connection for painting?)
        out.push(incoming);
      }
      let outWidth = Math.min(out.length * (outLineGap + 1), w);
      let conX = x + (w - outWidth) / 2;
      for (let i = 0; i < out.length; i++) {
        let xStart = conX;
        let yStart;
        let xEnd = conX;
        let yEnd;
        let lineLen;
        if (row === 0 || row === numRows) {
          lineLen = sectionGap / 2;
        } else {
          lineLen = sectionGap / 4;
        }
        if (numSection === 0 || row % 2 === 1) {
          //first section always goes down
          yStart = y + h;
          yEnd = y + h + lineLen;
        } else {
          yStart = y;
          yEnd = y - lineLen;
        }

        result.push(
          <Line
            points={[xStart, yStart, xEnd, yEnd]}
            strokeWidth={strokeWidthCon}
            stroke={stroke}
          />
        );
        conX += outLineGap + 1;
      }
      x += w + svcGap;
    }

    x = hBorder;
    y += h + sectionGap;
    sectionEndsY.push({ y, midSection: false });
    numSection += 1;
  });

  // Add the bus connections
  // vertical bus on the left
  for (var i = 0; i < sectionEndsY.length - 1; i++) {
    result.push(
      <Line
        points={[
          hBorder / 2,
          sectionEndsY[i].y - sectionGap / 2,
          hBorder / 2,
          sectionEndsY[i + 1].y - sectionGap / 2,
        ]}
        stroke="black"
        strokeWidth={busW}
      />
    );
  }

  // horizontal bus lines
  sectionEndsY.forEach((sectionInfo) => {
    const endY = sectionInfo.y;

    let y;
    if (sectionInfo.midSection) {
      y = endY - sectionGap / 4;
    } else {
      y = endY - sectionGap / 2;
    }
    let strokeWidth;
    if (sectionInfo.midSection) {
      strokeWidth = busW / 2;
    } else {
      strokeWidth = busW;
    }

    result.push(
      <Line
        points={[hBorder / 2 - busW / 2, y, width - hBorder, y]}
        stroke="black"
        strokeWidth={strokeWidth}
      />
    );
  });
  return result;
}

function outGoingGrpcFor(svc: string, data: ArchvData): Connection[] {
  var result: Connection[] = [];
  data.grpc.forEach((grpc) => {
    if (grpc.from === svc) {
      result.push(grpc);
    }
  });
  return result;
}

function findIncoming(svc: string, conn: Connection[]): Connection | undefined {
  return conn.find((con) => con.to === svc);
}
