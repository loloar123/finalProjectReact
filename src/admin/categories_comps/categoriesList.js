import React from "react";
import { useState } from "react";
import { MAIN_ROUTE } from "../../constant/urls";
import { apiGet } from "../../services/apiServices";
import { useEffect } from "react";
import AuthAdminComp from "../authAdminComp";
import { Link } from "react-router-dom";
import { Button, Tooltip } from "@mui/material";
import "./category.css";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import Loading from "../../components/loading/loading";
import { motion } from "framer-motion";

export default function CategoriesList() {
  const [ar, setAr] = useState([]);
  const { theme, text } = useContext(AuthContext);
  let time = 0.1

  useEffect(() => {
    doApi();
  }, []);

  const doApi = async () => {
    let url = MAIN_ROUTE + "categories";
    try {
      const data = await apiGet(url);
      setAr(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AuthAdminComp />
      {ar.length > 0 ? (
        <div style={{ minHeight: "95vh", background: theme, color: text }}>
          <h2 className="text-center display-4">עריכת קטגוריות</h2>
          <hr />
          <div className="d-flex justify-content-center align-items-center">
            <Link
              style={{ textDecoration: "none" }}
              to="/admin/categories/addCategory"
            >
              <Button color="info" variant="contained">
                הוספת קטגוריה
              </Button>
            </Link>
          </div>
          <div style={{ minHeight: "95vh" }} className="container-fluid pb-3">
            <div
              //   style={{ minHeight: "95vh" }}
              className="d-flex flex-wrap justify-content-center"
            >
              {ar.map((item,i) => {
                return (
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: time + i / 10 }}
                    style={{
                      border: `2px solid ${text}`,
                      color: text,
                      background: theme,
                      fontSize: "1.3em",
                    }}
                    className="catParent"
                  >
                    {/* style={{color:text,backgroundColor:theme}}  */}
                    <p className="me-2">שם הקטגוריה: {item.name}</p>
                    {/* <p className="ms-2">האם נמצא בתפריט: {product.inMenu}</p> */}
                    <Tooltip title={item.info}>
                      <p className="me-2">
                        מידע על הקטגוריה: {item.info.substring(0, 22)}
                      </p>
                    </Tooltip>
                    <p className="me-2">סוג הקטגוריה: {item.type}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
