import { useState } from "react";
import TitleCard from "../../../components/Cards/TitleCard";

function MostValuablePlayers({ data }) {

    
  
    const[mostValueablePlayers, setMostValueablePlayers] = useState(data)

    return (
        <TitleCard title={"Most Valuable Players"}>
        {/** Table Data */}
        <div className="overflow-x-auto">
            <table className="table w-full">
            <thead>
                <tr>
                <th className="normal-case">Name</th>
                <th className="normal-case">Team</th>
                <th className="normal-case">Market Value</th>
                <th className="normal-case">Age</th>
                </tr>
            </thead>
            <tbody>
                {mostValueablePlayers.map((element, index) => (
                <tr key={index}>
                    <th>{element.playerName}</th>
                    <td>{element.teamName}</td>
                    <td>{element.marketValue}{element.marketValueUnit}</td>
                    <td>{element.age}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </TitleCard>
    );
}

export default MostValuablePlayers;
