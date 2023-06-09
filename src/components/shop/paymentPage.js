import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { apiPost } from "../../services/apiServices";
import { MAIN_ROUTE } from "../../constant/urls";
import AuthContext from "../../context/AuthContext";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Box, Button, CircularProgress } from "@mui/material";
import { Checkbox } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./cart.css";
import Loading from "../loading/loading";
import { motion } from "framer-motion";

export default function PaymentPage() {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const {
    theme,
    text,
    cartPrice,
    mutate,
    doApiGetValue,
    refreshCart,
    productsInCart,
  } = useContext(AuthContext);
  const [isPresent, setIsPresent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkbox, setCheckBox] = useState(false);
  const [sendingData, setSendingData] = useState({
    isPresent: isPresent,
    order_price: cartPrice,
  });
  const [acceptedPayment, setAcceptedPayment] = useState(false);
  const nav = useNavigate();

  const onAcceptPaypal = (details) => {
    toast.success(
      "הרכישה בוצעה בהצלחה על ידי: " + details.payer.name.given_name
    );
    setAcceptedPayment(true);
  };

  const onChange = (e) => {
    setIsPresent(e.target.checked);
    if (productsInCart < 1) {
      nav("/");
      toast.info("העגלה ריקה, עליך לבחור לפחות פריט אחד על מנת לגשת אליה");
    }
  };

  useEffect(() => {
    doApiGetValue();
  }, []);

  useEffect(() => {
    acceptedPayment && doApiPostOrder();
  }, [acceptedPayment]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubForm = (_bodyData) => {
    setLoading(true);
    console.log(_bodyData);

    if (_bodyData) {
      _bodyData.isPresent = isPresent;
      _bodyData.order_price = Number(cartPrice);
      setSendingData(_bodyData);
    }
  };

  useEffect(() => {
    console.log(sendingData);
    if (sendingData !== null) {
      console.log(sendingData);
      setLoading(false);
    }
  }, [sendingData]);

  const doApiPostOrder = async () => {
    const url = MAIN_ROUTE + "orders";
    const data = await apiPost(url, sendingData);
    await refreshCart();
    mutate();
    nav("/");
  };
  const handleChange = () => {
    setCheckBox((checkbox) => !checkbox);
    console.log(checkbox);
  };
  return (
    <>
      {cartPrice > 0 ? (
        <div
          className=""
          style={{
            minHeight: "95vh",
            background: "#fff",
            color: "#262b2f",
          }}
        >
          <h2 className="text-center p-4">תשלום וסיום רכישה</h2>
          <hr style={{ color: "#262b2f" }} className="pb-4" />
          <div
            style={{
              minHeight: "450px",
              background: "#fff",
            }}
            className="container justify-content-between flex-column d-flex align-items-center rounded-2"
          >
            <motion.form
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              style={{ border: `2px solid ${"#262b2f"}`, borderRadius: "8px" }}
              className="p-4"
              onSubmit={handleSubmit(onSubForm)}
              id="id_form"
            >
              {loading && <h2>loading...</h2>}
              <h3>טופס למשלוח במידה וזה לא לכתובת ששמורה בפרופיל שלך</h3>
              <p>* אם הכתובת בפרופיל שלך היא הכתובת הרצויה נא לא למלא כלום *</p>
              <label>עיר</label>
              <input
                {...register("city", {})}
                className="form-control"
                type="text"
              />
              {errors.city && (
                <div className="text-danger">* Enter valid city</div>
              )}
              <label>כתובת</label>
              <input
                {...register("address", {})}
                className="form-control"
                type="text"
              />
              {errors.address && (
                <div className="text-danger">* Enter valid address</div>
              )}
              <label>הודעה לשליח</label>
              <input
                {...register("delivery_msg", {})}
                className="form-control"
                type="text"
              />
              {errors.delivery_msg && (
                <div className="text-danger">* Enter valid delivery_msg</div>
              )}
              <label>טלפון</label>
              <input
                {...register("phone", {})}
                className="form-control"
                type="tel"
              />
              {errors.phone && (
                <div className="text-danger">* Enter valid phone</div>
              )}
              <div className="pt-2">
                <Checkbox
                  {...register("isPresent", {})}
                  type="checkbox"
                  onChange={onChange}
                ></Checkbox>
                <label className="me-2">האם זו מתנה?</label>
                {errors.isPresent && (
                  <div className="text-danger">* Enter valid isPresent</div>
                )}
              </div>
              <br />
              <div className="d-flex align-items-center justify-content-center">
                <Button type="submit" variant="contained" color="success">
                  שמירת הפרטים
                </Button>
              </div>
            </motion.form>
          </div>
          <div className="text-center d-flex pt-5 flex-column justify-content-center align-items-center">
            <div className="mb-3 w-100 d-flex align-items-center justify-content-center">
              <Checkbox
                type="checkbox"
                onClick={handleChange}
                {...label}
                {...register("inMenu", { type: "boolean" })}
              />
              <label className="pe-2">
                האם אתה מאשר שאתה בן 18+ (ללא תעודת זהות לא תוכל לקחת את
                המשלוח)?
              </label>
            </div>
            {loading || Number(cartPrice) > 1.5 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <PayPalScriptProvider
                  options={{
                    "client-id":
                      "AQ_P5k_n2Wq-RUy-b6LelJboRWleBXQAX3rKVKGWycG-wwCYSaHyAOxky5MkWMuPT-nAFhnctDNCise7",
                  }}
                  style={{ width: "250px" }}
                >
                  {checkbox ? (
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: cartPrice,
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order.capture().then(function (details) {
                          onAcceptPaypal(details);
                        });
                      }}
                      style={{ color: "blue", label: "checkout" }}
                    />
                  ) : (
                    <PayPalButtons
                      disabled
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: cartPrice,
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order.capture().then(function (details) {
                          onAcceptPaypal(details);
                        });
                      }}
                      style={{ color: "blue", label: "checkout" }}
                    />
                  )}
                </PayPalScriptProvider>
              </motion.div>
            ) : (
              <Box sx={{ display: "flex" }}>
                <CircularProgress />
              </Box>
            )}
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
