import React from 'react'
import { toast } from "react-toastify";

const Notifier = (messgae, type) => {
    switch (type) {
        case "Success":
            toast.success(messgae);
            break;
        case "Error":
            toast.error(messgae);
            break;
        case "Info":
            toast.info(messgae);
            break;
        case "Warning":
            toast.warn(messgae);
            break;
        default:
            toast("Default Notification");
            break;
    }
}

export default Notifier