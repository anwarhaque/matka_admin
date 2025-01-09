import { useState, useEffect } from 'react'
import Axios from '../api/Axios';
import Notifier from './Notifier';
import userPic from '../assets/img/user-pic.png';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  // Fetch profile data when component mounts
  useEffect(() => {
    const getProfileData = async () => {
      try {
        const { data } = await Axios.get('/admin/getProfile');
       
        setProfile(data)
      } catch (err) {
        Notifier(err.meta.msg, 'Error')
      } finally {
        setLoading(false);
      }
    };

    getProfileData();
  }, []);

  return (
    <div className="row">
      <div className="col-md-4 col-xl-4">
        <div className="card mb-3">
          <div className="card-header">
            <h5 className="card-title mb-0">Profile Details</h5>
          </div>
          <div className="card-body text-center">
            {loading ? (<>Loading...</>) : (<>
              {profile ? (
                <>
                  <img src={userPic} alt="Christina Mason" className="img-fluid rounded-circle mb-2" width="128" height="128" />
                  <h5 className="card-title mb-0">{profile?.name} ({profile?.userName})</h5>
                  <h5 className="card-title mb-0">{profile.mobileNumber}</h5>
                  <div className="text-muted mb-2">{profile.userType}</div>
                </>
              ) : (<p>No profile data available.</p>)}
            </>)}

          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile