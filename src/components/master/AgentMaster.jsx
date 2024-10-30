import { useState } from 'react'
import Notifier from '../Notifier';
import Axios from '../../api/Axios';


const AgentMaster = () => {
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [limit, setLimit] = useState(0);
  const [commission, setCommission] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();


    if (password !== confirmPassword) {
        Notifier('Passwords do not match', 'Error')
        return
    }

    try {

        const res = await Axios.put('admin/changePassword', { password }); // Use the Axios instance
        console.log(res);

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
            <h5 className="h3 card-title mb-0">Agent Master</h5>
          </div>
          <div className="card-body">

            <form onSubmit={handleSubmit}>

              <div className="form-group mb-2">
                <label htmlFor="agentName">Agent Name</label>
                <input type="text" id="agentName" className="form-control" placeholder="Agent Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-2">
                <label htmlFor="mobileNumber">Mobile Number</label>
                <input type="text" id="mobileNumber" className="form-control" placeholder="Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required />
              </div>
              <div className="form-group mb-2">
                <label htmlFor="password">Password</label>
                <input type="text" id="password" className="form-control" placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

export default AgentMaster