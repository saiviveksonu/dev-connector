import { createStore, applyMiddleware} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from "redux-thunk";
import rootreducer from "./reducers/index"
const initialstate={};
const middleware=[thunk];
const store=createStore(rootreducer,initialstate,composeWithDevTools(applyMiddleware(...middleware)))
export default store