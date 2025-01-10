import React from "react";
import Sidebar from "./components/Sidebar";

const App: React.FC = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ padding: "16px", flex: 1 }}>
      </div>
    </div>
  );
};

export default App;