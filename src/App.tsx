import React from "react";
import { Stage, Layer, Rect, Text, Arrow, Line } from "react-konva";

type Connection = { from: string; to: string };
type ArchvData = { services: string[]; grpc: Connection[] };
type ServiceTypes = { gateway: string[]; aggregator: string[]; data: string[] };
type Position = { x: number; y: number };

const testData = {
  services: [
    "app-alerting-service",
    "app-gateway-service",
    "app-metrics-service",
    "article-delta-sync-service",
    "article-fstore-service",
    "article-import-mgmt-service",
    "article-import-service",
    "article-masterdata-service",
    "article-service",
    "auth-service",
    "booking-fstore-service",
    "booking-print-data-service",
    "booking-service",
    "checklist-export-service",
    "checklist-fstore-service",
    "checklist-import-service",
    "complaint-fstore-service",
    "complaint-printer-service",
    "config-service",
    "customer-data-service",
    "customer-order-export-service",
    "customer-order-import-service",
    "delivery-service",
    "esl-proxy-service",
    "export-article-service",
    "export-booking-service",
    "export-print-service",
    "gift-hamper-import-service",
    "idm-gateway-service",
    "inventory-booking-service",
    "inventory-export-service",
    "inventory-fstore-service",
    "inventory-print-data-service",
    "inventory-service",
    "masterdata-service",
    "mhd-export-service",
    "mhd-fstore-service",
    "mhd-import-service",
    "order-data-service",
    "order-export-service",
    "order-fstore-service",
    "order-online-data-service",
    "order-service",
    "pickjob-fstore-service",
    "pickjob-service",
    "pickjob-shelves-order-service",
    "rebook-export-service",
    "rebook-fstore-service",
    "relocation-export-service",
    "relocation-fstore-service",
    "return-fstore-service",
    "sales-export-service",
    "sales-fstore-service",
    "sap-gateway-service",
    "sent-documents-service",
    "stock-check-online-data-service",
    "stock-receipt-alert-service",
    "stock-receipt-report-service",
    "supplier-service",
    "unique-device-id-service",
    "user-tracking-service",
    "validation-service",
    "write-off-export-service",
    "write-off-fstore-service",
  ],
  grpc: [
    { from: "app-gateway-service", to: "app-metrics-service" },
    { from: "app-gateway-service", to: "article-delta-sync-service" },
    { from: "app-gateway-service", to: "article-import-mgmt-service" },
    { from: "app-gateway-service", to: "article-import-service" },
    { from: "app-gateway-service", to: "article-masterdata-service" },
    { from: "app-gateway-service", to: "article-service" },
    { from: "app-gateway-service", to: "auth-service" },
    { from: "app-gateway-service", to: "booking-service" },
    { from: "app-gateway-service", to: "config-service" },
    { from: "app-gateway-service", to: "customer-data-service" },
    { from: "app-gateway-service", to: "delivery-service" },
    { from: "app-gateway-service", to: "export-booking-service" },
    { from: "app-gateway-service", to: "export-print-service" },
    { from: "app-gateway-service", to: "gift-hamper-import-service" },
    { from: "app-gateway-service", to: "inventory-service" },
    { from: "app-gateway-service", to: "masterdata-service" },
    { from: "app-gateway-service", to: "order-data-service" },
    { from: "app-gateway-service", to: "order-online-data-service" },
    { from: "app-gateway-service", to: "order-service" },
    { from: "app-gateway-service", to: "pickjob-service" },
    { from: "app-gateway-service", to: "pickjob-shelves-order-service" },
    { from: "app-gateway-service", to: "stock-check-online-data-service" },
    { from: "app-gateway-service", to: "stock-receipt-report-service" },
    { from: "app-gateway-service", to: "supplier-service" },
    { from: "app-gateway-service", to: "unique-device-id-service" },
    { from: "app-gateway-service", to: "sent-documents-service" },
    { from: "app-gateway-service", to: "user-tracking-service" },
    { from: "app-gateway-service", to: "validation-service" },
    { from: "article-delta-sync-service", to: "article-import-service" },
    { from: "article-import-service", to: "article-import-mgmt-service" },
    { from: "article-import-service", to: "article-delta-sync-service" },
    { from: "article-import-service", to: "app-gateway-service" },
    { from: "article-import-service", to: "article-service" },
    { from: "article-service", to: "article-import-service" },
    { from: "booking-fstore-service", to: "booking-service" },
    { from: "booking-print-data-service", to: "article-import-service" },
    { from: "booking-print-data-service", to: "booking-service" },
    { from: "booking-print-data-service", to: "masterdata-service" },
    { from: "booking-print-data-service", to: "supplier-service" },
    { from: "booking-print-data-service", to: "article-service" },
    { from: "booking-service", to: "delivery-service" },
    { from: "booking-service", to: "order-service" },
    { from: "complaint-fstore-service", to: "booking-service" },
    { from: "complaint-printer-service", to: "article-import-service" },
    { from: "complaint-printer-service", to: "booking-service" },
    { from: "complaint-printer-service", to: "masterdata-service" },
    { from: "complaint-printer-service", to: "supplier-service" },
    { from: "complaint-printer-service", to: "article-service" },
    { from: "customer-order-export-service", to: "pickjob-service" },
    { from: "customer-order-import-service", to: "article-service" },
    { from: "customer-order-import-service", to: "pickjob-service" },
    {
      from: "customer-order-import-service",
      to: "pickjob-shelves-order-service",
    },
    { from: "customer-order-import-service", to: "article-import-service" },
    { from: "delivery-service", to: "booking-service" },
    { from: "delivery-service", to: "app-gateway-service" },
    { from: "export-article-service", to: "article-fstore-service" },
    { from: "export-article-service", to: "article-import-service" },
    { from: "export-article-service", to: "article-service" },
    { from: "idm-gateway-service", to: "auth-service" },
    { from: "inventory-fstore-service", to: "inventory-booking-service" },
    { from: "inventory-print-data-service", to: "inventory-booking-service" },
    { from: "mhd-export-service", to: "mhd-fstore-service" },
    { from: "order-data-service", to: "article-service" },
    { from: "order-data-service", to: "masterdata-service" },
    { from: "order-data-service", to: "supplier-service" },
    { from: "order-data-service", to: "article-import-service" },
    { from: "order-data-service", to: "config-service" },
    { from: "order-export-service", to: "sent-documents-service" },
    { from: "order-fstore-service", to: "sent-documents-service" },
    { from: "order-fstore-service", to: "order-export-service" },
    { from: "pickjob-fstore-service", to: "pickjob-service" },
    { from: "relocation-fstore-service", to: "relocation-export-service" },
    { from: "return-fstore-service", to: "booking-service" },
    { from: "sales-fstore-service", to: "sales-export-service" },
    { from: "sap-gateway-service", to: "article-service" },
    { from: "sap-gateway-service", to: "masterdata-service" },
    { from: "sap-gateway-service", to: "supplier-service" },
    { from: "stock-receipt-alert-service", to: "article-import-service" },
    { from: "stock-receipt-alert-service", to: "delivery-service" },
    { from: "stock-receipt-alert-service", to: "order-service" },
    { from: "stock-receipt-alert-service", to: "article-service" },
    { from: "stock-receipt-alert-service", to: "supplier-service" },
    { from: "stock-receipt-report-service", to: "delivery-service" },
    { from: "stock-receipt-report-service", to: "masterdata-service" },
    { from: "stock-receipt-report-service", to: "order-service" },
    { from: "stock-receipt-report-service", to: "supplier-service" },
    { from: "validation-service", to: "article-import-service" },
    { from: "validation-service", to: "article-service" },
  ],
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
const busW = 8; //use a even number here
const outLineGap = 2;

function buildMicroserviceGraph(
  width: number,
  height: number,
  splitData: ServiceTypes,
  data: ArchvData
) {
  let result: any[] = [];

  let x = hBorder;
  let y = vBorder;

  let svcPositions = new Map<String, Position>();
  let sectionEndsY: number[] = [];

  let numSection = 0; //TODO use a normal loop instead of forEach here, numSection becomes the i of the loop
  [
    { svc: splitData.gateway, color: "#fe8a71" },
    { svc: splitData.aggregator, color: "#f6cd61" },
    { svc: splitData.data, color: " #3da4ab" },
  ].forEach((section) => {
    const svcList = section.svc;
    const color: string = section.color;
    let row = 0;
    for (let i = 0; i < svcList.length; i++) {
      const svc = svcList[i];
      if (x + w + hBorder > width) {
        x = hBorder;
        y += h + 5;
        row += 1;
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

      //outgoing connections
      const out = outGoingGrpcFor(svc, data);
      let outWidth = Math.min(out.length * (outLineGap + 1), w);
      let conX = x + (w - outWidth) / 2;
      for (let i = 0; i < out.length; i++) {
        let xStart = conX;
        let yStart;
        let xEnd = conX;
        let yEnd;
        if (numSection === 0 || row % 2 === 1) {
          //first section always goes down
          yStart = y + h;
          yEnd = y + h + sectionGap / 2;
        } else {
          yStart = y;
          yEnd = y - sectionGap / 2;
        }

        result.push(
          <Line
            points={[xStart, yStart, xEnd, yEnd]}
            strokeWidth={1}
            stroke="black"
          />
        );
        conX += outLineGap + 1;
      }

      x += w + 5;
    }

    x = hBorder;
    y += h + sectionGap;
    sectionEndsY.push(y);
    numSection += 1;
  });

  // Add the bus connections
  //v bus on the left
  for (var i = 0; i < sectionEndsY.length - 1; i++) {
    result.push(
      <Line
        points={[
          hBorder / 2,
          sectionEndsY[i] - sectionGap / 2,
          hBorder / 2,
          sectionEndsY[i + 1] - sectionGap / 2,
        ]}
        stroke="black"
        strokeWidth={busW}
      />
    );
  }

  sectionEndsY.forEach((endY) => {
    result.push(
      <Line
        points={[
          hBorder / 2 - busW / 2,
          endY - sectionGap / 2,
          width - hBorder,
          endY - sectionGap / 2,
        ]}
        stroke="black"
        strokeWidth={busW}
      />
    );
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

function outGoingGrpcFor(svc: string, data: ArchvData): Connection[] {
  var result: Connection[] = [];
  data.grpc.forEach((grpc) => {
    if (grpc.from === svc) {
      result.push(grpc);
    }
  });
  return result;
}
