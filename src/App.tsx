import "./App.css";
import { BrowserRouter } from "react-router";
import RootNavigator from "./services/routing";

function App() {
  return (
    <BrowserRouter>
      <RootNavigator />
    </BrowserRouter>
  );
}

export default App;
