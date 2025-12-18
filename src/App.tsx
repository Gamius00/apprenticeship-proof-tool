import { Input } from "./components/ui/input"
import {Button} from "@/components/ui/button.tsx";
import { useNavigate } from 'react-router-dom';
import {useState} from "react";

export default function App() {
    const navigate = useNavigate();
    const [apprenticeShipYear, setApprenticeShipYear] = useState("")

    const handleFirstLogin = async () => {
        const response = await fetch("http://localhost:3000/api/route", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify("test"),
        });
        const result = await response.json();
        console.log(result);
        navigate("/dashboard")
    }

    const handleChangeApprenticeShipYear = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApprenticeShipYear(e.target.value)
    }

    return (
    <>
        <div className="bg-background h-screen flex justify-center items-center flex-col text-text">
            <div className="flex flex-col items-center">
                <p className="mb-5 text-lg">Welcome to the</p>
                <p className="text-2xl italic">Communardo Apprenticeship Tracker</p>
            </div>

            <div className="mt-5">
                <p className="pb-2">Name</p>
                <Input className="w-96 bg-text text-black"/>
            </div>

            <div className="mt-5">
                <p className="pb-2">Apprenticeship year</p>
                <Input value={apprenticeShipYear} onChange={(e) => {handleChangeApprenticeShipYear(e)}} className="w-96 bg-text text-black"/>
            </div>

            <Button className="mt-10" onClick={handleFirstLogin}>Continue</Button>
        </div>
    </>
  )
}