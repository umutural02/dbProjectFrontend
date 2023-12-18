import { useState } from "react";
import TitleCard from "../../../components/Cards/TitleCard";

function MostValueableTeams({ data }) {

    
  
    const[mostValueableTeams, setMostValueableTeams] = useState(data)

    return (
        <TitleCard title={"Most Valuable Teams"}>
        {/** Table Data */}
        <div className="overflow-x-auto">
            <table className="table w-full">
            <thead>
                <tr>
                <th className="normal-case">Name</th>
                <th className="normal-case">League</th>
                <th className="normal-case">Market Value</th>
                <th className="normal-case">Player Amount</th>
                </tr>
            </thead>
            <tbody>
                {mostValueableTeams.map((element, index) => (
                <tr key={index}>
                    <th>{element.teamName}</th>
                    <td>{element.leagueName}</td>
                    <td>{element.totalSquadValue}{element.totalSquadValueUnit}</td>
                    <td>{element.playerAmount}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </TitleCard>
    );
}

export default MostValueableTeams;
