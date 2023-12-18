

function AmountStats({title, data, name}){
    return(
        
        <div className="stat">
            <div className="stat-title">{title}</div>
            <div className="stat-value">{data}</div>
            <div className="stat-actions">
                <span className="border border-[#121522] bg-[#121522] text-sm font-bold rounded-md p-1">{name}</span> 
            </div>
        </div>
        
        
    )
}

export default AmountStats