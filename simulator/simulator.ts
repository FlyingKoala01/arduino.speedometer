import { SerialPort } from "serialport";

// Adjust with the name of one end of your virtual serial port
const portName = "/dev/pts/3";
const port = new SerialPort({
  path: portName,
  baudRate: 9600, // Match the baud rate to your SerialHandler settings
});

const sendSerialData = () => {
  const simulatedData = `L: ${Math.random() * 100}, R: ${
    Math.random() * 100
  }\r\n`;
  port.write(simulatedData, (err) => {
    if (err) {
      return console.log("Error on write:", err.message);
    }
    console.log("Simulated data sent:", simulatedData.trim());
  });
};

setInterval(sendSerialData, 1000);
