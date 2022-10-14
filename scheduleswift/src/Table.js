function Table({tableData, handleSubmit}){
    return(
        <table className="table">
            <thead>
                <tr>
                    <th>E.N</th>
                    <th>Facility</th>
                    <th>Date</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Confirmation ID</th>
                </tr>
            </thead>
            <tbody>
            {
                tableData.map((data, index)=>{
                    return(
                        <tr key={index}>
                            <td>{index+1}</td>
                            <td>{data.facility}</td>
                            <td>{data.date}</td>
                            <td>{data.starttime}</td>
                            <td>{data.endtime}</td>
                            <td><button id={data.confID}  onClick={handleSubmit}>View</button></td>
                        </tr>
                    )
                })
            }
            </tbody>
        </table>
    )
}
export default Table;