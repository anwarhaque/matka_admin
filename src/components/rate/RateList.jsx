import React from 'react'

const RateList = () => {
    return (
        <div className="card flex-fill">
            <div className="card-header">
                <h5 className="card-title mb-0">Rate</h5>

            </div>
            <table className="table table-hover my-0">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Comm.</th>
                        <th>Rate</th>
                        <th>Rule</th>
                        <th>rate</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Single</td>
                        <td>0%</td>
                        <td>10/-</td>
                        <td>10*10</td>
                        <td>100/-</td>
                    </tr>
                    <tr>
                        <td>Jodi</td>
                        <td>0%</td>
                        <td>10/-</td>
                        <td>10*100</td>
                        <td>1000/-</td>
                    </tr>
                    <tr>
                        <td>Single Patti</td>
                        <td>0%</td>
                        <td>10/-</td>
                        <td>10*150</td>
                        <td>1500/-</td>
                    </tr>
                    <tr>
                        <td>Double Patti</td>
                        <td>0%</td>
                        <td>10/-</td>
                        <td>10*300</td>
                        <td>3000/-</td>
                    </tr>
                    <tr>
                        <td>Tripel Patti</td>
                        <td>0%</td>
                        <td>10/-</td>
                        <td>10*900</td>
                        <td>9000/-</td>
                    </tr>
                    <tr><td colspan="5"></td></tr>
                    <tr>
                        <td>Single</td>
                        <td>10%</td>
                        <td>10/-</td>
                        <td>10*9</td>
                        <td>90/-</td>
                    </tr>
                    <tr>
                        <td>Jodi</td>
                        <td>10%</td>
                        <td>10/-</td>
                        <td>10*90</td>
                        <td>900/-</td>
                    </tr>
                    <tr>
                        <td>Single Patti</td>
                        <td>10%</td>
                        <td>10/-</td>
                        <td>10*140</td>
                        <td>1400/-</td>
                    </tr>
                    <tr>
                        <td>Double Patti</td>
                        <td>10%</td>
                        <td>10/-</td>
                        <td>10*280</td>
                        <td>2800/-</td>
                    </tr>
                    <tr>
                        <td>Tripel Patti</td>
                        <td>10%</td>
                        <td>10/-</td>
                        <td>10*840</td>
                        <td>8400/-</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default RateList