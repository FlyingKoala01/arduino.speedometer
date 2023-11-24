import { WebSocketProvider } from "./context/WebSocketContext";
import Speedometer from "./speedometer/speedometer";

function App() {
  return (
    <WebSocketProvider>
      <Speedometer />
    </WebSocketProvider>
  );
}

export default App;
