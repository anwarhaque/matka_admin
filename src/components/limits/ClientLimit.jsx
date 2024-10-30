import { useState, useEffect } from 'react'
import Notifier from '../Notifier';
import Axios from '../../api/Axios';
import { useAuth } from '../../context/AuthContext';

const ClientLimit = () => {
  const [loading, setLoading] = useState(true);
  const [clientList, setClientList] = useState([]);
  const [agentList, setAgentList] = useState([]);
  const [listLimit, setListLimit] = useState([]);
  const [selectedClient, setSelectedClient] = useState({});
  const [selectedAgent, setSelectedAgent] = useState({});
  const [addLimit, setAddLimit] = useState('');
  const { currentUser } = useAuth()

  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log(currentUser);

    const createData = {
      senderId: selectedAgent._id,
      receiverId: selectedClient._id,
      amount: addLimit,
      oldLimit: selectedClient.limit,
      newLimit: selectedClient.limit + addLimit
    }

    try {
      const res = await Axios.post('/limit/addLimit', createData); // Use the Axios instance
      getLimitHistory(selectedClient._id)
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

  const getUser = async (userId) => {
    try {

      const { data } = await Axios.get(`/admin/getUser/${userId}`);
      setSelectedAgent(data)
    } catch (error) {
      Notifier(error?.meta?.msg, 'Error')
    }
  }


  const getAgentList = async () => {
    try {
      const { data } = await Axios.get('/admin/listUser', {
        params: {
          userType: "AGENT"
        }
      });
      setAgentList(data)

    } catch (err) {
      Notifier(err.meta.msg, 'Error')
    }
  };

  const getClientList = async (agentId) => {
    try {
      const { data } = await Axios.get('/admin/listUser', {
        params: {
          userType: "CLIENT",
          agentId: agentId
        }
      });
      setClientList(data)
    } catch (err) {
      Notifier(err.meta.msg, 'Error')
    }
  };

  const handelAgentOnchange = (event) => {
    event.preventDefault();
    if (event.target.value) {
      const _agent = agentList.find((item) => item._id === event.target.value);
      setSelectedAgent(_agent)
      getClientList(_agent._id)
    } else {
      setSelectedAgent({})
      setClientList([])
      setSelectedClient({})
    }
  }
  const handelClientOnchange = (event) => {
    event.preventDefault();
    if (event.target.value) {
      const _client = clientList.find((item) => item._id === event.target.value);
      getLimitHistory(_client._id)
      getUser(_client.agentId)
      setSelectedClient(_client)
    } else {
      setSelectedClient({})
    }
  }

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
                  <label > Agent</label>
                  <select className="form-select mb-3" onChange={handelAgentOnchange} required>
                    <option value="" >Select Agent</option>
                    {
                      agentList.map((item) => (
                        <option key={item._id} value={item._id}>{`${item.name} (${item.userName})`}</option>
                      ))
                    }
                  </select>
                </div>
                {
                  Object.keys(selectedAgent).length > 0 && (
                    <>
                      <div className="form-group mb-2">
                        <label htmlFor="currentLimit">Agent: <b>{selectedAgent.userName} ({selectedAgent.name})</b></label>
                      </div>
                      <div className="form-group mb-2">
                        <label htmlFor="currentLimit">Agnet Current Limit: <b>{selectedAgent.limit}</b></label>
                      </div>
                    </>
                  )
                }
                <div className="form-group mb-2">
                  <label > Client</label>
                  <select className="form-select mb-3" onChange={handelClientOnchange} required>
                    <option value="" >Select Client</option>
                    {
                      clientList.map((item) => (
                        <option key={item._id} value={item._id}>{`${item.name} (${item.userName})`}</option>
                      ))
                    }
                  </select>
                </div>

                {
                  Object.keys(selectedClient).length > 0 && (
                    <div className="form-group mb-2">
                      <label htmlFor="currentLimit">Current Limit</label>
                      <input type="number" id="currentLimit" className="form-control" placeholder=""
                        value={selectedClient.limit}
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
        Object.keys(selectedClient).length > 0 && (
          <div className="row">
            <div className="col-12 col-lg-12 col-xxl-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header">
                  <h5 className="card-title mb-0">Limit History</h5>
                  <h5 className='float-right'>Current Limit {selectedClient.limit}</h5>
                </div>
                <table className="table table-hover my-0">
                  <thead>
                    <tr>
                      <th>S.N.</th>
                      <th>Client Code</th>
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

export default ClientLimit