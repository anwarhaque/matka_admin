import { useState, useEffect } from 'react'
import Notifier from '../../Notifier';
import Axios from '../../../api/Axios';

const AddClient = () => {
    const [list, setlist] = useState([]);
    const [agentId, setAgentId] = useState("");
    const [name, setName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [password, setPassword] = useState("");

    const [rate, setRate] = useState(0);
    const [agentCommission, setAgentCommission] = useState(0);
    const [clientCommission, setClientCommission] = useState(0);
    const [clientShare, setClientShare] = useState(0);


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await Axios.post('/admin/createClient', { agentId, name, mobileNumber, password, agentCommission, clientCommission, rate, clientShare }); // Use the Axios instance
            Notifier(res.meta.msg, 'Success')
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
            setlist(data)
        } catch (err) {
            Notifier(err.meta.msg, 'Error')
        }
    };

    const handleRateChange = (e) => {
        const newRate = Number(e.target.value);
        setRate(newRate);
        setAgentCommission(newRate ? newRate : 0);
        setClientCommission(0)
    };

    useEffect(() => {
        getAgentList();
    }, []);


    return (
        <div className="row">
            <div className="col-12 col-lg-6">
                <div className="card">
                    <div className="card-header">
                        <h5 className="h3 card-title mb-0">Add Client</h5>
                    </div>
                    <div className="card-body">

                        <form onSubmit={handleSubmit}>

                            <div className="form-group mb-2">
                                <select className="form-select mb-3" value={agentId} onChange={(e) => setAgentId(e.target.value)} required>
                                    <option value="" >Select Agent</option>
                                    {
                                        list.map((item) => (
                                            <option key={item._id} value={item._id}>{`${item.name} (${item.userName})`}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="form-group mb-2">
                                <label htmlFor="agentName">Client Name</label>
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
                                <label htmlFor="password">Rate</label>
                                <select className="form-select mb-3" value={rate} onChange={handleRateChange} required>
                                    <option value="0" key={'100(0% Commission)'} >100(0% Commission)</option>
                                    <option value="10" key={'90(10% Commission)'} >90(10% Commission)</option>
                                </select>
                            </div>
                            <div className="form-group mb-2">
                                <label htmlFor="agent_commission">Agent Commission</label>
                                <input type="number" id="agent_commission" className="form-control" placeholder=""
                                    value={agentCommission}
                                    onChange={(e) => { setAgentCommission(Number(e.target.value)); setClientCommission(rate - Number(e.target.value)) }}
                                    disabled={!rate}
                                    min={0}
                                    max={10}
                                    required />
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="client_commission">Client Commission</label>
                                <input type="number" id="client_commission" className="form-control" placeholder=""
                                    value={clientCommission}
                                    disabled
                                    min={0}
                                    max={10}
                                    required />
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="sup_commission">Share</label>
                                <input type="number" id="sup_commission" className="form-control" placeholder=""
                                    value={clientShare}
                                    onChange={(e) => setClientShare(Number(e.target.value))}
                                    min={0}
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

export default AddClient