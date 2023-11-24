// serialHandler.ts
import { SerialPort, ReadlineParser } from "serialport";

export class SerialHandler {
  private serialPort: SerialPort | null = null;
  private readonly pathName: string;
  private readonly baudRate: number;
  private readonly retryInterval: number = 5000; // Retry every 5 seconds
  private onDataReceived: (data: string) => void;

  constructor(
    pathName: string,
    baudRate: number,
    onDataReceived: (data: string) => void
  ) {
    this.pathName = pathName;
    this.baudRate = baudRate;
    this.onDataReceived = onDataReceived;
    this.initializeSerialPort();
  }

  private initializeSerialPort(): void {
    try {
      this.serialPort = new SerialPort({
        path: this.pathName,
        baudRate: this.baudRate,
      });

      const lineStream = this.serialPort.pipe(new ReadlineParser());
      lineStream.on("data", (data) => {
        console.log("Data:", data);
        this.onDataReceived(data); // Call the callback with the received data
      });

      this.serialPort.on("open", () => {
        console.log(`Serial port ${this.pathName} opened.`);
      });

      this.serialPort.on("error", (err) => {
        console.error("Serial Port Error:", err.message);
        this.retryConnection();
      });

      this.serialPort.on("close", () => {
        console.log(`Serial port ${this.pathName} closed.`);
        this.retryConnection();
      });
    } catch (error) {
      console.error("Serial Port Initialization Error:", error);
      this.retryConnection();
    }
  }

  private retryConnection(): void {
    setTimeout(() => {
      console.log(`Retrying connection to ${this.pathName}...`);
      this.initializeSerialPort();
    }, this.retryInterval);
  }

  // Additional methods to interact with the serial port can be added here
}
