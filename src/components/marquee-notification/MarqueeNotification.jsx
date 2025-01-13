import { useState, useEffect } from 'react'
import Axios from '../../api/Axios';

function MarqueeNotification() {

    const [notification, setNotification] = useState("");

    const getMarquee = async () => {
        try {
            const { data } = await Axios.get(`/marquee/getMarquee`);

            setNotification(data.notification || '')
        } catch (error) {

            // Notifier(error?.meta?.msg, 'Error')
        }
    }

    useEffect(() => {
        getMarquee();
    }, []);

    return (
        <marquee>
            {notification}
        </marquee>
    );
}

export default MarqueeNotification
