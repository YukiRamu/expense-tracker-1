import React, { useState, useEffect } from 'react';
import axios from "axios";
import useMedia from "use-media";
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { transactionListSelector, getAllTransaction, checkTransaction } from './transactionListSlice';
import { changeOperation, enterTransactionSelector } from '../enterTransaction/enterTransactionSlice';
import {
  Container,
  Table,
  Form
} from 'react-bootstrap';
import "./TransactionList.scss";
import { BsFillCaretDownFill } from "react-icons/bs";
import {
  MdOutlineCategory,
  MdAttachMoney,
  MdCheckBoxOutlineBlank,
} from "react-icons/md";
import Paging from '../pagination/Paging';

const TransactionList = () => {

  //Media query
  const isLG = useMedia({ minWidth: "992px" }); //lg
  const isXL = useMedia({ minWidth: "1200px" }); //xl
  const isXXL = useMedia({ minWidth: "1400px" }); //xxl
  const location = useLocation();

  //redux
  const dispatch = useDispatch();
  const transactionList = useSelector(transactionListSelector);
  const operation = useSelector(enterTransactionSelector);

  //private state
  const [tranList, setTranList] = useState([]);
  console.log("transaction list from Redux", transactionList);


  //method
  //when the component is mounted
  useEffect(() => {
    transactionList.filteredTran.length !== 0 ?
      setTranList(transactionList.filteredTran) :
      setTranList(transactionList.allTran);
  }, [transactionList]);

  //when the component is mounted get all transaction data from backend
  //This is for the case where a user navigates to this page from another page
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

  //Checkbox control
  const handleCheck = (id, e) => {
    const payload = tranList.filter(e => e._id == id);

    console.log(payload);
    //when it is checked, delete or edit action can be done
    if (e.target.checked) {

      //change isEditing true only for the selected item
      dispatch(checkTransaction({
        id: payload[0]._id,
        date: payload[0].date,
        categoryId: payload[0].categoryId,
        categoryName: payload[0].categoryName,
        transactionType: payload[0].transactionType,
        description: payload[0].description,
        currency: payload[0].currency,
        amount: payload[0].amount,
        paymentMethod: payload[0].paymentMethod,
        isDeleted: payload[0].isDeleted,
        isEditing: true
      }));

      //make edit and delete button visible - editing mode on
      dispatch(changeOperation({
        editDelBtnVisible: true,
        checkedItem: payload //array
      }));
    }
    else {

      //change isEditing back to false
      dispatch(checkTransaction({
        id: payload[0]._id,
        date: payload[0].date,
        categoryId: payload[0].categoryId,
        categoryName: payload[0].categoryName,
        transactionType: payload[0].transactionType,
        description: payload[0].description,
        currency: payload[0].currency,
        amount: payload[0].amount,
        paymentMethod: payload[0].paymentMethod,
        isDeleted: payload[0].isDeleted,
        isEditing: false
      }));

      //make edit and delete button invisible - editing mode off
      dispatch(changeOperation({
        editDelBtnVisible: false,
        checkedItem: []
      }));
    }
  };

  return (
    <>
      <Container fluid className="transactionListContainer">
        {!tranList.length == 0 ?
          (<>
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
                    {tranList.map((elem, index) => (
                      <>
                        <tr key={elem._id}>
                          <td><Form.Check
                            checked={elem.isEditing && true}
                            // disabled={operation.editMode && !elem.isEditing ? true : false}
                            onClick={(e) => handleCheck(elem._id, e)} /></td>
                          <td className="tdLeft">
                            <p className="category">{elem.categoryName}</p>
                            <p>{elem.description}</p>
                            <p className="paymentMethod">{elem.paymentMethod}</p>
                          </td>
                          <td className="tdRight">
                            {elem.transactionType === "expense" ?
                              <p className="negativeAmount">-${elem.amount}</p> :
                              <p>${elem.amount}</p>}
                            <p>{elem.date.substr(0, 10).replace(/-/g, "/")}</p>
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
                    {tranList.map((elem, index) => (
                      <>

                        <tr key={elem._id}>
                          <td><Form.Check
                            checked={elem.isEditing && true}
                            // disabled={operation.editMode && !elem.isEditing ? true : false}
                            onClick={(e) => handleCheck(elem._id, e)} /></td>
                          <td>{elem.categoryName}</td>
                          <td>{elem.date.substr(0, 10).replace(/-/g, "/")}</td>
                          <td>{elem.paymentMethod}</td>
                          <td>{elem.description}</td>
                          {elem.transactionType === "expense" ?
                            <td className="negativeAmount">-${elem.amount}</td> :
                            <td>${elem.amount}</td>}

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
