import React, { useEffect, useState } from "react";
import AntdSwitch from "./antdSwitch";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { MAIN_ROUTE } from "../../constant/urls";
import { toast } from "react-toastify";
import { API_KEY } from "../../constant/constants";
import axios from "axios";
import SettingsIcon from "@mui/icons-material/Settings";
import { motion } from "framer-motion";

export default function Settings() {
  const { mutate, darkMode, text, theme } = useContext(AuthContext);

  const [isDarkMode, setIsDarkMode] = useState(null);

  useEffect(() => {
    isDarkMode !== darkMode && doApiPut();
  }, [isDarkMode]);

  useEffect(() => {
    setIsDarkMode(darkMode);
  }, [darkMode]);

  const doApiPut = async () => {
    const url = MAIN_ROUTE + "users/darkmode";
    if (isDarkMode != null) {
      try {
        let { data } = await axios({
          method: "PUT",
          url,
          headers: { "x-api-key": localStorage[API_KEY] },
          data: { isDarkMode },
        });
        console.log(data);

        if (data.modifiedCount) {
          mutate();
          toast.success("הרקע השתנה בהצלחה!");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div
      style={{
        transition: "0.3s ease-out",
        minHeight: "95vh",
        background: theme,
        color: text,
      }}
    >
      <h2 className="text-center display-4 p-3">
        {" "}
        פרופיל | הגדרות <SettingsIcon fontSize="inherit" />
      </h2>
      <hr style={{ color: text }} />
      <div className="fs-5 d-flex justify-content-center pb-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.8}}
          animate={{ opacity: 1, scale: 1}}
          transition={{ duration: 0.5 }}
          className="p-5 border border-2 border-info rounded-3"
        >
          <p className="text-center">שינוי רקע: </p>
          <hr className="m-0 mb-4 d-flex align-items-center justify-content-center" />
          <AntdSwitch isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        </motion.div>
      </div>
    </div>
  );
}
