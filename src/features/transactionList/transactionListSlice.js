import { createSlice } from '@reduxjs/toolkit';

function getTransactionTotal(array, type){
  let total = 0;
  array.map(transaction => {
      if(transaction.transactionType === type){
          total += transaction.amount;
      }
  });
  return total;
}

export const transactionListSlice = createSlice({
  name: 'transactionList',
  initialState: {
    allTran: [],
    filteredTran: [],
    balance: {
      income: 0,
      expense: 0,
      total: 0,
    }
  },
  reducers: {
    getAllTransaction: (state, action) => {
      return { ...state, allTran: action.payload };
    },
    checkTransaction: (state, action) => {
      console.log(action);
      state.allTran.map((elem, index) => elem._id == action.payload.id ? state.allTran.splice(index, 1, action.payload) : elem);
    },
    filterByTransactionType: (state, action) => {
      console.log(action.payload);
      return { ...state, filteredTran: action.payload };
    },
    getBalance(state, action) {
      let income = getTransactionTotal(action.payload, "income");
      let expense = getTransactionTotal(action.payload, "expense");
      return {
        ...state,
        balance: {
          income: income,
          expense: expense,
          total: income - expense
        }
      }
    }
  }
});

//export reducer, actions,and state(selector)
export default transactionListSlice.reducer;
export const { getAllTransaction, checkTransaction, filterByTransactionType, getBalance } = transactionListSlice.actions;
export const transactionListSelector = (state) => state.transactionList;

