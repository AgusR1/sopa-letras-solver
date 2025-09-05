import './App.css'
import SopaDeLetrasMatrix from "./components/Matrix/SopaDeLetrasMatrix.tsx";
import {testSopa} from "./assets/testSopas.ts";

function App() {

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <SopaDeLetrasMatrix data={testSopa}/>
    </div>
  )
}

export default App
