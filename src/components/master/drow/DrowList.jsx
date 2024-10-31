import { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import Notifier from '../../Notifier';
import Axios from '../../../api/Axios';
import RateList from '../../rate/RateList';

const DrowList = () => {
    const [drowList, setDrowList] = useState([]);
    const [loading, setLoading] = useState(true);


    const getDrowList = async () => {
        try {
            const { data } = await Axios.get('/drow/list');
            setDrowList(data)
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
            const res = await Axios.put(`/drow/status/${item._id}`, {
                status: item.status == 'ACTIVE' ? 'DEACTIVE' : 'ACTIVE'
            });
            Notifier(res.meta.msg, 'Success')
            getDrowList()
        } catch (err) {
            Notifier(err.meta.msg, 'Error')
        }
    };
    const handleDelete = async (item) => {
        try {
            const res = await Axios.delete(`/drow/delete/${item._id}`);
            Notifier(res.meta.msg, 'Success')
            getDrowList()
        } catch (err) {
            Notifier(err.meta.msg, 'Error')
        }
    };


    useEffect(() => {
        getDrowList();
    }, []);

    return (
        <div className="row">
            <div className="col-12 col-lg-8 col-xxl-8 d-flex">
                <div className="card flex-fill">
                    <div className="card-header">
                        <h5 className="card-title mb-0">Drow List</h5>
                        <Link type="button" className='btn btn-primary float-right' to='./add'>Add Drow</Link>
                    </div>
                    <table className="table table-hover my-0">
                        <thead>
                            <tr>
                                <th>S.N.</th>
                                <th>Name</th>
                                <th className="d-none d-xl-table-cell">Open Time</th>
                                <th className="d-none d-xl-table-cell">Closed Time</th>
                                <th>Status</th>
                                <th>Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                loading ? (<tr><td calpan="4">Loading...</td></tr>) : (
                                    drowList.map((item, index) => (
                                        <tr key={item._id}>
                                            <td>{index + 1}</td>
                                            
                                            <td className="d-none d-xl-table-cell">{item.name}</td>
                                            <td className="d-none d-md-table-cell">{item.openTime}</td>
                                            <td className="d-none d-md-table-cell">{item.closeTime}</td>
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
                                                    <Link to={`#`} onClick={() => handleDelete(item)}><i className="fa fa-trash" style={{ color: 'red' }}></i></Link>
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

            <div className="col-12 col-lg-4 col-xxl-4 d-flex">
                <RateList/>
            </div>
        </div >
    );
}

export default DrowList