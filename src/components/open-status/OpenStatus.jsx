import { useEffect, useState } from 'react'
import Notifier from '../Notifier';
import Axios from '../../api/Axios';

const OpenStatus = () => {


    const [singleList, setSingleList] = useState([
        { _id: 1, totalAmount: 0 },
        { _id: 2, totalAmount: 0 },
        { _id: 3, totalAmount: 0 },
        { _id: 4, totalAmount: 0 },
        { _id: 5, totalAmount: 0 },
        { _id: 6, totalAmount: 0 },
        { _id: 7, totalAmount: 0 },
        { _id: 8, totalAmount: 0 },
        { _id: 9, totalAmount: 0 },
        { _id: 0, totalAmount: 0 }]);

    const [currentOpenStatus, setCurrentOpenStatus] = useState([]);
    const [singleTotalAmount, setSingleTotalAmount] = useState(0);
    const [jodiTotalAmount, setJodiTotalAmount] = useState(0);
    const [pattiTotalAmount, setPattiTotalAmount] = useState(0);
    const [jodiList, setJodiList] = useState([]);
    const [pattiList, setPattiList] = useState([]);
    const [drowList, setDrowList] = useState([]);
    // const [apiData, setApiData] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [drow, setDrow] = useState('');
    const [round, setRound] = useState('');

    const getOpentStatus = async () => {
        try {
            const { data } = await Axios.get('/open-status/list', {
                params: {
                    selectedDate,
                    drowId: drow,
                    roundType: round
                }
            });
            // console.log(data);
            const single = data?.gameTypeWiseAmount?.find(e => e._id === 'SINGLE')
            const jodi = data?.gameTypeWiseAmount?.find(e => e._id === 'JODI')
            const patti = data?.gameTypeWiseAmount?.find(e => e._id === 'PATTI')
            setSingleTotalAmount(single?.totalAmount || 0)
            setJodiTotalAmount(jodi?.totalAmount || 0)
            setPattiTotalAmount(patti?.totalAmount || 0)

            const reorderedArray = singleList.map(originalItem =>
                data?.sglNumWiseTotalAmount?.find(responseItem => responseItem._id === originalItem._id) || originalItem
            );

            console.log(data?.currentOpenStatus);
            setCurrentOpenStatus(data?.currentOpenStatus || [])
            
            setSingleList(reorderedArray)
            // setApiData(data)
            setPattiList(data?.pattiNumWiseTotalAmount || [])
            setJodiList(data?.jodiNumWiseTotalAmount || [])

        } catch (err) {

            Notifier(err?.meta?.msg, 'Error')
        }
    };



    const getDrowList = async () => {
        try {
            const { data } = await Axios.get('/drow/list?status=ACTIVE');
            setDrowList(data)
        } catch (err) {

            Notifier(err?.meta?.msg, 'Error')
        }
    };


    const handelStatus = (event) => {
        event.preventDefault();
        getOpentStatus();
    }

    useEffect(() => {
        // const today = new Date();
        // const formattedDate = today.toISOString().split("T")[0];
        // setSelectedDate(formattedDate);

        getDrowList();
        getOpentStatus();
    }, []);


    return (
        <>
            <div className="row">
                <div className="col-12 col-lg-12 col-xxl-12">
                    <div className="card flex-fill">
                        <table className="table table-bordered my-0">
                            <tbody>
                                <tr style={{ background: '#e9e8e8' }}>
                                    <td>
                                        <input type="date" name="selectedDate" id=""
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <div><h3><span>SINGLE + JODI = TOTAL</span></h3></div>
                                        <div className='open-status-amount'><i className="fa fa-rupee">{singleTotalAmount + jodiTotalAmount}</i></div>
                                    </td>
                                    <td>
                                        <div><h3><span>PATTI TOTAL</span></h3></div>
                                        <div className='open-status-amount'><i className="fa fa-rupee">{pattiTotalAmount}</i></div>
                                    </td>
                                    <td>
                                        <div><h3><span>FINAL TOTAL</span></h3></div>
                                        <div className='open-status-amount'><i className="fa fa-rupee">{singleTotalAmount + jodiTotalAmount + pattiTotalAmount}</i></div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <select className="form-select" onChange={(event) => setDrow(event.target.value)} required>
                                            <option value="" >Drow</option>
                                            {
                                                drowList.map((item) => (
                                                    <option key={item._id} value={item._id}>{`${item.name}`}</option>
                                                ))
                                            }
                                        </select>
                                    </td>
                                    <td>
                                        <div className='d-flex align-items-center p-2'>

                                            <select className="form-select" onChange={(event) => setRound(event.target.value)} required>
                                                <option value="" >Round</option>
                                                <option value="OPEN" >OPEN</option>
                                                <option value="CLOSE" >CLOSE</option>
                                            </select>

                                            <button className='btn btn-primary mx-2' type="button" onClick={handelStatus}>Status</button>
                                        </div>
                                    </td>
                                    <td colSpan="2">
                                        <div className='text-center p-2'>0</div>
                                    </td>

                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-lg-3 col-xxl-3">
                    <div className="card flex-fill">
                        <table className="table table-bordered my-0">
                            <tbody>
                                <tr>
                                    <th>NUM</th>
                                    <th>BOOK</th>
                                    <th>Profit/Loss</th>
                                </tr>
                                {
                                    singleList.map(item => (
                                        <tr key={item._id}>
                                            <td>{item._id}</td>
                                            <td>{item.totalAmount}</td>
                                            <td><span className='profit'>0</span></td>
                                        </tr>
                                    ))
                                }

                                {/* <tr>
                                    <td>1</td>
                                    <td>60</td>
                                    <td><span className='loss'>80</span></td>
                                </tr> */}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-12 col-lg-3 col-xxl-3">
                    <div className="card flex-fill">
                        <table className="table table-bordered my-0">
                            <tbody>
                                <tr>
                                    <th>JODI</th>
                                    <th>AMOUNT</th>
                                    <th>Profit/Loss</th>
                                </tr>
                                {
                                    jodiList.map(item => (
                                        <tr key={item._id}>
                                            <td>{item._id}</td>
                                            <td>{item.totalAmount}</td>
                                            <td><span className='profit'>0</span></td>
                                        </tr>
                                    ))
                                }
                                {/* <tr>
                                    <td>1</td>
                                    <td>60</td>
                                    <td><span className='loss'>80</span></td>
                                </tr> */}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-12 col-lg-3 col-xxl-3">
                    <div className="card flex-fill">
                        <table className="table table-bordered my-0">
                            <tbody>
                                <tr>
                                    <th>PATTI</th>
                                    <th>AMOUNT</th>
                                    <th>Profit/Loss</th>
                                </tr>
                                {
                                    pattiList.map(item => (
                                        <tr key={item._id}>
                                            <td>{item._id}</td>
                                            <td>{item.totalAmount}</td>
                                            <td><span className='profit'>0</span></td>
                                        </tr>
                                    ))
                                }
                                {/* <tr>
                                    <td>1</td>
                                    <td>60</td>
                                    <td><span className='loss'>80</span></td>
                                </tr> */}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-12 col-lg-3 col-xxl-3">
                    <div className="card flex-fill">
                        <table className="table table-bordered my-0">
                            <tbody>
                                <tr>
                                    <th colSpan="4" className='text-center p-2'>CURRENT OPEN STATUS</th>
                                </tr>
                                <tr>
                                    <th>ROUND</th>
                                    <th>SINGLE</th>
                                    <th>JODI</th>
                                    <th>PATTI</th>
                                </tr>
                                {
                                    currentOpenStatus.map(item => (
                                        <tr key={item._id}>
                                            <td>{item._id}</td>
                                            <td>{item.singleCount}</td>
                                            <td>{item.jodiCount}</td>
                                            <td>{item.pattiCount}</td>

                                        </tr>
                                    ))
                                }


                                <tr>
                                    <th colSpan="4" className='text-center p-2'>TOTAL DUE STATUS</th>
                                </tr>
                                <tr>
                                    <th colSpan="3" >PATTI BOOKING RS.</th>
                                    <th>0</th>
                                </tr>
                                <tr>
                                    <th colSpan="3" >Signle+Jodi</th>
                                    <th >0</th>
                                </tr>
                                <tr>
                                    <th colSpan="3" >Net Profit/Loss</th>
                                    <th>0</th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OpenStatus