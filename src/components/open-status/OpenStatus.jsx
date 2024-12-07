import { useEffect, useState } from 'react'
import Notifier from '../Notifier';
import Axios from '../../api/Axios';

const OpenStatus = () => {

    const initialState = [
        { _id: 1, totalAmount: 0, totalCommAmount: 0, totalProfitLoss: 0 },
        { _id: 2, totalAmount: 0, totalCommAmount: 0, totalProfitLoss: 0 },
        { _id: 3, totalAmount: 0, totalCommAmount: 0, totalProfitLoss: 0 },
        { _id: 4, totalAmount: 0, totalCommAmount: 0, totalProfitLoss: 0 },
        { _id: 5, totalAmount: 0, totalCommAmount: 0, totalProfitLoss: 0 },
        { _id: 6, totalAmount: 0, totalCommAmount: 0, totalProfitLoss: 0 },
        { _id: 7, totalAmount: 0, totalCommAmount: 0, totalProfitLoss: 0 },
        { _id: 8, totalAmount: 0, totalCommAmount: 0, totalProfitLoss: 0 },
        { _id: 9, totalAmount: 0, totalCommAmount: 0, totalProfitLoss: 0 },
        { _id: 0, totalAmount: 0, totalCommAmount: 0, totalProfitLoss: 0 },
    ];

    const [openResult, setOpenResult] = useState('');
    const [closeResult, setCloseResult] = useState('');

    const [currentOpenStatus, setCurrentOpenStatus] = useState([]);
    const [singleTotalAmount, setSingleTotalAmount] = useState(0);
    const [jodiTotalAmount, setJodiTotalAmount] = useState(0);
    const [pattiTotalAmount, setPattiTotalAmount] = useState(0);
    const [singleList, setSingleList] = useState(initialState);
    const [jodiList, setJodiList] = useState([]);
    const [pattiList, setPattiList] = useState([]);
    const [drowList, setDrowList] = useState([]);
    // const [apiData, setApiData] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [drow, setDrow] = useState('');
    const [round, setRound] = useState('');


    const sumOfDigits = (number) => {
        const digits = number.toString().split('');
        const sum = digits.reduce((acc, digit) => acc + parseInt(digit), 0);
        return sum;
    }

    function checkPatti(number) {
        // Convert the number to a string for easy character comparison
        const numStr = number.toString();

        if (numStr.length !== 3) {
            return null;
        }

        // Create a map to count the occurrences of each digit
        const digitCount = {};

        for (const digit of numStr) {
            digitCount[digit] = (digitCount[digit] || 0) + 1;
        }

        const values = Object.values(digitCount);

        if (values.includes(3)) {
            return 'TRIPPLE PATTI';
        } else if (values.includes(2)) {
            return "DOUBLE PATTI";
        } else {
            return "SINGLE PATTI";
        }
    }

    const handelCheck = () => {


        const singleNum = sumOfDigits(round === 'OPEN' ? openResult : closeResult) % 10
        const pattiNum = round === 'OPEN' ? openResult : closeResult

        const newSingleList = singleList?.map(item => {

            if (item._id === singleNum) {
                item.totalProfitLoss = - ((item.totalAmount * 9) + item.totalCommAmount)
            } else {
                item.totalProfitLoss = item.totalAmount - item.totalCommAmount
            }
            return item
        })
        const newPattiList = pattiList?.map(item => {
            // console.log(item._id, pattiNum);

            if (item._id === parseInt(pattiNum)) {

                if (checkPatti(pattiNum) === 'SINGLE PATTI') {
                    item.totalProfitLoss = - ((item.totalAmount * 140) + item.totalCommAmount)
                }
                else if (checkPatti(pattiNum) === 'DOUBLE PATTI') {
                    item.totalProfitLoss = - ((item.totalAmount * 280) + item.totalCommAmount)
                }
                else if (checkPatti(pattiNum) === 'TRIPPLE PATTI') {
                    item.totalProfitLoss = - ((item.totalAmount * 840) + item.totalCommAmount)
                }
            } else {
                item.totalProfitLoss = item.totalAmount - item.totalCommAmount
            }
            return item
        })

        if (openResult !== '' && closeResult !== '') {

            const jodiNum = `${sumOfDigits(openResult) % 10}${sumOfDigits(closeResult) % 10}`
            // console.log(jodiNum);
            const newJodiList = jodiList?.map(item => {
                if (item._id === parseInt(jodiNum)) {
                    item.totalProfitLoss = - ((item.totalAmount * 90) + item.totalCommAmount)

                } else {
                    item.totalProfitLoss = item.totalAmount - item.totalCommAmount
                }
                return item
            })
            setJodiList(newJodiList)
        }


        setSingleList(newSingleList)
        setPattiList(newPattiList)

    }

    const getOpentStatus = async () => {
        try {
            // setSingleList(initialState)
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
            setSingleTotalAmount(single?.totalAmount - single?.totalCommAmount || 0)
            setJodiTotalAmount(jodi?.totalAmount - jodi?.totalCommAmount || 0)
            setPattiTotalAmount(patti?.totalAmount - patti?.totalCommAmount || 0)

            const reorderedArray = initialState.map(_item => {
                const isExist = data?.sglNumWiseTotalAmount?.find(_res => _res._id === _item._id)
                if (isExist) {
                    _item.totalAmount = isExist.totalAmount
                    _item.totalCommAmount = isExist.totalCommAmount
                }
                return _item
            }
            );

            // console.log(data?.currentOpenStatus);
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
        if (!drow) {
            return Notifier('Select Drow', 'Error')
        }
        if (!round) {
            return Notifier('Select Round', 'Error')
        }
        getOpentStatus();
    }

    useEffect(() => {
        getDrowList();
        // getOpentStatus();
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
                                        <div className='open-status-amount'><i className="fa fa-rupee">{singleTotalAmount} + {jodiTotalAmount} = {singleTotalAmount + jodiTotalAmount}</i></div>
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

                                        <div className='d-flex align-items-center p-2'>
                                            <label htmlFor="">Open</label>
                                            <input className="form-control mx-2" type="text" disabled={round == 'CLOSE'}
                                                value={openResult}
                                                onChange={(e) => setOpenResult(e.target.value)} />
                                            <label htmlFor="">Close</label>
                                            <input className="form-control mx-2" type="text" disabled={round == 'OPEN'}
                                                value={closeResult}
                                                onChange={(e) => setCloseResult(e.target.value)} />
                                            <button className='btn btn-primary mx-2' type="button" onClick={handelCheck}>Check</button>

                                            {/* {
                                                round == 'OPEN' && (
                                                    <>
                                                        <label htmlFor="">Open</label>
                                                        <input className="form-control mx-2" type="text"
                                                            value={openResult}
                                                            onChange={(e) => setOpenResult(e.target.value)} />
                                                        <button className='btn btn-primary mx-2' type="button" onClick={handelCheck}>Check</button>

                                                    </>

                                                )
                                            }
                                            {
                                                round == 'CLOSE' && (
                                                    <>
                                                        <label htmlFor="">Close</label>
                                                        <input className="form-control mx-2" type="text"
                                                            value={closeResult}
                                                            onChange={(e) => setCloseResult(e.target.value)} />
                                                        <button className='btn btn-primary mx-2' type="button" onClick={handelCheck}>Check</button>

                                                    </>

                                                )
                                            } */}


                                        </div>
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
                                            <td>{item?.totalAmount - item?.totalCommAmount}</td>
                                            <td>
                                                <span className={item.totalProfitLoss >= 0 ? 'profit' : 'loss'}>{item.totalProfitLoss}</span>
                                            </td>
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
                                            <td>{item.totalAmount - item?.totalCommAmount}</td>
                                            <td>
                                                <span className={item.totalProfitLoss >= 0 ? 'profit' : 'loss'}>{item.totalProfitLoss}</span>
                                            </td>
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
                                            <td>{item.totalAmount - item?.totalCommAmount}</td>
                                            <td>
                                                <span className={item.totalProfitLoss >= 0 ? 'profit' : 'loss'}>{item.totalProfitLoss}</span>
                                            </td>
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