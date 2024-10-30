import { useState, useEffect } from 'react'
import Notifier from '../Notifier';
import Axios from '../../api/Axios';
import { useAuth } from '../../context/AuthContext';

const AgentLimit = () => {

  const [loading, setLoading] = useState(true);
  const [list, setlist] = useState([]);
  const [listLimit, setListLimit] = useState([]);
  const [agent, setAgent] = useState({});
  const [addLimit, setAddLimit] = useState('');
  const { currentUser } = useAuth()

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(currentUser);

    const createData = {
      senderId: currentUser._id,
      receiverId: agent._id,
      amount: addLimit,
      oldLimit: agent.limit,
      newLimit: agent.limit + addLimit
    }

    try {
      const res = await Axios.post('/limit/addLimit', createData); // Use the Axios instance

      // const res = await Axios.post(`/limit/addLimit`, createData);
      // console.log(data);
      // Notifier(re.meta.msg, 'Success')
      getLimitHistory(agent._id)
    } catch (err) {

      Notifier(err.meta.msg, 'Error')
    }

  }

  const getLimitHistory = async (userId) => {
    try {
      const { data } = await Axios.get(`/limit/listLimit/${userId}`);
      console.log(data);
      setListLimit(data)
    } catch (err) {
      Notifier(err.meta.msg, 'Error')
    }
    finally {
      setLoading(false)
    }
  };

  const handelOnchange = (event) => {
    event.preventDefault();
    if (event.target.value) {
      const correntAgent = list.find((item) => item._id === event.target.value);
      getLimitHistory(correntAgent._id)
      setAgent(correntAgent)
    } else {
      setAgent({})
    }
  }


  const getAgentList = async () => {
    try {
      const { data } = await Axios.get('/admin/listUser', {
        params: {
          userType: "AGENT"
        }
      });
      setlist(data)
    } catch (err) {
      Notifier(err.meta.msg, 'Error')
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // en-GB formats the date as "dd/mm/yyyy"
  };


  useEffect(() => {
    getAgentList();
  }, []);


  return (
    <>
      <div className="row">
        <div className="col-12 col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="h3 card-title mb-0">Add Limit</h5>
            </div>
            <div className="card-body">

              <form onSubmit={handleSubmit}>

                <div className="form-group mb-2">
                  <select className="form-select mb-3" onChange={handelOnchange} required>
                    <option value="" >Select Agent</option>
                    {
                      list.map((item) => (
                        <option key={item._id} value={item._id}>{`${item.name} (${item.userName})`}</option>
                      ))
                    }
                  </select>
                </div>
                {
                  Object.keys(agent).length > 0 && (
                    <div className="form-group mb-2">
                      <label htmlFor="currentLimit">Current Limit</label>
                      <input type="number" id="currentLimit" className="form-control" placeholder=""
                        value={agent.limit}
                        disabled
                        required />
                    </div>
                  )
                }
                <div className="form-group mb-2">
                  <label htmlFor="addLimit">Add Limit</label>
                  <input type="number" id="addLimit" className="form-control" placeholder=""
                    value={addLimit}
                    onChange={(e) => setAddLimit(Number(e.target.value))}
                    required />
                </div>

                <div className="row mt-4"></div>
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {
        Object.keys(agent).length > 0 && (
          <div className="row">
            <div className="col-12 col-lg-12 col-xxl-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header">
                  <h5 className="card-title mb-0">Limit History</h5>
                  <h5 className='float-right'>Current Limit {agent.limit}</h5>
                </div>
                <table className="table table-hover my-0">
                  <thead>
                    <tr>
                      <th>S.N.</th>
                      <th>Agent Code</th>
                      <th className="d-none d-xl-table-cell">Old Limit</th>
                      <th className="d-none d-xl-table-cell"><span style={{ color: "green" }}>Plus</span>/<span style={{ color: "red" }}>Minus</span></th>
                      <th className="d-none d-xl-table-cell">New Limit</th>
                      <th className="d-none d-xl-table-cell">Date Time</th>
                      <th className="d-none d-xl-table-cell">User</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      loading ? (<tr><td calpan="4">Loading...</td></tr>) : (
                        listLimit.map((item, index) => (
                          <tr key={item._id}>
                            <td>{index + 1}</td>
                            <td>{item.amount < 0 ? `${item.sender.userName} ${item.sender.name}` : `${item.receiver.userName} ${item.receiver.name}`}</td>

                            <td className="d-none d-xl-table-cell">{item.oldLimit}</td>
                            <td className="d-none d-md-table-cell">
                              <span style={{ color: item.amount > 0 ? "green" : "red" }}>{item.amount}</span>
                            </td>
                            <td className="d-none d-md-table-cell">{item.newLimit}</td>
                            <td className="d-none d-md-table-cell">{formatDate(item.date)}</td>
                            <td className="d-none d-md-table-cell">{item.amount > 0 ? `${item.sender.userName} ${item.sender.name}` : `${item.receiver.userName} ${item.receiver.name}`}</td>
                            <td>
                              {
                                item.status == 'ACTIVE' ? (<span className="badge bg-success">{item.status}</span>) : (<span className="badge bg-danger">{item.status}</span>)
                              }
                            </td>
                          </tr>
                        ))
                      )
                    }

                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )
      }
    </>
  );
}

export default AgentLimit