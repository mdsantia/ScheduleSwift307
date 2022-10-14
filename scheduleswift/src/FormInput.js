function FormInput({handleChange, formInputData, handleSubmit}){
    return(
        <div className="form-row row">
          <div className="col">
            <input type="text" onChange={handleChange} value={formInputData.date} name="date" className="form-control"  placeholder="Date" />
          </div>
          <div className="col">
            <input type="text" onChange={handleChange} value={formInputData.starttime} name="starttime" className="form-control" placeholder="Start Time" />
          </div>
          <div className="col">
            <input type="text" onChange={handleChange} value={formInputData.endtime} name="endtime" className="form-control" placeholder="End Time" />
          </div>
          <div className="col">
            <input type="text" onChange={handleChange} value={formInputData.confID} name="confID" className="form-control" placeholder="Confirmation ID" />
          </div>
          <div className="col">
            <input type="submit" id="add" onClick={handleSubmit} />
          </div>
        </div>
      
    )
    }
    export default FormInput;