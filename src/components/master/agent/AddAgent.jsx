import { useState } from 'react'
import Notifier from '../../Notifier';
import Axios from '../../../api/Axios';

const AddAgent = () => {

  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [agentShare, setAgentShare] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {

      const res = await Axios.post('admin/createAgent', { name, mobileNumber, password, agentShare }); // Use the Axios instance
     

      Notifier(res.meta.msg, 'Success')
    } catch (error) {
      Notifier(error?.meta?.msg, 'Error')
    }

  }



  return (
    <div className="row">
      <div className="col-12 col-lg-6">
        <div className="card">
          <div className="card-header">
            <h5 className="h3 card-title mb-0">Add Agent</h5>
          </div>
          <div className="card-body">

            <form onSubmit={handleSubmit}>

              <div className="form-group mb-2">
                <label htmlFor="agentName">Agent Name</label>
                <input type="text" id="agentName" className="form-control" placeholder=""
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-2">
                <label htmlFor="mobileNumber">Mobile Number</label>
                <input type="text" id="mobileNumber" className="form-control" placeholder=""
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required />
              </div>
              <div className="form-group mb-2">
                <label htmlFor="password">Password</label>
                <input type="text" id="password" className="form-control" placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required />
              </div>

              <div className="form-group mb-2">
                <label htmlFor="agentShare">Agent Share</label>
                <input type="number" id="agentShare" className="form-control" placeholder=""
                  value={agentShare}
                  onChange={(e) => setAgentShare(e.target.value)}
                  required />
              </div>
              <div className="row mt-4"></div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddAgent