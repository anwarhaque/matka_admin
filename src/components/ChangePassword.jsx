import { useState } from 'react'
import Axios from '../api/Axios';
import Notifier from './Notifier';

function ChangePassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleChangePassword = async (event) => {
        event.preventDefault();
       

        if (password !== confirmPassword) {
            Notifier('Passwords do not match', 'Error')
            return
        }

        try {
            
            const res = await Axios.put('changePassword', {password}); // Use the Axios instance
            console.log(res);

            Notifier(res.meta.msg, 'Success')
        } catch (error) {
            Notifier(error?.meta?.msg, 'Error')
        }

    }



    return (
        <div className="container-fluid p-0">
            <div className="row">
                <div className="col-12 col-lg-6">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="h3 card-title mb-0">Change Password</h5>
                        </div>
                        <div className="card-body">

                            <form onSubmit={handleChangePassword}>

                                <div className="form-group mb-2">
                                    <label htmlFor="password">Password</label>
                                    <input type="text" id="password" className="form-control" placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-2">
                                    <label htmlFor="cnf_password">Conform Password</label>
                                    <input type="text" id="cnf_password" className="form-control" placeholder="Conform Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required />
                                </div>
                                <div className="row mt-4"></div>
                                <button type="submit" className="btn btn-primary">Update</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword