import { useState, useEffect } from 'react'
import Notifier from '../../Notifier';
import Axios from '../../../api/Axios';
import { useParams } from 'react-router-dom';

const EditDrow = () => {
    const [name, setName] = useState("");
    const [openTime, setOpenTime] = useState("");
    const [closeTime, setCloseTime] = useState("");
    const { drowId } = useParams();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await Axios.put(`drow/update/${drowId}`, { name, openTime, closeTime }); // Use the Axios instance
            Notifier(res.meta.msg, 'Success')
        } catch (error) {
            Notifier(error?.meta?.msg, 'Error')
        }
    }

    const getUser = async () => {
        try {

            const { data } = await Axios.get(`/drow/details/${drowId}`);
            setName(data.name)
            setOpenTime(data.openTime)
            setCloseTime(data.closeTime)

        } catch (error) {
            Notifier(error?.meta?.msg, 'Error')
        }
    }

    useEffect(() => {
        getUser();
    }, [drowId]);

    return (
        <div className="row">
            <div className="col-12 col-lg-6">
                <div className="card">
                    <div className="card-header">
                        <h5 className="h3 card-title mb-0">Edit Drow</h5>
                    </div>
                    <div className="card-body">

                        <form onSubmit={handleSubmit}>

                            <div className="form-group mb-2">
                                <label htmlFor="drowName">Drow Name</label>
                                <input type="text" id="drowName" className="form-control" placeholder=""
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group mb-2">
                                <label htmlFor="openTime">Open Time</label>
                                <input type="time" id="openTime" className="form-control" placeholder=""
                                    value={openTime}
                                    onChange={(e) => setOpenTime(e.target.value)}
                                    required />
                            </div>
                            <div className="form-group mb-2">
                                <label htmlFor="closeTime">Close Time</label>
                                <input type="time" id="closeTime" className="form-control" placeholder=""
                                    value={closeTime}
                                    onChange={(e) => setCloseTime(e.target.value)}
                                    required />
                            </div>
                            <div className="row mt-4"></div>
                            <button type="submit" className="btn btn-primary">Update</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditDrow