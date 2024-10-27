import { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import Notifier from '../../Notifier';
import Axios from '../../../api/Axios';

const ClientList = () => {
    const [list, setlist] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAgentList = async () => {
        try {
            const { data } = await Axios.get('/listUser', {
                params: {
                    userType: "CLIENT"
                }
            });


            setlist(data)
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
            const res = await Axios.put(`/changeStatus/${item._id}`, {
                status: item.status == 'ACTIVE' ? 'DEACTIVE' : 'ACTIVE'
            });
            Notifier(res.meta.msg, 'Success')
            getAgentList()
        } catch (err) {
            Notifier(err.meta.msg, 'Error')
        }


    };


    useEffect(() => {

        getAgentList();
    }, []);

    return (
        <div className="row">
            <div className="col-12 col-lg-12 col-xxl-12 d-flex">
                <div className="card flex-fill">
                    <div className="card-header">
                        <h5 className="card-title mb-0">Client List</h5>
                        <Link type="button" className='btn btn-primary float-right' to='./add'>Add Client</Link>
                    </div>
                    <table className="table table-hover my-0">
                        <thead>
                            <tr>
                                <th>S.N.</th>
                                <th>Code[Password]</th>
                                <th className="d-none d-xl-table-cell">Client Name</th>
                                <th className="d-none d-xl-table-cell">Mobile Number</th>
                                <th className="d-none d-xl-table-cell">Agent Name</th>
                                <th className="d-none d-xl-table-cell">Agent Share</th>
                                <th className="d-none d-xl-table-cell">Client Share</th>
                                <th className="d-none d-xl-table-cell">Limit</th>
                                <th className="d-none d-xl-table-cell">D.O.J</th>
                                <th className="d-none d-xl-table-cell">Super Agent Comm.</th>
                                <th>Status</th>
                                <th>Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                loading ? (<tr><td calpan="4">Loading...</td></tr>) : (
                                    list.map((item, index) => (
                                        <tr key={item._id}>
                                            <td>{index + 1}</td>
                                            <td>{item.userName} [{item.plane_password}]</td>
                                            <td className="d-none d-xl-table-cell">{item.name}</td>
                                            <td className="d-none d-xl-table-cell">{item.mobileNumber}</td>
                                            <td className="d-none d-xl-table-cell">{`${item?.agent?.name} (${item?.agent?.userName})`}</td>
                                            <td className="d-none d-xl-table-cell">{item?.agentShare}</td>
                                            <td className="d-none d-xl-table-cell">{item?.clientShare}</td>
                                            <td className="d-none d-md-table-cell">{item.limit}</td>
                                            <td className="d-none d-md-table-cell">{formatDate(item.createdAt)}</td>
                                            <td className="d-none d-md-table-cell">{item.commission}</td>
                                            <td>
                                                {
                                                    item.status == 'ACTIVE' ? (<span className="badge bg-success">{item.status}</span>) : (<span className="badge bg-danger">{item.status}</span>)
                                                }

                                            </td>
                                            <td>
                                                <div style={{ display: "inline-flex" }}>
                                                    <Link to={`./edit/${item._id}`}><i className="fa fa-edit" style={{ color: 'green' }}></i></Link>
                                                    <div className="form-check form-switch ms-2">
                                                        <input className="form-check-input" type="checkbox" id={`checkbox-${item._id}`} checked={item.status == 'ACTIVE' ? true : false} onChange={() => handleCheckboxChange(item)} />
                                                        <label className="form-check-label" htmlFor={`checkbox-${item._id}`}></label>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )
                            }

                        </tbody>
                    </table>
                </div>
            </div>

        </div >
    );
}

export default ClientList