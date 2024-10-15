import { createSlice } from "@reduxjs/toolkit";


const CartSlice = createSlice({
    name:'cart',
    initialState:{
        items:localStorage.getItem('cartItems')? JSON.parse(localStorage.getItem('cartItems')):[],
       loading:false ,
       shippingInfo: localStorage.getItem('shippingInfo')? JSON.parse(localStorage.getItem('shippingInfo')):{}   
    },
    reducers:{
        addCartItemRequest(state,action){
            return{
                ...state,
                loading:true
            }
        },
        addCartItemSuccess(state,action){
            const item = action.payload

            const isItemExist = state.items.find(i => i.product === item.product);

            if(isItemExist){
                state.items = state.items.map(i => 
                    i.product === isItemExist.product ? { ...i, quantity: i.quantity + item.quantity } : i
                  );
                } else {
                  // Add the new item to the array (state.items is already an array)
                  state.items.push(item);
                }
          
                state.loading = false;
                localStorage.setItem('cartItems',JSON.stringify(state.items));
            },
            increaseCartItemsQty(state,action) {
                state.items=state.items.map(item => {
                    if(item.product === action.payload){
                        item.quantity = item.quantity +1
                    }
                    return item;
                })
                localStorage.setItem('cartItems',JSON.stringify(state.items));
            },
            decreaseCartItemsQty(state,action) {
                state.items=state.items.map(item => {
                    if(item.product === action.payload){
                        item.quantity = item.quantity -1
                    }
                    return item;
                })
            localStorage.setItem('cartItems',JSON.stringify(state.items));
        }, 
        // remove   
        removeItemFromCart(state,action){
            const filterItems =state.items.filter(item => {
                return item.product !== action.payload
            })
            localStorage.setItem('cartItems',JSON.stringify(filterItems));
            return{
                ...state,
                items:filterItems 
            }
        },
        saveShippingInfo (state,action) {
            localStorage.setItem('shippingInfo',JSON.stringify(action.payload));
            return{
                ...state,
                shippingInfo:action.payload
            }
        },
        orderCompleted (state,action) {
            localStorage.removeItem('shippingInfo');
            localStorage.removeItem('cartItems');
            sessionStorage.removeItem('orderInfo');    
            return{
                items:[],
                loading:false ,
                shippingInfo:{}   
            }
        }
 
    }  
});


const {actions,reducer } = CartSlice;

export const{addCartItemRequest,addCartItemSuccess,
             increaseCartItemsQty,decreaseCartItemsQty,
             removeItemFromCart,saveShippingInfo ,orderCompleted} = actions;

export default reducer;