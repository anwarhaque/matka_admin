import React, { useState, useEffect } from 'react'
import Notifier from '../Notifier';
import Axios from '../../api/Axios';

const ClientReport = () => {
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
      clientId
    }

   

    try {

      const { data } = await Axios.get('/report/clientReport', { params: query });

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
            <h5 className="h3 card-title mb-0">Client Report</h5>
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
                    <select className="form-select" onChange={(event) => setClientId(event.target.value)} required>
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
                  reports.map((item, index) => (
                    <React.Fragment key={index}>
                      <tr className="text-center text-bg-success">
                        <th colSpan="4">{item.drow.name}</th>
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
                      {Object.entries(item.groupedData).map(([key, value]) => (

                        <tr key={key}>
                          <td>{key}</td>
                          <td>
                            {
                              (value?.SINGLE_OPEN?.totalAmount || 0) +
                              (value?.PATTI_OPEN?.totalAmount || 0) +
                              (value?.JODI_OPEN?.totalAmount || 0)
                            }
                          </td>
                          <td>
                            {(
                              (value?.SINGLE_CLOSE?.totalAmount || 0) +
                              (value?.PATTI_CLOSE?.totalAmount || 0)
                            )}
                          </td>
                          <td>
                            {(
                              (value?.SINGLE_OPEN?.totalAmount || 0) +
                              (value?.PATTI_OPEN?.totalAmount || 0) +
                              (value?.JODI_OPEN?.totalAmount || 0) +
                              (value?.SINGLE_CLOSE?.totalAmount || 0) +
                              (value?.PATTI_CLOSE?.totalAmount || 0)
                            )}
                          </td>

                          <td>{value?.SINGLE_OPEN?.passTotalAmount || 0}</td>
                          <td>{value?.SINGLE_OPEN?.totalResultAmount || 0}</td>
                          <td>{value?.SINGLE_CLOSE?.passTotalAmount || 0}</td>
                          <td>{value?.SINGLE_CLOSE?.totalResultAmount || 0}</td>
                          <td>
                            {(
                              (value?.SINGLE_OPEN?.totalResultAmount || 0) +
                              (value?.SINGLE_CLOSE?.totalResultAmount || 0)
                            )}
                          </td>

                          <td>{value?.JODI_OPEN?.passTotalAmount || 0}</td>
                          <td>{value?.JODI_OPEN?.totalResultAmount || 0}</td>
                          <td>{value?.JODI_OPEN?.totalResultAmount || 0}</td>

                          <td>{value?.PATTI_OPEN?.passTotalAmount || 0}</td>
                          <td>{value?.PATTI_OPEN?.totalResultAmount || 0}</td>
                          <td>{value?.PATTI_CLOSE?.passTotalAmount || 0}</td>
                          <td>{value?.PATTI_CLOSE?.totalResultAmount || 0}</td>
                          <td>
                            {
                              (value?.PATTI_OPEN?.totalResultAmount || 0) +
                              (value?.PATTI_CLOSE?.totalResultAmount || 0)
                            }
                          </td>

                          <td className='bg-red'>
                            {
                              (value?.SINGLE_OPEN?.totalResultAmount || 0) +
                              (value?.SINGLE_CLOSE?.totalResultAmount || 0) +
                              (value?.JODI_OPEN?.totalResultAmount || 0) +
                              (value?.PATTI_OPEN?.totalResultAmount || 0) +
                              (value?.PATTI_CLOSE?.totalResultAmount || 0)
                            }
                          </td>
                          <td className='bg-red'>
                            {
                              (value?.SINGLE_OPEN?.totalClientCommAmount || 0) +
                              (value?.SINGLE_CLOSE?.totalClientCommAmount || 0) +
                              (value?.JODI_OPEN?.totalClientCommAmount || 0) +
                              (value?.PATTI_OPEN?.totalClientCommAmount || 0) +
                              (value?.PATTI_CLOSE?.totalClientCommAmount || 0)
                            }
                          </td>
                          <td className='bg-blue'>
                            {
                              (value?.SINGLE_OPEN?.totalResultAmount || 0) +
                              (value?.SINGLE_CLOSE?.totalResultAmount || 0) +
                              (value?.JODI_OPEN?.totalResultAmount || 0) +
                              (value?.PATTI_OPEN?.totalResultAmount || 0) +
                              (value?.PATTI_CLOSE?.totalResultAmount || 0) +
                              (value?.SINGLE_OPEN?.totalClientCommAmount || 0) +
                              (value?.SINGLE_CLOSE?.totalClientCommAmount || 0) +
                              (value?.JODI_OPEN?.totalClientCommAmount || 0) +
                              (value?.PATTI_OPEN?.totalClientCommAmount || 0) +
                              (value?.PATTI_CLOSE?.totalClientCommAmount || 0)
                            }
                          </td>
                        </tr>
                      ))}

                      <tr className='text-bg-light'>
                        <td>Total</td>
                        <td>
                          {
                            Object.entries(item.groupedData).reduce(
                              (acc, [key, value]) =>
                                acc + (
                                  (value?.SINGLE_OPEN?.totalAmount || 0) +
                                  (value?.PATTI_OPEN?.totalAmount || 0) +
                                  (value?.JODI_OPEN?.totalAmount || 0)
                                ),
                              0)
                          }
                        </td>
                        <td>
                          {
                            Object.entries(item.groupedData).reduce(
                              (acc, [key, value]) =>
                                acc + (
                                  (value?.SINGLE_CLOSE?.totalAmount || 0) +
                                  (value?.PATTI_CLOSE?.totalAmount || 0)
                                ),
                              0)
                          }
                        </td>
                        <td>
                          {
                            Object.entries(item.groupedData).reduce(
                              (acc, [key, value]) =>
                                acc + (
                                  (value?.SINGLE_OPEN?.totalAmount || 0) +
                                  (value?.PATTI_OPEN?.totalAmount || 0) +
                                  (value?.JODI_OPEN?.totalAmount || 0) +
                                  (value?.SINGLE_CLOSE?.totalAmount || 0) +
                                  (value?.PATTI_CLOSE?.totalAmount || 0)
                                ),
                              0)
                          }
                        </td>


                        <td>
                          {
                            Object.entries(item.groupedData).reduce(
                              (acc, [key, value]) =>
                                acc + (
                                  (value?.SINGLE_OPEN?.passTotalAmount || 0)
                                ),
                              0)
                          }
                        </td>
                        <td>
                          {
                            Object.entries(item.groupedData).reduce(
                              (acc, [key, value]) =>
                                acc + (
                                  (value?.SINGLE_OPEN?.totalResultAmount || 0)
                                ),
                              0)
                          }
                        </td>
                        <td>
                          {
                            Object.entries(item.groupedData).reduce(
                              (acc, [key, value]) =>
                                acc + (
                                  (value?.SINGLE_CLOSE?.passTotalAmount || 0)
                                ),
                              0)
                          }
                        </td>
                        <td>
                          {
                            Object.entries(item.groupedData).reduce(
                              (acc, [key, value]) =>
                                acc + (
                                  (value?.SINGLE_CLOSE?.totalResultAmount || 0)
                                ),
                              0)
                          }
                        </td>
                        <td>
                          {
                            Object.entries(item.groupedData).reduce(
                              (acc, [key, value]) =>
                                acc + (
                                  (value?.SINGLE_OPEN?.totalResultAmount || 0) +
                                  (value?.SINGLE_CLOSE?.totalResultAmount || 0)
                                ),
                              0)
                          }
                        </td>


                        <td>
                          {
                            Object.entries(item.groupedData).reduce(
                              (acc, [key, value]) =>
                                acc + (
                                  (value?.JODI_OPEN?.passTotalAmount || 0)
                                ),
                              0)
                          }
                        </td>
                        <td>
                          {
                            Object.entries(item.groupedData).reduce(
                              (acc, [key, value]) =>
                                acc + (
                                  (value?.JODI_OPEN?.totalResultAmount || 0)
                                ),
                              0)
                          }
                        </td>
                        <td>
                          {
                            Object.entries(item.groupedData).reduce(
                              (acc, [key, value]) =>
                                acc + (
                                  (value?.JODI_OPEN?.totalResultAmount || 0)
                                ),
                              0)
                          }
                        </td>


                        <td>
                          {
                            Object.entries(item.groupedData).reduce(
                              (acc, [key, value]) =>
                                acc + (
                                  (value?.PATTI_OPEN?.passTotalAmount || 0)
                                ),
                              0)
                          }
                        </td>
                        <td>
                          {
                            Object.entries(item.groupedData).reduce(
                              (acc, [key, value]) =>
                                acc + (
                                  (value?.PATTI_OPEN?.totalResultAmount || 0)
                                ),
                              0)
                          }
                        </td>
                        <td>
                          {
                            Object.entries(item.groupedData).reduce(
                              (acc, [key, value]) =>
                                acc + (
                                  (value?.PATTI_CLOSE?.passTotalAmount || 0)
                                ),
                              0)
                          }
                        </td>
                        <td>
                          {
                            Object.entries(item.groupedData).reduce(
                              (acc, [key, value]) =>
                                acc + (
                                  (value?.PATTI_CLOSE?.totalResultAmount || 0)
                                ),
                              0)
                          }
                        </td>
                        <td>
                          {
                            Object.entries(item.groupedData).reduce(
                              (acc, [key, value]) =>
                                acc + (
                                  (value?.PATTI_OPEN?.totalResultAmount || 0) +
                                  (value?.PATTI_CLOSE?.totalResultAmount || 0)
                                ),
                              0)
                          }
                        </td>


                        <td className='bg-red'>
                          {
                            Object.entries(item.groupedData).reduce(
                              (acc, [key, value]) =>
                                acc + (
                                  (value?.SINGLE_OPEN?.totalResultAmount || 0) +
                                  (value?.SINGLE_CLOSE?.totalResultAmount || 0) +
                                  (value?.JODI_OPEN?.totalResultAmount || 0) +
                                  (value?.PATTI_OPEN?.totalResultAmount || 0) +
                                  (value?.PATTI_CLOSE?.totalResultAmount || 0)
                                ),
                              0)
                          }
                        </td>
                        <td className='bg-red'>
                          {
                            Object.entries(item.groupedData).reduce(
                              (acc, [key, value]) =>
                                acc + (
                                  (value?.SINGLE_OPEN?.totalClientCommAmount || 0) +
                                  (value?.SINGLE_CLOSE?.totalClientCommAmount || 0) +
                                  (value?.JODI_OPEN?.totalClientCommAmount || 0) +
                                  (value?.PATTI_OPEN?.totalClientCommAmount || 0) +
                                  (value?.PATTI_CLOSE?.totalClientCommAmount || 0)
                                ),
                              0)
                          }
                        </td>
                        <td className='bg-blue'>
                          {
                            Object.entries(item.groupedData).reduce(
                              (acc, [key, value]) =>
                                acc + (
                                  (value?.SINGLE_OPEN?.totalResultAmount || 0) +
                                  (value?.SINGLE_CLOSE?.totalResultAmount || 0) +
                                  (value?.JODI_OPEN?.totalResultAmount || 0) +
                                  (value?.PATTI_OPEN?.totalResultAmount || 0) +
                                  (value?.PATTI_CLOSE?.totalResultAmount || 0) +
                                  (value?.SINGLE_OPEN?.totalClientCommAmount || 0) +
                                  (value?.SINGLE_CLOSE?.totalClientCommAmount || 0) +
                                  (value?.JODI_OPEN?.totalClientCommAmount || 0) +
                                  (value?.PATTI_OPEN?.totalClientCommAmount || 0) +
                                  (value?.PATTI_CLOSE?.totalClientCommAmount || 0)
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
                      reports.reduce((acc, item) => acc + (

                        Object.entries(item.groupedData).reduce(
                          (acc, [key, value]) =>
                            acc + (
                              (value?.SINGLE_OPEN?.totalAmount || 0) +
                              (value?.PATTI_OPEN?.totalAmount || 0) +
                              (value?.JODI_OPEN?.totalAmount || 0)
                            ),
                          0)


                      ), 0)
                    }
                  </td>
                  <td>
                    {
                      reports.reduce((acc, item) => acc + (

                        Object.entries(item.groupedData).reduce(
                          (acc, [key, value]) =>
                            acc + (
                              (value?.SINGLE_CLOSE?.totalAmount || 0) +
                              (value?.PATTI_CLOSE?.totalAmount || 0)
                            ),
                          0)


                      ), 0)
                    }
                  </td>
                  <td>
                    {
                      reports.reduce((acc, item) => acc + (

                        Object.entries(item.groupedData).reduce(
                          (acc, [key, value]) =>
                            acc + (
                              (value?.SINGLE_OPEN?.totalAmount || 0) +
                              (value?.PATTI_OPEN?.totalAmount || 0) +
                              (value?.JODI_OPEN?.totalAmount || 0) +
                              (value?.SINGLE_CLOSE?.totalAmount || 0) +
                              (value?.PATTI_CLOSE?.totalAmount || 0)
                            ),
                          0)


                      ), 0)
                    }
                  </td>

                  <td>
                    {
                      reports.reduce((acc, item) => acc + (

                        Object.entries(item.groupedData).reduce(
                          (acc, [key, value]) =>
                            acc + (
                              (value?.SINGLE_OPEN?.passTotalAmount || 0)
                            ),
                          0)


                      ), 0)
                    }
                  </td>
                  <td>
                    {
                      reports.reduce((acc, item) => acc + (

                        Object.entries(item.groupedData).reduce(
                          (acc, [key, value]) =>
                            acc + (
                              (value?.SINGLE_OPEN?.totalResultAmount || 0)
                            ),
                          0)


                      ), 0)
                    }
                  </td>
                  <td>
                    {
                      reports.reduce((acc, item) => acc + (

                        Object.entries(item.groupedData).reduce(
                          (acc, [key, value]) =>
                            acc + (
                              (value?.SINGLE_CLOSE?.passTotalAmount || 0)
                            ),
                          0)


                      ), 0)
                    }
                  </td>
                  <td>
                    {
                      reports.reduce((acc, item) => acc + (

                        Object.entries(item.groupedData).reduce(
                          (acc, [key, value]) =>
                            acc + (
                              (value?.SINGLE_CLOSE?.totalResultAmount || 0)
                            ),
                          0)


                      ), 0)
                    }
                  </td>
                  <td>
                    {
                      reports.reduce((acc, item) => acc + (

                        Object.entries(item.groupedData).reduce(
                          (acc, [key, value]) =>
                            acc + (
                              (value?.SINGLE_OPEN?.totalResultAmount || 0) +
                              (value?.SINGLE_CLOSE?.totalResultAmount || 0)
                            ),
                          0)


                      ), 0)
                    }
                  </td>


                  <td>
                    {
                      reports.reduce((acc, item) => acc + (

                        Object.entries(item.groupedData).reduce(
                          (acc, [key, value]) =>
                            acc + (
                              (value?.JODI_OPEN?.passTotalAmount || 0)
                            ),
                          0)


                      ), 0)
                    }
                  </td>
                  <td>
                    {
                      reports.reduce((acc, item) => acc + (

                        Object.entries(item.groupedData).reduce(
                          (acc, [key, value]) =>
                            acc + (
                              (value?.JODI_OPEN?.totalResultAmount || 0)
                            ),
                          0)


                      ), 0)
                    }
                  </td>
                  <td>
                    {
                      reports.reduce((acc, item) => acc + (

                        Object.entries(item.groupedData).reduce(
                          (acc, [key, value]) =>
                            acc + (
                              (value?.JODI_OPEN?.totalResultAmount || 0)
                            ),
                          0)


                      ), 0)
                    }
                  </td>

                  <td>
                    {
                      reports.reduce((acc, item) => acc + (

                        Object.entries(item.groupedData).reduce(
                          (acc, [key, value]) =>
                            acc + (
                              (value?.PATTI_OPEN?.passTotalAmount || 0)
                            ),
                          0)


                      ), 0)
                    }
                  </td>
                  <td>
                    {
                      reports.reduce((acc, item) => acc + (

                        Object.entries(item.groupedData).reduce(
                          (acc, [key, value]) =>
                            acc + (
                              (value?.PATTI_OPEN?.totalResultAmount || 0)
                            ),
                          0)


                      ), 0)
                    }
                  </td>
                  <td>
                    {
                      reports.reduce((acc, item) => acc + (

                        Object.entries(item.groupedData).reduce(
                          (acc, [key, value]) =>
                            acc + (
                              (value?.PATTI_CLOSE?.passTotalAmount || 0)
                            ),
                          0)


                      ), 0)
                    }
                  </td>
                  <td>
                    {
                      reports.reduce((acc, item) => acc + (

                        Object.entries(item.groupedData).reduce(
                          (acc, [key, value]) =>
                            acc + (
                              (value?.PATTI_CLOSE?.totalResultAmount || 0)
                            ),
                          0)


                      ), 0)
                    }
                  </td>
                  <td>
                    {
                      reports.reduce((acc, item) => acc + (

                        Object.entries(item.groupedData).reduce(
                          (acc, [key, value]) =>
                            acc + (
                              (value?.PATTI_OPEN?.totalResultAmount || 0) +
                              (value?.PATTI_CLOSE?.totalResultAmount || 0)
                            ),
                          0)


                      ), 0)
                    }
                  </td>


                  <td className='bg-red'>
                    {
                      reports.reduce((acc, item) => acc + (

                        Object.entries(item.groupedData).reduce(
                          (acc, [key, value]) =>
                            acc + (
                              (value?.SINGLE_OPEN?.totalResultAmount || 0) +
                              (value?.SINGLE_CLOSE?.totalResultAmount || 0) +
                              (value?.JODI_OPEN?.totalResultAmount || 0) +
                              (value?.PATTI_OPEN?.totalResultAmount || 0) +
                              (value?.PATTI_CLOSE?.totalResultAmount || 0)
                            ),
                          0)


                      ), 0)
                    }
                  </td>
                  <td className='bg-red'>
                    {
                      reports.reduce((acc, item) => acc + (

                        Object.entries(item.groupedData).reduce(
                          (acc, [key, value]) =>
                            acc + (
                              (value?.SINGLE_OPEN?.totalClientCommAmount || 0) +
                              (value?.SINGLE_CLOSE?.totalClientCommAmount || 0) +
                              (value?.JODI_OPEN?.totalClientCommAmount || 0) +
                              (value?.PATTI_OPEN?.totalClientCommAmount || 0) +
                              (value?.PATTI_CLOSE?.totalClientCommAmount || 0)
                            ),
                          0)


                      ), 0)
                    }
                  </td>
                  <td className='bg-red'>
                    {
                      reports.reduce((acc, item) => acc + (

                        Object.entries(item.groupedData).reduce(
                          (acc, [key, value]) =>
                            acc + (
                              (value?.SINGLE_OPEN?.totalResultAmount || 0) +
                              (value?.SINGLE_CLOSE?.totalResultAmount || 0) +
                              (value?.JODI_OPEN?.totalResultAmount || 0) +
                              (value?.PATTI_OPEN?.totalResultAmount || 0) +
                              (value?.PATTI_CLOSE?.totalResultAmount || 0) +
                              (value?.SINGLE_OPEN?.totalClientCommAmount || 0) +
                              (value?.SINGLE_CLOSE?.totalClientCommAmount || 0) +
                              (value?.JODI_OPEN?.totalClientCommAmount || 0) +
                              (value?.PATTI_OPEN?.totalClientCommAmount || 0) +
                              (value?.PATTI_CLOSE?.totalClientCommAmount || 0)
                            ),
                          0)

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

export default ClientReport