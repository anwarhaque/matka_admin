import React, { useState, useEffect } from 'react'
import Notifier from '../Notifier';
import Axios from '../../api/Axios';

const AgentReport = () => {
  const [drowList, setDrowList] = useState([]);
  const [reports, setReports] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [drowId, setDrowId] = useState('');
  const [clientId, setClientId] = useState('');
  const [agentId, setAgentId] = useState('');
  const [clientList, setClientList] = useState([]);
  const [agentList, setAgentList] = useState([]);


  const getDrowList = async () => {
    try {
      const { data } = await Axios.get('/drow/list?status=ACTIVE');
      setDrowList(data)
    } catch (err) {

      Notifier(err?.meta?.msg, 'Error')
    }
  };

  const getReport = async (event) => {
    event.preventDefault();

    const query = {
      startDate,
      endDate,
      drowId,
      agentId,
      clientId
    }



    try {

      const { data } = await Axios.get('/report/agentReport', { params: query });

      setReports(data)

    } catch (err) {
      Notifier(err?.meta?.msg, 'Error')
    }
  }

  const getAgentList = async () => {
    try {
      const { data } = await Axios.get('/admin/listUser', {
        params: {
          userType: "AGENT"
        }
      });
      setAgentList(data)

    } catch (err) {
      Notifier(err.meta.msg, 'Error')
    }
  };

  const getClientList = async (agentId) => {
    try {
      const { data } = await Axios.get('/admin/listUser', {
        params: {
          userType: "CLIENT",
          agentId: agentId
        }
      });
      setClientList(data)
    } catch (err) {
      Notifier(err.meta.msg, 'Error')
    }
  };


  useEffect(() => {
    getDrowList();
    getAgentList()
  }, []);

  useEffect(() => {
    getClientList(agentId);
  }, [agentId]);


  return (
    <div className="row">
      <div className="col-12 col-lg-12">
        <div className="card">
          <div className="card-header">
            <h5 className="h3 card-title mb-0">Agent Report</h5>
            <div className="row mt-4">
              <form onSubmit={getReport} >
                <div className="row">
                  <div className="col">
                    <input type="date" id="startDate" className="form-control"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col">
                    <input type="date" id="endDate" className="form-control"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required />
                  </div>
                  <div className="col">
                    <select className="form-select" onChange={(event) => setAgentId(event.target.value)} required>
                      <option value="" >Agent</option>
                      {
                        agentList.map((item) => (
                          <option key={item._id} value={item._id}>{`${item.name} (${item.userName})`}</option>
                        ))
                      }
                    </select>
                  </div>
                  <div className="col">
                    <select className="form-select" onChange={(event) => setClientId(event.target.value)}>
                      <option value="" >client</option>
                      {
                        clientList.map((item) => (
                          <option key={item._id} value={item._id}>{`${item.name} (${item.userName})`}</option>
                        ))
                      }
                    </select>
                  </div>
                  <div className="col">
                    <select className="form-select" onChange={(event) => setDrowId(event.target.value)} >
                      <option value="" >Drow</option>
                      {
                        drowList.map((item) => (
                          <option key={item._id} value={item._id}>{`${item.name}`}</option>
                        ))
                      }
                    </select>
                  </div>

                  <div className="col">
                    <button type="submit" className="btn btn-primary">Submit</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="card-body">



            <table className="table table-sm table-bordered table-responsive">
              <tbody>
                {
                  reports.map((client, index) => (
                    <React.Fragment key={'client_' + index}>
                      <tr>
                        <td scope='col' colSpan="20" className="text-center text-bg-info">{client?.clientDetails?.name}</td>
                      </tr>
                      {
                        client?.groupedData?.map((drow, index) => (
                          <React.Fragment key={index}>
                            <tr className="text-center text-bg-success">
                              <th colSpan="4">{drow?.drowDetails?.name}</th>
                              <th colSpan="5">Single</th>
                              <th colSpan="3">Jodi</th>
                              <th colSpan="5">Patti</th>
                              <th colSpan="3">Net</th>
                            </tr>
                            <tr className='text-bg-light'>
                              <td>Dt.</td>
                              <td>Op.</td>
                              <td>Cl.</td>
                              <td>T.</td>
                              <td>Op Amt</td>
                              <td>Op T</td>
                              <td>Cl Amt</td>
                              <td>Cl T</td>
                              <td>T</td>
                              <td>Jd Amt</td>
                              <td>Jd</td>
                              <td>T</td>
                              <td>Op Amt</td>
                              <td>Op</td>
                              <td>Cl Amt</td>
                              <td>Cl</td>
                              <td>T</td>
                              <td>Payout</td>
                              <td>Comm</td>
                              <td>Bal</td>
                            </tr>
                            {drow?.days?.map((day, index) => (

                              <tr key={index}>
                                <td>{day?.day}</td>
                                <td>
                                  {
                                    (day?.totals?.SINGLE_OPEN?.totalAmount || 0) +
                                    (day?.totals?.PATTI_OPEN?.totalAmount || 0) +
                                    (day?.totals?.JODI_OPEN?.totalAmount || 0)
                                  }
                                </td>
                                <td>
                                  {(
                                    (day?.totals?.SINGLE_CLOSE?.totalAmount || 0) +
                                    (day?.totals?.PATTI_CLOSE?.totalAmount || 0)
                                  )}
                                </td>
                                <td>
                                  {(
                                    (day?.totals?.SINGLE_OPEN?.totalAmount || 0) +
                                    (day?.totals?.PATTI_OPEN?.totalAmount || 0) +
                                    (day?.totals?.JODI_OPEN?.totalAmount || 0) +
                                    (day?.totals?.SINGLE_CLOSE?.totalAmount || 0) +
                                    (day?.totals?.PATTI_CLOSE?.totalAmount || 0)
                                  )}
                                </td>

                                <td>{day?.totals?.SINGLE_OPEN?.passTotalAmount || 0}</td>
                                <td>{day?.totals?.SINGLE_OPEN?.totalResultAmount || 0}</td>
                                <td>{day?.totals?.SINGLE_CLOSE?.passTotalAmount || 0}</td>
                                <td>{day?.totals?.SINGLE_CLOSE?.totalResultAmount || 0}</td>
                                <td>
                                  {(
                                    (day?.totals?.SINGLE_OPEN?.totalResultAmount || 0) +
                                    (day?.totals?.SINGLE_CLOSE?.totalResultAmount || 0)
                                  )}
                                </td>

                                <td>{day?.totals?.JODI_OPEN?.passTotalAmount || 0}</td>
                                <td>{day?.totals?.JODI_OPEN?.totalResultAmount || 0}</td>
                                <td>{day?.totals?.JODI_OPEN?.totalResultAmount || 0}</td>

                                <td>{day?.totals?.PATTI_OPEN?.passTotalAmount || 0}</td>
                                <td>{day?.totals?.PATTI_OPEN?.totalResultAmount || 0}</td>
                                <td>{day?.totals?.PATTI_CLOSE?.passTotalAmount || 0}</td>
                                <td>{day?.totals?.PATTI_CLOSE?.totalResultAmount || 0}</td>
                                <td>
                                  {
                                    (day?.totals?.PATTI_OPEN?.totalResultAmount || 0) +
                                    (day?.totals?.PATTI_CLOSE?.totalResultAmount || 0)
                                  }
                                </td>

                                <td className='bg-red'>
                                  {
                                    (day?.totals?.SINGLE_OPEN?.totalResultAmount || 0) +
                                    (day?.totals?.SINGLE_CLOSE?.totalResultAmount || 0) +
                                    (day?.totals?.JODI_OPEN?.totalResultAmount || 0) +
                                    (day?.totals?.PATTI_OPEN?.totalResultAmount || 0) +
                                    (day?.totals?.PATTI_CLOSE?.totalResultAmount || 0)
                                  }
                                </td>
                                <td className='bg-blue'>
                                  {
                                    (day?.totals?.SINGLE_OPEN?.totalClientCommAmount || 0) +
                                    (day?.totals?.SINGLE_CLOSE?.totalClientCommAmount || 0) +
                                    (day?.totals?.JODI_OPEN?.totalClientCommAmount || 0) +
                                    (day?.totals?.PATTI_OPEN?.totalClientCommAmount || 0) +
                                    (day?.totals?.PATTI_CLOSE?.totalClientCommAmount || 0)
                                  }
                                </td>
                                <td className='bg-blue'>
                                  {
                                    (day?.totals?.SINGLE_OPEN?.totalAmount || 0) +
                                    (day?.totals?.PATTI_OPEN?.totalAmount || 0) +
                                    (day?.totals?.JODI_OPEN?.totalAmount || 0) +
                                    (day?.totals?.SINGLE_CLOSE?.totalAmount || 0) +
                                    (day?.totals?.PATTI_CLOSE?.totalAmount || 0)

                                    - ((day?.totals?.SINGLE_OPEN?.totalResultAmount || 0) +
                                      (day?.totals?.SINGLE_CLOSE?.totalResultAmount || 0) +
                                      (day?.totals?.JODI_OPEN?.totalResultAmount || 0) +
                                      (day?.totals?.PATTI_OPEN?.totalResultAmount || 0) +
                                      (day?.totals?.PATTI_CLOSE?.totalResultAmount || 0) +
                                      (day?.totals?.SINGLE_OPEN?.totalClientCommAmount || 0) +
                                      (day?.totals?.SINGLE_CLOSE?.totalClientCommAmount || 0) +
                                      (day?.totals?.JODI_OPEN?.totalClientCommAmount || 0) +
                                      (day?.totals?.PATTI_OPEN?.totalClientCommAmount || 0) +
                                      (day?.totals?.PATTI_CLOSE?.totalClientCommAmount || 0))
                                  }
                                </td>
                              </tr>
                            ))}

                            <tr className='text-bg-light'>
                              <td>Total</td>
                              <td>
                                {
                                  drow?.days?.reduce(
                                    (acc, day) =>
                                      acc + (
                                        (day?.totals?.SINGLE_OPEN?.totalAmount || 0) +
                                        (day?.totals?.PATTI_OPEN?.totalAmount || 0) +
                                        (day?.totals?.JODI_OPEN?.totalAmount || 0)
                                      ),
                                    0)
                                }
                              </td>
                              <td>
                                {
                                  drow?.days?.reduce(
                                    (acc, day) =>
                                      acc + (
                                        (day?.totals?.SINGLE_CLOSE?.totalAmount || 0) +
                                        (day?.totals?.PATTI_CLOSE?.totalAmount || 0)
                                      ),
                                    0)
                                }
                              </td>
                              <td>
                                {
                                  drow?.days?.reduce(
                                    (acc, day) =>
                                      acc + (
                                        (day?.totals?.SINGLE_OPEN?.totalAmount || 0) +
                                        (day?.totals?.PATTI_OPEN?.totalAmount || 0) +
                                        (day?.totals?.JODI_OPEN?.totalAmount || 0) +
                                        (day?.totals?.SINGLE_CLOSE?.totalAmount || 0) +
                                        (day?.totals?.PATTI_CLOSE?.totalAmount || 0)
                                      ),
                                    0)
                                }
                              </td>


                              <td>
                                {
                                  drow?.days?.reduce(
                                    (acc, day) =>
                                      acc + (
                                        (day?.totals?.SINGLE_OPEN?.passTotalAmount || 0)
                                      ),
                                    0)
                                }
                              </td>
                              <td>
                                {
                                  drow?.days?.reduce(
                                    (acc, day) =>
                                      acc + (
                                        (day?.totals?.SINGLE_OPEN?.totalResultAmount || 0)
                                      ),
                                    0)
                                }
                              </td>
                              <td>
                                {
                                  drow?.days?.reduce(
                                    (acc, day) =>
                                      acc + (
                                        (day?.totals?.SINGLE_CLOSE?.passTotalAmount || 0)
                                      ),
                                    0)
                                }
                              </td>
                              <td>
                                {
                                  drow?.days?.reduce(
                                    (acc, day) =>
                                      acc + (
                                        (day?.totals?.SINGLE_CLOSE?.totalResultAmount || 0)
                                      ),
                                    0)
                                }
                              </td>
                              <td>
                                {
                                  drow?.days?.reduce(
                                    (acc, day) =>
                                      acc + (
                                        (day?.totals?.SINGLE_OPEN?.totalResultAmount || 0) +
                                        (day?.totals?.SINGLE_CLOSE?.totalResultAmount || 0)
                                      ),
                                    0)
                                }
                              </td>


                              <td>
                                {
                                  drow?.days?.reduce(
                                    (acc, day) =>
                                      acc + (
                                        (day?.totals?.JODI_OPEN?.passTotalAmount || 0)
                                      ),
                                    0)
                                }
                              </td>
                              <td>
                                {
                                  drow?.days?.reduce(
                                    (acc, day) =>
                                      acc + (
                                        (day?.totals?.JODI_OPEN?.totalResultAmount || 0)
                                      ),
                                    0)
                                }
                              </td>
                              <td>
                                {
                                  drow?.days?.reduce(
                                    (acc, day) =>
                                      acc + (
                                        (day?.totals?.JODI_OPEN?.totalResultAmount || 0)
                                      ),
                                    0)
                                }
                              </td>


                              <td>
                                {
                                  drow?.days?.reduce(
                                    (acc, day) =>
                                      acc + (
                                        (day?.totals?.PATTI_OPEN?.passTotalAmount || 0)
                                      ),
                                    0)
                                }
                              </td>
                              <td>
                                {
                                  drow?.days?.reduce(
                                    (acc, day) =>
                                      acc + (
                                        (day?.totals?.PATTI_OPEN?.totalResultAmount || 0)
                                      ),
                                    0)
                                }
                              </td>
                              <td>
                                {
                                  drow?.days?.reduce(
                                    (acc, day) =>
                                      acc + (
                                        (day?.totals?.PATTI_CLOSE?.passTotalAmount || 0)
                                      ),
                                    0)
                                }
                              </td>
                              <td>
                                {
                                  drow?.days?.reduce(
                                    (acc, day) =>
                                      acc + (
                                        (day?.totals?.PATTI_CLOSE?.totalResultAmount || 0)
                                      ),
                                    0)
                                }
                              </td>
                              <td>
                                {
                                  drow?.days?.reduce(
                                    (acc, day) =>
                                      acc + (
                                        (day?.totals?.PATTI_OPEN?.totalResultAmount || 0) +
                                        (day?.totals?.PATTI_CLOSE?.totalResultAmount || 0)
                                      ),
                                    0)
                                }
                              </td>


                              <td className='bg-red'>
                                {
                                  drow?.days?.reduce(
                                    (acc, day) =>
                                      acc + (
                                        (day?.totals?.SINGLE_OPEN?.totalResultAmount || 0) +
                                        (day?.totals?.SINGLE_CLOSE?.totalResultAmount || 0) +
                                        (day?.totals?.JODI_OPEN?.totalResultAmount || 0) +
                                        (day?.totals?.PATTI_OPEN?.totalResultAmount || 0) +
                                        (day?.totals?.PATTI_CLOSE?.totalResultAmount || 0)
                                      ),
                                    0)
                                }
                              </td>
                              <td className='bg-blue'>
                                {
                                  drow?.days?.reduce(
                                    (acc, day) =>
                                      acc + (
                                        (day?.totals?.SINGLE_OPEN?.totalClientCommAmount || 0) +
                                        (day?.totals?.SINGLE_CLOSE?.totalClientCommAmount || 0) +
                                        (day?.totals?.JODI_OPEN?.totalClientCommAmount || 0) +
                                        (day?.totals?.PATTI_OPEN?.totalClientCommAmount || 0) +
                                        (day?.totals?.PATTI_CLOSE?.totalClientCommAmount || 0)
                                      ),
                                    0)
                                }
                              </td>
                              <td className='bg-blue'>
                                {
                                  drow?.days?.reduce(
                                    (acc, day) =>
                                      acc + (
                                        (day?.totals?.SINGLE_OPEN?.totalAmount || 0) +
                                        (day?.totals?.PATTI_OPEN?.totalAmount || 0) +
                                        (day?.totals?.JODI_OPEN?.totalAmount || 0) +
                                        (day?.totals?.SINGLE_CLOSE?.totalAmount || 0) +
                                        (day?.totals?.PATTI_CLOSE?.totalAmount || 0)

                                        - ((day?.totals?.SINGLE_OPEN?.totalResultAmount || 0) +
                                          (day?.totals?.SINGLE_CLOSE?.totalResultAmount || 0) +
                                          (day?.totals?.JODI_OPEN?.totalResultAmount || 0) +
                                          (day?.totals?.PATTI_OPEN?.totalResultAmount || 0) +
                                          (day?.totals?.PATTI_CLOSE?.totalResultAmount || 0) +
                                          (day?.totals?.SINGLE_OPEN?.totalClientCommAmount || 0) +
                                          (day?.totals?.SINGLE_CLOSE?.totalClientCommAmount || 0) +
                                          (day?.totals?.JODI_OPEN?.totalClientCommAmount || 0) +
                                          (day?.totals?.PATTI_OPEN?.totalClientCommAmount || 0) +
                                          (day?.totals?.PATTI_CLOSE?.totalClientCommAmount || 0))
                                      ),
                                    0)
                                }
                              </td>
                            </tr>
                          </React.Fragment>
                        ))
                      }
                      <tr>
                        <td scope='col' colSpan="20">&nbsp;</td>
                      </tr>
                      <tr>
                        <td>Total</td>
                        <td>
                          {
                            client?.groupedData?.reduce((acc, drow) => acc + (

                              drow?.days?.reduce(
                                (acc, day) =>
                                  acc + (
                                    (day?.totals?.SINGLE_OPEN?.totalAmount || 0) +
                                    (day?.totals?.PATTI_OPEN?.totalAmount || 0) +
                                    (day?.totals?.JODI_OPEN?.totalAmount || 0)
                                  ),
                                0)


                            ), 0)
                          }
                        </td>
                        <td>
                          {
                            client?.groupedData?.reduce((acc, drow) => acc + (

                              drow?.days?.reduce(
                                (acc, day) =>
                                  acc + (
                                    (day?.totals?.SINGLE_CLOSE?.totalAmount || 0) +
                                    (day?.totals?.PATTI_CLOSE?.totalAmount || 0)
                                  ),
                                0)


                            ), 0)
                          }
                        </td>
                        <td>
                          {
                            client?.groupedData?.reduce((acc, drow) => acc + (

                              drow?.days?.reduce(
                                (acc, day) =>
                                  acc + (
                                    (day?.totals?.SINGLE_OPEN?.totalAmount || 0) +
                                    (day?.totals?.PATTI_OPEN?.totalAmount || 0) +
                                    (day?.totals?.JODI_OPEN?.totalAmount || 0) +
                                    (day?.totals?.SINGLE_CLOSE?.totalAmount || 0) +
                                    (day?.totals?.PATTI_CLOSE?.totalAmount || 0)
                                  ),
                                0)


                            ), 0)
                          }
                        </td>

                        <td>
                          {
                            client?.groupedData?.reduce((acc, drow) => acc + (

                              drow?.days?.reduce(
                                (acc, day) =>
                                  acc + (
                                    (day?.totals?.SINGLE_OPEN?.passTotalAmount || 0)
                                  ),
                                0)


                            ), 0)
                          }
                        </td>
                        <td>
                          {
                            client?.groupedData?.reduce((acc, drow) => acc + (

                              drow?.days?.reduce(
                                (acc, day) =>
                                  acc + (
                                    (day?.totals?.SINGLE_OPEN?.totalResultAmount || 0)
                                  ),
                                0)


                            ), 0)
                          }
                        </td>
                        <td>
                          {
                            client?.groupedData?.reduce((acc, drow) => acc + (

                              drow?.days?.reduce(
                                (acc, day) =>
                                  acc + (
                                    (day?.totals?.SINGLE_CLOSE?.passTotalAmount || 0)
                                  ),
                                0)


                            ), 0)
                          }
                        </td>
                        <td>
                          {
                            client?.groupedData?.reduce((acc, drow) => acc + (

                              drow?.days?.reduce(
                                (acc, day) =>
                                  acc + (
                                    (day?.totals?.SINGLE_CLOSE?.totalResultAmount || 0)
                                  ),
                                0)


                            ), 0)
                          }
                        </td>
                        <td>
                          {
                            client?.groupedData?.reduce((acc, drow) => acc + (

                              drow?.days?.reduce(
                                (acc, day) =>
                                  acc + (
                                    (day?.totals?.SINGLE_OPEN?.totalResultAmount || 0) +
                                    (day?.totals?.SINGLE_CLOSE?.totalResultAmount || 0)
                                  ),
                                0)


                            ), 0)
                          }
                        </td>


                        <td>
                          {
                            client?.groupedData?.reduce((acc, drow) => acc + (

                              drow?.days?.reduce(
                                (acc, day) =>
                                  acc + (
                                    (day?.totals?.JODI_OPEN?.passTotalAmount || 0)
                                  ),
                                0)


                            ), 0)
                          }
                        </td>
                        <td>
                          {
                            client?.groupedData?.reduce((acc, drow) => acc + (

                              drow?.days?.reduce(
                                (acc, day) =>
                                  acc + (
                                    (day?.totals?.JODI_OPEN?.totalResultAmount || 0)
                                  ),
                                0)


                            ), 0)
                          }
                        </td>
                        <td>
                          {
                            client?.groupedData?.reduce((acc, drow) => acc + (

                              drow?.days?.reduce(
                                (acc, day) =>
                                  acc + (
                                    (day?.totals?.JODI_OPEN?.totalResultAmount || 0)
                                  ),
                                0)


                            ), 0)
                          }
                        </td>

                        <td>
                          {
                            client?.groupedData?.reduce((acc, drow) => acc + (

                              drow?.days?.reduce(
                                (acc, day) =>
                                  acc + (
                                    (day?.totals?.PATTI_OPEN?.passTotalAmount || 0)
                                  ),
                                0)


                            ), 0)
                          }
                        </td>
                        <td>
                          {
                            client?.groupedData?.reduce((acc, drow) => acc + (

                              drow?.days?.reduce(
                                (acc, day) =>
                                  acc + (
                                    (day?.totals?.PATTI_OPEN?.totalResultAmount || 0)
                                  ),
                                0)


                            ), 0)
                          }
                        </td>
                        <td>
                          {
                            client?.groupedData?.reduce((acc, drow) => acc + (

                              drow?.days?.reduce(
                                (acc, day) =>
                                  acc + (
                                    (day?.totals?.PATTI_CLOSE?.passTotalAmount || 0)
                                  ),
                                0)


                            ), 0)
                          }
                        </td>
                        <td>
                          {
                            client?.groupedData?.reduce((acc, drow) => acc + (

                              drow?.days?.reduce(
                                (acc, day) =>
                                  acc + (
                                    (day?.totals?.PATTI_CLOSE?.totalResultAmount || 0)
                                  ),
                                0)


                            ), 0)
                          }
                        </td>
                        <td>
                          {
                            client?.groupedData?.reduce((acc, drow) => acc + (

                              drow?.days?.reduce(
                                (acc, day) =>
                                  acc + (
                                    (day?.totals?.PATTI_OPEN?.totalResultAmount || 0) +
                                    (day?.totals?.PATTI_CLOSE?.totalResultAmount || 0)
                                  ),
                                0)


                            ), 0)
                          }
                        </td>


                        <td className='bg-red'>
                          {
                            client?.groupedData?.reduce((acc, drow) => acc + (

                              drow?.days?.reduce(
                                (acc, day) =>
                                  acc + (
                                    (day?.totals?.SINGLE_OPEN?.totalResultAmount || 0) +
                                    (day?.totals?.SINGLE_CLOSE?.totalResultAmount || 0) +
                                    (day?.totals?.JODI_OPEN?.totalResultAmount || 0) +
                                    (day?.totals?.PATTI_OPEN?.totalResultAmount || 0) +
                                    (day?.totals?.PATTI_CLOSE?.totalResultAmount || 0)
                                  ),
                                0)


                            ), 0)
                          }
                        </td>
                        <td className='bg-blue'>
                          {
                            client?.groupedData?.reduce((acc, drow) => acc + (

                              drow?.days?.reduce(
                                (acc, day) =>
                                  acc + (
                                    (day?.totals?.SINGLE_OPEN?.totalClientCommAmount || 0) +
                                    (day?.totals?.SINGLE_CLOSE?.totalClientCommAmount || 0) +
                                    (day?.totals?.JODI_OPEN?.totalClientCommAmount || 0) +
                                    (day?.totals?.PATTI_OPEN?.totalClientCommAmount || 0) +
                                    (day?.totals?.PATTI_CLOSE?.totalClientCommAmount || 0)
                                  ),
                                0)


                            ), 0)
                          }
                        </td>
                        <td className='bg-blue'>
                          {
                            client?.groupedData?.reduce((acc, drow) => acc + (

                              drow?.days?.reduce(
                                (acc, day) =>
                                  acc + (
                                    (day?.totals?.SINGLE_OPEN?.totalAmount || 0) +
                                    (day?.totals?.PATTI_OPEN?.totalAmount || 0) +
                                    (day?.totals?.JODI_OPEN?.totalAmount || 0) +
                                    (day?.totals?.SINGLE_CLOSE?.totalAmount || 0) +
                                    (day?.totals?.PATTI_CLOSE?.totalAmount || 0)

                                    - ((day?.totals?.SINGLE_OPEN?.totalResultAmount || 0) +
                                      (day?.totals?.SINGLE_CLOSE?.totalResultAmount || 0) +
                                      (day?.totals?.JODI_OPEN?.totalResultAmount || 0) +
                                      (day?.totals?.PATTI_OPEN?.totalResultAmount || 0) +
                                      (day?.totals?.PATTI_CLOSE?.totalResultAmount || 0) +
                                      (day?.totals?.SINGLE_OPEN?.totalClientCommAmount || 0) +
                                      (day?.totals?.SINGLE_CLOSE?.totalClientCommAmount || 0) +
                                      (day?.totals?.JODI_OPEN?.totalClientCommAmount || 0) +
                                      (day?.totals?.PATTI_OPEN?.totalClientCommAmount || 0) +
                                      (day?.totals?.PATTI_CLOSE?.totalClientCommAmount || 0))
                                  ),
                                0)

                            ), 0)
                          }
                        </td>
                      </tr>
                    </React.Fragment>))
                }
                <tr>
                  <td scope='col' colSpan="20">&nbsp;</td>
                </tr>
                <tr>
                  <td>Total</td>
                  <td>
                    {
                      reports?.reduce((acc, client) => acc + (
                        client?.groupedData?.reduce((acc, drow) => acc + (
                          drow?.days?.reduce(
                            (acc, day) =>
                              acc + (
                                (day?.totals?.SINGLE_OPEN?.totalAmount || 0) +
                                (day?.totals?.PATTI_OPEN?.totalAmount || 0) +
                                (day?.totals?.JODI_OPEN?.totalAmount || 0)
                              ),
                            0)
                        ), 0)
                      ), 0)
                    }
                  </td>
                  <td>
                    {

                      reports?.reduce((acc, client) => acc + (

                        client?.groupedData?.reduce((acc, drow) => acc + (

                          drow?.days?.reduce(
                            (acc, day) =>
                              acc + (
                                (day?.totals?.SINGLE_CLOSE?.totalAmount || 0) +
                                (day?.totals?.PATTI_CLOSE?.totalAmount || 0)
                              ),
                            0)


                        ), 0)
                      ), 0)

                    }
                  </td>
                  <td>
                    {
                      reports?.reduce((acc, client) => acc + (

                        client?.groupedData?.reduce((acc, drow) => acc + (

                          drow?.days?.reduce(
                            (acc, day) =>
                              acc + (
                                (day?.totals?.SINGLE_OPEN?.totalAmount || 0) +
                                (day?.totals?.PATTI_OPEN?.totalAmount || 0) +
                                (day?.totals?.JODI_OPEN?.totalAmount || 0) +
                                (day?.totals?.SINGLE_CLOSE?.totalAmount || 0) +
                                (day?.totals?.PATTI_CLOSE?.totalAmount || 0)
                              ),
                            0)


                        ), 0)
                      ), 0)
                    }
                  </td>

                  <td>
                    {
                      reports?.reduce((acc, client) => acc + (

                        client?.groupedData?.reduce((acc, drow) => acc + (

                          drow?.days?.reduce(
                            (acc, day) =>
                              acc + (
                                (day?.totals?.SINGLE_OPEN?.passTotalAmount || 0)
                              ),
                            0)


                        ), 0)
                      ), 0)
                    }
                  </td>
                  <td>
                    {
                      reports?.reduce((acc, client) => acc + (

                        client?.groupedData?.reduce((acc, drow) => acc + (

                          drow?.days?.reduce(
                            (acc, day) =>
                              acc + (
                                (day?.totals?.SINGLE_OPEN?.totalResultAmount || 0)
                              ),
                            0)


                        ), 0)
                      ), 0)
                    }
                  </td>
                  <td>
                    {
                      reports?.reduce((acc, client) => acc + (

                        client?.groupedData?.reduce((acc, drow) => acc + (

                          drow?.days?.reduce(
                            (acc, day) =>
                              acc + (
                                (day?.totals?.SINGLE_CLOSE?.passTotalAmount || 0)
                              ),
                            0)


                        ), 0)
                      ), 0)
                    }
                  </td>
                  <td>
                    {
                      reports?.reduce((acc, client) => acc + (

                        client?.groupedData?.reduce((acc, drow) => acc + (

                          drow?.days?.reduce(
                            (acc, day) =>
                              acc + (
                                (day?.totals?.SINGLE_CLOSE?.totalResultAmount || 0)
                              ),
                            0)


                        ), 0)
                      ), 0)
                    }
                  </td>
                  <td>
                    {
                      reports?.reduce((acc, client) => acc + (

                        client?.groupedData?.reduce((acc, drow) => acc + (

                          drow?.days?.reduce(
                            (acc, day) =>
                              acc + (
                                (day?.totals?.SINGLE_OPEN?.totalResultAmount || 0) +
                                (day?.totals?.SINGLE_CLOSE?.totalResultAmount || 0)
                              ),
                            0)


                        ), 0)
                      ), 0)
                    }
                  </td>


                  <td>
                    {
                      reports?.reduce((acc, client) => acc + (

                        client?.groupedData?.reduce((acc, drow) => acc + (

                          drow?.days?.reduce(
                            (acc, day) =>
                              acc + (
                                (day?.totals?.JODI_OPEN?.passTotalAmount || 0)
                              ),
                            0)


                        ), 0)
                      ), 0)
                    }
                  </td>
                  <td>
                    {
                      reports?.reduce((acc, client) => acc + (

                        client?.groupedData?.reduce((acc, drow) => acc + (

                          drow?.days?.reduce(
                            (acc, day) =>
                              acc + (
                                (day?.totals?.JODI_OPEN?.totalResultAmount || 0)
                              ),
                            0)


                        ), 0)
                      ), 0)
                    }
                  </td>
                  <td>
                    {
                      reports?.reduce((acc, client) => acc + (

                        client?.groupedData?.reduce((acc, drow) => acc + (

                          drow?.days?.reduce(
                            (acc, day) =>
                              acc + (
                                (day?.totals?.JODI_OPEN?.totalResultAmount || 0)
                              ),
                            0)


                        ), 0)
                      ), 0)
                    }
                  </td>

                  <td>
                    {
                      reports?.reduce((acc, client) => acc + (

                        client?.groupedData?.reduce((acc, drow) => acc + (

                          drow?.days?.reduce(
                            (acc, day) =>
                              acc + (
                                (day?.totals?.PATTI_OPEN?.passTotalAmount || 0)
                              ),
                            0)


                        ), 0)
                      ), 0)
                    }
                  </td>
                  <td>
                    {
                      reports?.reduce((acc, client) => acc + (

                        client?.groupedData?.reduce((acc, drow) => acc + (

                          drow?.days?.reduce(
                            (acc, day) =>
                              acc + (
                                (day?.totals?.PATTI_OPEN?.totalResultAmount || 0)
                              ),
                            0)


                        ), 0)
                      ), 0)
                    }
                  </td>
                  <td>
                    {
                      reports?.reduce((acc, client) => acc + (

                        client?.groupedData?.reduce((acc, drow) => acc + (

                          drow?.days?.reduce(
                            (acc, day) =>
                              acc + (
                                (day?.totals?.PATTI_CLOSE?.passTotalAmount || 0)
                              ),
                            0)


                        ), 0)
                      ), 0)
                    }
                  </td>
                  <td>
                    {
                      reports?.reduce((acc, client) => acc + (

                        client?.groupedData?.reduce((acc, drow) => acc + (

                          drow?.days?.reduce(
                            (acc, day) =>
                              acc + (
                                (day?.totals?.PATTI_CLOSE?.totalResultAmount || 0)
                              ),
                            0)


                        ), 0)
                      ), 0)
                    }
                  </td>
                  <td>
                    {
                      reports?.reduce((acc, client) => acc + (

                        client?.groupedData?.reduce((acc, drow) => acc + (

                          drow?.days?.reduce(
                            (acc, day) =>
                              acc + (
                                (day?.totals?.PATTI_OPEN?.totalResultAmount || 0) +
                                (day?.totals?.PATTI_CLOSE?.totalResultAmount || 0)
                              ),
                            0)


                        ), 0)
                      ), 0)
                    }
                  </td>


                  <td className='bg-red'>
                    {

                      reports?.reduce((acc, client) => acc + (

                        client?.groupedData?.reduce((acc, drow) => acc + (

                          drow?.days?.reduce(
                            (acc, day) =>
                              acc + (
                                (day?.totals?.SINGLE_OPEN?.totalResultAmount || 0) +
                                (day?.totals?.SINGLE_CLOSE?.totalResultAmount || 0) +
                                (day?.totals?.JODI_OPEN?.totalResultAmount || 0) +
                                (day?.totals?.PATTI_OPEN?.totalResultAmount || 0) +
                                (day?.totals?.PATTI_CLOSE?.totalResultAmount || 0)
                              ),
                            0)


                        ), 0)
                      ), 0)
                    }
                  </td>
                  <td className='bg-blue'>
                    {
                      reports?.reduce((acc, client) => acc + (

                        client?.groupedData?.reduce((acc, drow) => acc + (

                          drow?.days?.reduce(
                            (acc, day) =>
                              acc + (
                                (day?.totals?.SINGLE_OPEN?.totalClientCommAmount || 0) +
                                (day?.totals?.SINGLE_CLOSE?.totalClientCommAmount || 0) +
                                (day?.totals?.JODI_OPEN?.totalClientCommAmount || 0) +
                                (day?.totals?.PATTI_OPEN?.totalClientCommAmount || 0) +
                                (day?.totals?.PATTI_CLOSE?.totalClientCommAmount || 0)
                              ),
                            0)


                        ), 0)
                      ), 0)
                    }
                  </td>
                  <td className='bg-blue'>
                    {

                      reports?.reduce((acc, client) => acc + (

                        client?.groupedData?.reduce((acc, drow) => acc + (

                          drow?.days?.reduce(
                            (acc, day) =>
                              acc + (
                                (day?.totals?.SINGLE_OPEN?.totalAmount || 0) +
                                (day?.totals?.PATTI_OPEN?.totalAmount || 0) +
                                (day?.totals?.JODI_OPEN?.totalAmount || 0) +
                                (day?.totals?.SINGLE_CLOSE?.totalAmount || 0) +
                                (day?.totals?.PATTI_CLOSE?.totalAmount || 0)

                                - ((day?.totals?.SINGLE_OPEN?.totalResultAmount || 0) +
                                  (day?.totals?.SINGLE_CLOSE?.totalResultAmount || 0) +
                                  (day?.totals?.JODI_OPEN?.totalResultAmount || 0) +
                                  (day?.totals?.PATTI_OPEN?.totalResultAmount || 0) +
                                  (day?.totals?.PATTI_CLOSE?.totalResultAmount || 0) +
                                  (day?.totals?.SINGLE_OPEN?.totalClientCommAmount || 0) +
                                  (day?.totals?.SINGLE_CLOSE?.totalClientCommAmount || 0) +
                                  (day?.totals?.JODI_OPEN?.totalClientCommAmount || 0) +
                                  (day?.totals?.PATTI_OPEN?.totalClientCommAmount || 0) +
                                  (day?.totals?.PATTI_CLOSE?.totalClientCommAmount || 0))
                              ),
                            0)

                        ), 0)
                      ), 0)
                    }
                  </td>
                </tr>
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </div>
  )
}

export default AgentReport