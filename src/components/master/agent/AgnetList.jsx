import { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import Notifier from '../../Notifier';
import Axios from '../../../api/Axios';
import Pagination from '../../pagination/Pagination';

const AgnetList = () => {

  const [list, setlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;


  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
    }
};

  const getAgentList = async () => {
    try {
      setLoading(true);
      const { data } = await Axios.get('/admin/listUser', {
        params: {
          userType: "AGENT",
          page: currentPage,
          limit
        }
      });
    

      setlist(data)
      setTotalPages(totalPages || 1)
    } catch (err) {
      Notifier(err.meta.msg, 'Error')
    } finally {
      setLoading(false);
    }
  };



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // en-GB formats the date as "dd/mm/yyyy"
  };

  const handleCheckboxChange = async (item) => {
    try {
      const res = await Axios.put(`/admin/changeStatus/${item._id}`, {
        status: item.status == 'ACTIVE' ? 'DEACTIVE' : 'ACTIVE'
      });
      Notifier(res.meta.msg, 'Success')
      getAgentList()
    } catch (err) {
      Notifier(err.meta.msg, 'Error')
    }
  };
  const handleDelete = async (item) => {
    try {
      const res = await Axios.delete(`/admin/deleteUser/${item._id}`);
      Notifier(res.meta.msg, 'Success')
      getAgentList()
    } catch (err) {
      Notifier(err.meta.msg, 'Error')
    }
  };


  useEffect(() => {
    getAgentList();
  }, [currentPage]);

  return (
    <div className="row">
      <div className="col-12 col-lg-12 col-xxl-12 d-flex">
        <div className="card flex-fill">
          <div className="card-header">
            <h5 className="card-title mb-0">Agent List</h5>
            <Link type="button" className='btn btn-primary float-right' to='./add'>Add Agent</Link>
          </div>
          <table className="table table-hover my-0">
            <thead className='bg-cadetblue'>
              <tr>
                <th>S.N.</th>
                <th>Code[Password]</th>
                <th >Agent Name</th>
                <th >Mobile Number</th>
                <th >Limit</th>
                <th >D.O.J</th>
                {/* <th >Super Agent Comm.</th> */}
                <th >Agent Share</th>
                <th>Status</th>
                <th>Action</th>

              </tr>
            </thead>
            <tbody>
              {
                loading ? (<tr><td calpan="4">Loading...</td></tr>) : (
                  list.map((item, index) => (
                    <tr key={item._id}>
                      <td>{(currentPage - 1) * limit + index + 1}</td>
                      <td>{item.userName} [{item.plane_password}]</td>
                      <td>{item.name}</td>
                      <td>{item.mobileNumber}</td>
                      <td>{item.limit}</td>
                      <td>{formatDate(item.createdAt)}</td>
                      <td>{item.agentShare}</td>
                      <td>
                        {
                          item.status == 'ACTIVE' ? (<span className="badge bg-success">{item.status}</span>) : (<span className="badge bg-danger">{item.status}</span>)
                        }

                      </td>
                      <td>
                        <div style={{ display: "inline-flex" }}>
                          <Link to={`./edit/${item._id}`}><i className="fa fa-edit" style={{ color: 'green' }}></i></Link>
                          <div className="form-check form-switch ms-2">
                            <input className="form-check-input" type="checkbox" id={`checkbox-${item._id}`} checked={item.status == 'ACTIVE' ? true : false} onChange={()=>handleCheckboxChange(item)} />
                            <label className="form-check-label" htmlFor={`checkbox-${item._id}`}></label>
                          </div>
                          <Link to={`#`} onClick={()=>handleDelete(item)}><i className="fa fa-trash" style={{ color: 'red' }}></i></Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )
              }

            </tbody>
          </table>
            {!loading && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
        </div>
      </div>

    </div >
  );
}

export default AgnetList