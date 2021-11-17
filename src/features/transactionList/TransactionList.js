import React, { useState, useEffect } from 'react';
import axios from "axios";
import useMedia from "use-media";
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { transactionListSelector, getAllTransaction } from './transactionListSlice';
import {
  Container,
  Table
} from 'react-bootstrap';
import "./TransactionList.scss";
import { BsFillCaretDownFill } from "react-icons/bs";
import {
  MdOutlineCategory,
  MdAttachMoney,
  MdCheckBoxOutlineBlank,
  MdCheckBox
} from "react-icons/md";
import Paging from '../pagination/Paging';

const TransactionList = () => {

  const location = useLocation();
  console.log("this is coming from backend", location.state);

  //redux
  const dispatch = useDispatch();
  const transactionList = useSelector(transactionListSelector);
  console.log(transactionList); //undefined

  //when the component is mounted
  useEffect(() => {

    const config = {
      headers: {
        "Content-type": "application/json"
      },
    };

    (async () => {
      try {
        //get all transaction data from backend
        const response = await axios.get("http://localhost:5000/alltransaction/all", config);
        if (response.statusText !== "OK") {
          throw response.statusText;
        } else {
          //dispatch
          dispatch(getAllTransaction(response.data));
        }
      } catch (error) {
        console.error(`${error}: Something wrong on the server side`);
        return error;
      }
    })();

  }, [location.state]);

  //Media query
  const isLG = useMedia({ minWidth: "992px" }); //lg
  const isXL = useMedia({ minWidth: "1200px" }); //xl
  const isXXL = useMedia({ minWidth: "1400px" }); //xxl

  return (
    <>
      <Container fluid className="transactionListContainer">
        {!transactionList.length == 0 ? (<>
          {!(isLG || isXL || isXXL) ? (
            <>
              {/* Mobile view */}
              <Table className="transactionList">
                <thead className="tableTitle">
                  <tr>
                    <th><MdCheckBoxOutlineBlank /></th>
                    <th className="titleCategory"><MdOutlineCategory /> Category <BsFillCaretDownFill /></th>
                    <th className="titleAmount"><MdAttachMoney /> <BsFillCaretDownFill /></th>
                  </tr>
                </thead>
                <tbody className="tableBody">
                  {transactionList.map((elem, index) => (
                    <>
                      <tr key={index}>
                        <td><MdCheckBoxOutlineBlank className="checkBox"/></td>
                        <td className="tdLeft">
                          <p className="category">{elem.categoryName}</p>
                          <p>{elem.description}</p>
                          <p className="paymentMethod">{elem.paymentMethod}</p>
                        </td>
                        <td className="tdRight">
                          <p>${elem.amount}</p>
                          <p>{elem.date.substr(0, 10).replace("-", "/")}</p>
                        </td>
                      </tr>
                    </>
                  ))}
                  <tr className="paging">
                    <td colSpan="6"><Paging /></td>
                  </tr>
                </tbody>
              </Table>
            </>
          ) : (
            <>
              {/* Desktop view */}
              <Table className="transactionList">
                <thead className="tableTitle">
                  <tr>
                    <th><MdCheckBoxOutlineBlank /></th>
                    <th className="titleCategory">Category <BsFillCaretDownFill /></th>
                    <th className="titleCategory">Date <BsFillCaretDownFill /></th>
                    <th className="titleCategory">Payment Method <BsFillCaretDownFill /></th>
                    <th className="titleCategory">Description <BsFillCaretDownFill /></th>
                    <th className="titleCategory">Amount <BsFillCaretDownFill /></th>
                  </tr>
                </thead>
                <tbody className="tableBody">
                  {transactionList.map((elem, index) => (
                    <>
                      <tr key={index}>
                        <td><MdCheckBoxOutlineBlank className="checkBox"/></td>
                        <td>{elem.categoryName}</td>
                        <td>{elem.date.substr(0, 10).replace("-", "/")}</td>
                        <td>{elem.paymentMethod}</td>
                        <td>{elem.categoryName}</td>
                        <td>${elem.amount}</td>
                      </tr>
                    </>
                  ))}
                  <tr className="paging">
                    <td colSpan="6"><Paging /></td>
                  </tr>
                </tbody>
              </Table>
            </>
          )}
        </>) : (<h2>No Transaction Added yet</h2>)}

      </Container>
    </>
  );
};

export default TransactionList;
