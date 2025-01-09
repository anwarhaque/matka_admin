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

    const [openPatti, setOpenPatti] = useState('');
    const [closePatti, setClosePatti] = useState('');

    const [currentOpenStatus, setCurrentOpenStatus] = useState([]);
    const [singleTotalAmount, setSingleTotalAmount] = useState(0);
    const [jodiTotalAmount, setJodiTotalAmount] = useState(0);
    const [pattiTotalAmount, setPattiTotalAmount] = useState(0);
    const [singleList, setSingleList] = useState(initialState);
    const [jodiList, setJodiList] = useState([]);
    const [pattiList, setPattiList] = useState([]);
    const [drowList, setDrowList] = useState([]);
    const [apiData, setApiData] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [drow, setDrow] = useState('');
    const [round, setRound] = useState('');
    const [result, setResult] = useState('');


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


    useEffect(() => {
        const handler = setTimeout(() => {
            if (`${openPatti}`.length === 3 || `${closePatti}`.length === 3) {
                handelCheck();
            }
        }, 300);

        // Cleanup the timeout on dependency change
        return () => {
            clearTimeout(handler);
        };
    }, [openPatti, closePatti]); // Dependencies to watch

    const handelCheck = () => {
        // console.log('lll');

        if (round === 'OPEN' && openPatti === '') {
            return 
        }
        if (round === 'CLOSE' && closePatti === '') {
            return 
        }
        // if (round === 'CLOSE' && openPatti === '') {
        //     return Notifier('Enter Open Patti', 'Error')
        // }
        // if (round === 'CLOSE' && closePatti === '') {
        //     return Notifier('Enter Close Patti', 'Error')
        // }

        const singleNum = sumOfDigits(round === 'OPEN' ? openPatti : closePatti) % 10
        const pattiNum = round === 'OPEN' ? openPatti : closePatti

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

            if (item._id === pattiNum) {

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

        if (openPatti !== '' && closePatti !== '') {
            // console.log(closePatti);
            
        const jodiNum = `${sumOfDigits(openPatti) % 10}${sumOfDigits(closePatti) % 10}`
        // console.log(jodiNum);
        // console.log(jodiNum);
        const newJodiList = jodiList?.map(item => {
            if (item._id === jodiNum) {
                item.totalProfitLoss = - ((item.totalAmount * 90) + item.totalCommAmount)
            } else {
                item.totalProfitLoss = item.totalAmount - item.totalCommAmount
            }
            return item
        })
        setJodiList(newJodiList)
        }else{
            setJodiList(apiData?.jodiNumWiseTotalAmount || [])
        }
        // setJodiList(newJodiList)


        setSingleList(newSingleList)
        setPattiList(newPattiList)

    }

    const handelSubmit = async () => {
        if (round === 'OPEN' && openPatti === '') {
            return Notifier('Enter Open Patti', 'Error')
        }
        if (round === 'CLOSE' && openPatti === '') {
            return Notifier('Enter Open Patti', 'Error')
        }
        if (round === 'CLOSE' && closePatti === '') {
            return Notifier('Enter Close Patti', 'Error')
        }
        const updateData = {
            selectedDate,
            drowId: drow,
            roundType: round,
            openPatti,
            closePatti
        }

        try {
            const { meta } = await Axios.post('/open-status/result', updateData);

            if(meta.status){
                Notifier(meta?.msg, 'Success')
            }else{
                Notifier(meta?.msg, 'Error')
            }

        } catch (err) {
            Notifier(err?.meta?.msg, 'Error')
        }


    }
    const getOpentStatus = async () => {
        try {

            round==='OPEN'?setOpenPatti(''):setClosePatti('')

            const { data, result } = await Axios.get('/open-status/list', {
                params: {
                    selectedDate,
                    drowId: drow,
                    roundType: round
                }
            });


            const single = data?.gameTypeWiseAmount?.find(e => e._id === 'SINGLE')
            const jodi = data?.gameTypeWiseAmount?.find(e => e._id === 'JODI')
            const patti = data?.gameTypeWiseAmount?.find(e => e._id === 'PATTI')
            setSingleTotalAmount(single?.totalAmount - single?.totalCommAmount || 0)
            setJodiTotalAmount(jodi?.totalAmount - jodi?.totalCommAmount || 0)
            setPattiTotalAmount(patti?.totalAmount - patti?.totalCommAmount || 0)

            setApiData(data)

            // console.log(data?.currentOpenStatus);
            setCurrentOpenStatus(data?.currentOpenStatus || [])

            const reorderedArray = initialState.map(_item => {
                const isExist = data?.sglNumWiseTotalAmount?.find(_res => _res._id == _item._id)
                if (isExist) {
                    _item.totalAmount = isExist.totalAmount
                    _item.totalCommAmount = isExist.totalCommAmount
                }
                return _item
            });

            setSingleList(reorderedArray)

            setPattiList(data?.pattiNumWiseTotalAmount || [])
            setJodiList(data?.jodiNumWiseTotalAmount || [])

            // debugger
            setResult(result)
            if (result) {
                if (result.openPatti) {
                    setOpenPatti(result.openPatti)
                }
                if (result.closePatti) {
                    setClosePatti(result.closePatti)
                }

            }

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
       
    }, []);
    useEffect(() => {
       
        setOpenPatti('')
        setClosePatti('')
       
    }, [selectedDate, drow]);


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
                                        <div className='open-status-amount'><i className="fa fa-rupee"></i>{singleTotalAmount} + <i className="fa fa-rupee"></i>{jodiTotalAmount} = <i className="fa fa-rupee"></i>{singleTotalAmount + jodiTotalAmount}</div>
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
                                            <label htmlFor="">Open Patti</label>
                                            <input className="form-control mx-2 input-patti" type="text" disabled={ round === 'OPEN' ? false : true}
                                                value={openPatti}
                                                onChange={(e) => setOpenPatti(e.target.value)} />
                                            <label htmlFor="">Close Patti</label>
                                            <input className="form-control mx-2 input-patti" type="text" disabled={ round === 'CLOSE' ? false : true}
                                                value={closePatti}
                                                onChange={(e) => setClosePatti(e.target.value)} />

                                            <button className='btn btn-primary mx-2' type="button" disabled={result?.closePatti?true:false} onClick={handelSubmit}>Submit</button>


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
                                    <th className='bg-purple'>NUM</th>
                                    <th className='bg-purple'>BOOK</th>
                                    <th className='bg-purple'>Profit/Loss</th>
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

                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-12 col-lg-3 col-xxl-3">
                    <div className="card flex-fill">
                        <table className="table table-bordered my-0">
                            <tbody>
                                <tr>
                                    <th className='bg-purple'>JODI</th>
                                    <th className='bg-purple'>AMOUNT</th>
                                    <th className='bg-purple'>Profit/Loss</th>
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

                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-12 col-lg-3 col-xxl-3">
                    <div className="card flex-fill">
                        <table className="table table-bordered my-0">
                            <tbody>
                                <tr>
                                    <th className='bg-purple'>PATTI</th>
                                    <th className='bg-purple'>AMOUNT</th>
                                    <th className='bg-purple'>Profit/Loss</th>
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

                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-12 col-lg-3 col-xxl-3">
                    <div className="card flex-fill">
                        <table className="table table-bordered my-0">
                            <tbody>
                                <tr>
                                    <th colSpan="4" className='text-center p-2 bg-purple'>CURRENT OPEN STATUS</th>
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


                                {/* <tr>
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
                                </tr> */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OpenStatus