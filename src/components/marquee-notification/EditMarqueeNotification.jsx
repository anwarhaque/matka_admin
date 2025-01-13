import { useState, useEffect } from 'react'
import Notifier from '../Notifier';
import Axios from '../../api/Axios';

const EditMarqueeNotification = () => {

    const [notification, setNotification] = useState("");
    const [marquee, setMarquee] = useState(null);
   


    const handleUpdate = async (event) => {
        event.preventDefault();

        try {

            console.log(notification);

            const res = await Axios.put(`/marquee/updateMarquee/${marquee._id}`, { notification }); // Use the Axios instance
           
            Notifier(res.meta.msg, 'Success')
        } catch (error) {
            Notifier(error?.meta?.msg, 'Error')
        }

    }



    const getMarquee = async () => {
        try {
            const { data } = await Axios.get(`/marquee/getMarquee`);
            setMarquee(data)
            setNotification(data.notification)
        } catch (error) {
            Notifier(error?.meta?.msg, 'Error')
        }
    }

    useEffect(() => {
        getMarquee();
    }, []);

    return (
        <div className="row">
            <div className="col-12 col-lg-12">
                <div className="card">
                    <div className="card-header">
                        <h5 className="h3 card-title mb-0">Edit Marquee Notifiation</h5>
                    </div>
                    <div className="card-body">

                        <form onSubmit={handleUpdate}>

                            <div className="form-group mb-2">
                                <label htmlFor="exampleFormControlTextarea1">Notification</label>
                                <textarea
                                    className="form-control"
                                    id="exampleFormControlTextarea1"
                                    rows="3"
                                    value={notification}
                                    onChange={(e) => setNotification(e.target.value)}
                                    required
                                ></textarea>
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

export default EditMarqueeNotification