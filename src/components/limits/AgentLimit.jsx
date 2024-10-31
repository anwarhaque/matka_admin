import { useState, useEffect } from 'react'
import Notifier from '../Notifier';
import Axios from '../../api/Axios';
import { useAuth } from '../../context/AuthContext';
import Pagination from '../pagination/Pagination';

const AgentLimit = () => {

  const [loading, setLoading] = useState(true);
  const [list, setlist] = useState([]);
  const [listLimit, setListLimit] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState({});
  const [addLimit, setAddLimit] = useState('');
  const { currentUser } = useAuth()
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 2;

  const getUser = async (userId) => {
    try {

      const { data } = await Axios.get(`/admin/getUser/${userId}`);
      setSelectedAgent(data)
    } catch (error) {
      Notifier(error?.meta?.msg, 'Error')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (addLimit == 0) return 0

    const createData = {
      adminId: currentUser._id,
      agentId: selectedAgent._id,
      amount: addLimit
    }

    try {
      await Axios.post('/limit/updateAgentLimit', createData); // Use the Axios instance
      // getLimitHistory(selectedAgent._id)
      getUser(selectedAgent._id)
    } catch (err) {

      Notifier(err.meta.msg, 'Error')
    }

  }

  const getLimitHistory = async () => {
    try {

      setLoading(true)
      const queryParam = {
        agentId: selectedAgent._id,
        page: currentPage,
        limit
      }
      const { data, totalPages } = await Axios.get(`/limit/limitHistory`, {
        params: queryParam
      });

      setListLimit(data)
      setTotalPages(totalPages)
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
      const _agent = list.find((item) => item._id === event.target.value);
      setSelectedAgent(_agent)
    } else {
      setSelectedAgent({})
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

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    if (selectedAgent._id) {
      getLimitHistory();
    }
  }, [selectedAgent, currentPage])

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
                  Object.keys(selectedAgent).length > 0 && (
                    <div className="form-group mb-2">
                      <label htmlFor="currentLimit">Current Limit</label>
                      <input type="number" id="currentLimit" className="form-control" placeholder=""
                        value={selectedAgent.limit}
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
        Object.keys(selectedAgent).length > 0 && (
          <div className="row">
            <div className="col-12 col-lg-12 col-xxl-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header">
                  <h5 className="card-title mb-0">Limit History</h5>
                  <h5 className='float-right'>Current Limit {selectedAgent.limit}</h5>
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
                            <td>{(currentPage - 1) * limit + index + 1}</td>
                            <td>{`${item.agent?.userName} ${item.agent?.name}`}</td>
                            <td className="d-none d-xl-table-cell">{item.oldLimit}</td>
                            <td className="d-none d-md-table-cell">
                              <span style={{ color: item.amount > 0 ? "green" : "red" }}>{item.amount}</span>
                            </td>
                            <td className="d-none d-md-table-cell">{item.newLimit}</td>
                            <td className="d-none d-md-table-cell">{formatDate(item.date)}</td>
                            <td className="d-none d-md-table-cell">{`${item.user?.userName} ${item.user?.name}`}</td>
                          </tr>
                        ))
                      )
                    }
                  </tbody>
                </table>
                {listLimit.length>0 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/>}
              </div>
            </div>
          </div >
        )
      }
    </>
  );
}

export default AgentLimit