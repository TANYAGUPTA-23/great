// import React, { useContext } from 'react';
// import { ShopContext } from '../context/ShopContext';
// import Title from './Title';

// const CartTotal = () => {
//     const { currency, delivery_fee, getCartTotal } = useContext(ShopContext); // FIXED: Corrected `delivery_fee` and `getCartTotal`

//     return (
//         <div className='w-full'>
//             <div className='text-2xl'>
//                 <Title text1={'CART'} text2={'TOTALS'} />
//             </div>
//             <div className='flex flex-col gap-2 mt-2 text-sm'>
//                 <div className='flex justify-between'>
//                     <p>Subtotal</p>
//                     <p>{currency}{getCartTotal()}.00</p> {/* FIXED: Corrected function name */}
//                 </div>
//                 <hr />
//                 <div className='flex justify-between'>
//                     <p>Shipping Fee</p>
//                     <p>{currency}{delivery_fee}.00</p> {/* FIXED: Corrected `delivery_fee` spelling */}
//                 </div>
//                 <hr />
//                 <div className='flex justify-between'>
//                     <b>Total</b>
//                     <b>{currency}{getCartTotal() === 0 ? 0 : getCartTotal() + delivery_fee}</b> {/* FIXED: Corrected function name */}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default CartTotal;


import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = () => {
    const {currency, delivery_fee, getCartAmount} = useContext(ShopContext);
  return (
    <div className='w-full'>
        <div className='text-2xl'>
            <Title text1={'CART'} text2={'TOTALS'}/>
        </div>
        <div className='flex flex-col gap-2 mt-2 text-sm'>
            <div className='flex justify-between'>
                <p>Subtotal</p>
                <p>{currency} {getCartAmount()}.00</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <p>Shipping Fee</p>
                <p>{currency} {delivery_fee}</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <p>Total</p>
                <p>{currency} {getCartAmount === 0 ? 0 : getCartAmount() + delivery_fee}</p>
            </div>
        </div>
    </div>
  )
}

export default CartTotal